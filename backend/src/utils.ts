import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import crypto from 'crypto';

const utils = {

    getCurrentTime(): number {
        // wrong date. Date.now is returning Europe timezone
        // subtract 3h
        // const currentTime = Date.now() - 3600000 * 3;
        const currentTime = Date.now();
        return currentTime;
    },

    async getSMTPTransporter(): Promise<Mail> {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: '',
                pass: ''
            }
        });
        // verify if configuration is working
        await transporter.verify();
        return transporter;
    },

    async generateTokenAsync(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const token = crypto.randomBytes(16).toString('hex');
                resolve(token);
            } catch (error) {
                reject(error);
            }
        });
    },

    async generateHashAsync(token: string): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const hash = crypto.createHash('sha256');
                hash.update(token);
                const finalHash = hash.digest('hex');
                resolve(finalHash);
            } catch (error) {
                reject(error);
            }
        });
    },
    
}

export default utils;