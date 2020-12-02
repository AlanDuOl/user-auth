import { getRepository } from 'typeorm';
import { ChangePassword } from '../models/changePassword';
import User from '../models/user';
import utils from '../utils';
import verificationService from './verificationService';

const resetService = {

    async storeTokenAsync(token: string, user: User): Promise<void> {
        const repository = getRepository(ChangePassword);
        const hash = await verificationService.generateHashAsync(token);
        const changePassword: ChangePassword = {
            token: hash,
            // add 5min
            expiresAt: new Date(utils.getCurrentTime() + 300000),
            validated: false,
            user
        }
        const newChangePassword = repository.create(changePassword);
        await repository.save(newChangePassword);
    },

    async removeHashByUserAsync(user: User): Promise<void> {
        const repository = getRepository(ChangePassword);
        // get tokenHash related with user
        const changePassword = await repository.findOne({
            relations: ['user'],
            where: { user }
        });
        // attempt to remove it
        if (!!changePassword) {
            await repository.remove(changePassword);
        }
    },

    async removeHashByTokenAsync(token: string): Promise<void> {
        const repository = getRepository(ChangePassword);
        const tokenHash = await verificationService.generateHashAsync(token);
        const changePassword = await repository.findOne(tokenHash);
        if (!!changePassword) {
            await repository.remove(changePassword);
        }
    },

    async sendResetEmailAsync(email: string, token: string): Promise<void> {
        const smtpTransporter = await verificationService.getSMTPTransporter();
        const mailOptions = {
            from: 'from_auth-user@mail.com',
            to: email,
            subject: 'Reset password service',
            html: `<p>Hello!</p>
            <p>
                We received a request to reset the password of the account associated with this email address.
                If it was you, use the code bellow to reset the account password. If it was not you, ignore this email.
            </p>
            <p>
                Code: ${token}
            </p>`
        }
        await smtpTransporter.sendMail(mailOptions);
    },

    async validateTokenAsync(token: string): Promise<boolean> {
        const repository = getRepository(ChangePassword);
        // generate a hash with the token
        const tokenHash = await verificationService.generateHashAsync(token);
        // look for the hash in the database
        const changePassword = await repository.findOne(tokenHash);
        if (!!changePassword) {
            const tokenDate = Date.parse(changePassword.expiresAt.toUTCString());
            const currentTime = utils.getCurrentTime();
            // if token has not expired, set validated to true
            // and update expiresAt to now + 5min and return true.
            // All other cases, return false
            if (tokenDate > currentTime) {
                await repository.update(changePassword.token, { 
                    validated: true,
                    expiresAt: new Date(utils.getCurrentTime() + 300000),
                });
                return true;
            }
        }
        return false;
    },

    async allowPasswordChange(token: string): Promise<boolean> {
        const repository = getRepository(ChangePassword);
        // create token hash
        const tokenHash = await verificationService.generateHashAsync(token);
        // grab changePassword instance
        const entity = await repository.findOne(tokenHash);
        if (!!entity) {
            // check if it is validated and validation has not expired
            const dateCheck = Date.parse(entity.expiresAt.toUTCString());
            const currentTime = utils.getCurrentTime();
            if (dateCheck > currentTime && entity.validated) {
                return true;
            }
        }
        return false;
    },

    async getByIdAsync(tokenHash: string): Promise<ChangePassword | undefined> {
        const repository = getRepository(ChangePassword);
        const entity = await repository.findOne({
            relations: ['user'],
            where: { token: tokenHash }
        });
        return entity;
    }

}

export default resetService;