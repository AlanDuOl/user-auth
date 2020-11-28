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
            expiresAt: new Date(Date.now() + 3600000 * 2),
            user
        }
        const newChangePassword = repository.create(changePassword);
        await repository.save(newChangePassword);
    },

    async removeHashAsync(user: User): Promise<void> {
        const repository = getRepository(ChangePassword);
        const changePassword = await repository.find({ user });
        if (!!changePassword) {
            await repository.remove(changePassword);
        }
    },

    async sendResetEmailAsync(email: string, token: string): Promise<void> {
        const smtpTransporter = await verificationService.getSMTPTransporter();
        const mailOptions = {
            from: 'from_auth-user@mail.com',
            to: email,
            subject: 'Please confirm your Email account',
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

}

export default resetService;