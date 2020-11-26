import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { getRepository } from 'typeorm';
import Verification from '../models/verification';
import userService from './userService';
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
            expiresAt: new Date(Date.now() + 3600000 * 2),
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
        const link = `http://${host}:4200/verify?token=${token}`;
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
    },

    async verifyAccount(token: string): Promise<boolean> {
        const repository = getRepository(Verification);
        // create a hash with the token0,
        const hash = this.generateActivationHash(token);
        // look for the hash in the database
        const verification = await repository.findOne({ token: hash }, { relations: ['user'] });
        // if verification entity is found, check if it has not expired
        if (!!verification) {
            // if verification has not expired, set user.isVerified to true and delete the
            // verification entity
            const tokenDate = Date.parse(verification.expiresAt.toUTCString());
            if (tokenDate > Date.now()) {
                await userService.activateAsync(verification.user.id);
                await repository.delete(verification.token);
                return true;
            }
        }
        return false;
    }
}

export default verificationService;