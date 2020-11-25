import crypto from 'crypto';
import { getRepository } from 'typeorm';
import Verification from '../models/verification'
import User from '../models/user';


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
        const repository = getRepository(Verification)
        const hash = this.generateActivationHash(token);
        const verification: Verification = {
            token: hash,
            expiresAt: new Date(Date.now() + 60 * 1),
            user
        }
        const userVerification = repository.create(verification);
        await repository.save(userVerification);
    }
}

export default verificationService;