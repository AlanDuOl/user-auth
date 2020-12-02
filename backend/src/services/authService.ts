import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { PayloadUser } from '../viewmodels';


const authService = {

    async hashPasswordAsync(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    },

    async validatePasswordAsync(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    },

    async generateTokenAsync(user: PayloadUser): Promise<any> {
        const payload = {
            id: user.id,
            name: user.name,
            roles: user.roles,
            exp: Math.floor(Date.now() / 1000) + 60 * 1
        }
        return new Promise((resolve, reject) => {
            try {
                const privateKey = fs.readFileSync(path.resolve(__dirname, '..', '..', 'private.key'));
                const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
                resolve({ ...payload, token });
            }
            catch (err) {
                reject(err);
            }
        });
    },

    async validateTokenAsync(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const publicKey = fs.readFileSync(path.resolve(__dirname, '..', '..', 'public.key'));
                const result = jwt.verify(token, publicKey);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    },

    getTokenFromHeader(authorization: string | undefined): string | undefined {
        const token = authorization?.split(' ')[1];
        return token;
    },
    
}

export default authService;