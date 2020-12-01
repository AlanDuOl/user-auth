import { getRepository } from 'typeorm';
import { ChangePassword } from '../models/changePassword';
import User from '../models/user';
import verificationService from './verificationService';

const resetService = {

    async storeTokenAsync(token: string, user: User): Promise<void> {
        const repository = getRepository(ChangePassword);
        const hash = await verificationService.generateHashAsync(token);
        const changePassword: ChangePassword = {
            token: hash,
            // wrong date. Date.now is returning Europe timezone
            // subtract 3h and add 5min
            expiresAt: new Date(Date.now() - 3600000 * 3 + 300000),
            validated: false,
            expiresValidation: new Date(Date.now() - 3600000 * 3),
            user
        }
        const newChangePassword = repository.create(changePassword);
        await repository.save(newChangePassword);
    },

    async removeHashAsync(user: User): Promise<void> {
        const repository = getRepository(ChangePassword);
        const changePassword = await repository.findOne({ user });
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
        const tokenHash = await verificationService.generateHashAsync(token);
        // look for the hash in the database
        const changePassword = await repository
            .findOne({ token: tokenHash }, { relations: ['user'] });
        if (!!changePassword) {
            const tokenDate = Date.parse(changePassword.expiresAt.toUTCString());
            // if token has not expired, set validated to true and return true.
            // All other cases, return false
            if (tokenDate > Date.now()) {
                await repository.update(changePassword.token, { validated: true });
                return true;
            }
        }
        return false;
    },

    async allowPasswordChange(token: string): Promise<boolean> {
        const repository = getRepository(ChangePassword);
        // grab changePassword instance
        const entity = await repository.findOne(token);
        if (!!entity) {
            // check if it is validated and validation has not expired
            const dateCheck = Date.parse(entity.expiresValidation.toUTCString());
            if (dateCheck > Date.now() && entity.validated) {
                // remove entity instance from DB and return true
                await repository.remove(entity);
                return true;
            }
        }
        return false;
    }

}

export default resetService;