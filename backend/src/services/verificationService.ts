import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { getRepository } from 'typeorm';
import Verification from '../models/verification'
import User from '../models/user';
import Mail from 'nodemailer/lib/mailer';


const verificationService = {

    generateActivationToken(): string {
        try {
            const token = crypto.randomBytes(16).toString('hex');
            return token;
        } catch (error) {
            return '';
        }
    },
    generateActivationHash(token: string): string {
        const hash = crypto.createHash('sha256');
        hash.update(token);
        return hash.digest('hex');;
    },

    async storeActivationHashAsync(token: string, user: User): Promise<void> {
        await this.removeTokenAsync(user);
        const repository = getRepository(Verification);
        const hash = this.generateActivationHash(token);
        
        const verification: Verification = {
            token: hash,
            // wrong date. Date.now is returning Europe timezone
            expiresAt: new Date(),
            user
        }
        const userVerification = repository.create(verification);
        await repository.save(userVerification);
    },

    async removeTokenAsync(user: User): Promise<void> {
        const repository = getRepository(Verification);
        const verification = await repository.findOne({ user });
        if (!!verification) {
            await repository.remove(verification);
        }
    },

    async sendVerificationEmailAsync(email: string, token: string, host: string): Promise<void> {
        const smtpTransporter = await this.getSMTPTransporter();
        const link = `http://${host}/verify?id=${token}`;
        const mailOptions = {
            from: 'from_auth-user@mail.com',
            to: email,
            subject: 'Please confirm your Email account',
            html: `Hello,
            <br> Please Click on the link to verify your email.
            <br><a href="${link}">Click here to verify</a>`
        }
        await smtpTransporter.sendMail(mailOptions);
    },

    async getSMTPTransporter(): Promise<Mail> {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'margarete.prohaska19@ethereal.email',
                pass: 'FydbZTKHQvV8DnTFbc'
            }
        });
        await transporter.verify();
        return transporter;
    }
}

export default verificationService;