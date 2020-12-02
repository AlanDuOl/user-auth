import { getRepository } from 'typeorm';
import Verification from '../models/verification';
import userService from './userService';
import User from '../models/user';
import utils from '../utils';


const verificationService = {

    async storeActivationHashAsync(token: string, user: User): Promise<void> {
        const repository = getRepository(Verification);
        const hash = await utils.generateHashAsync(token);
        const verification: Verification = {
            token: hash,
            // add 2 hours
            expiresAt: new Date(utils.getCurrentTime() + 3600000 * 2),
            user
        }
        const userVerification = repository.create(verification);
        await repository.save(userVerification);
    },

    async removeVerificationHashAsync(user: User): Promise<void> {
        const repository = getRepository(Verification);
        const verification = await repository.find({ user });
        if (!!verification) {
            await repository.remove(verification);
        }
    },

    async sendVerificationEmailAsync(email: string, token: string, host: string): Promise<void> {
        const smtpTransporter = await utils.getSMTPTransporter();
        const link = `http://${host}:4200/verify?token=${token}`;
        const mailOptions = {
            from: 'from_auth-user@mail.com',
            to: email,
            subject: 'Please confirm your Email account',
            html: `Hello,
            <br> Please Click on the link to verify your email.
            <br><a href="${link}" target="_blank">Click here to verify</a>`
        }
        await smtpTransporter.sendMail(mailOptions);
    },

    async verifyAccount(token: string): Promise<boolean> {
        const repository = getRepository(Verification);
        // create a hash with the token
        const hash = await utils.generateHashAsync(token);
        // look for the hash in the database
        const verification = await repository.findOne({ token: hash }, { relations: ['user'] });
        // if verification entity is found, check if it has not expired
        if (!!verification) {
            const tokenDate = Date.parse(verification.expiresAt.toUTCString());
            if (tokenDate > Date.now()) {
                // if verification has not expired, activate user account and delete the
                // verification entity
                await userService.activateAsync(verification.user.id);
                await repository.delete(verification.token);
                return true;
            }
        }
        return false;
    }

}

export default verificationService;