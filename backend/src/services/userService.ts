import { getRepository } from 'typeorm';
import { roleNames } from '../constants';
import User from '../models/user';
import utils from '../utils';
import { PayloadUser, RegisterUser, NewUser, CustomError } from '../viewmodels';
import authService from './authService';
import resetService from './resetService';
import roleService from './roleService';


const userService = {

    async findByEmailAsync(email: string): Promise<User | undefined> {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ email })
        return user;
    },

    async findRolesAsync(id: number): Promise<string[]> {
        const userRepository = getRepository(User);
        const user = await userRepository.find({ 
            relations: ['roles'],
            where: { id }
        })
        const roles = user[0].roles.map(role => role.name);
        return roles;
    },

    async getPayloadUserAsync(user: User): Promise<PayloadUser> {
        const roles = await userService.findRolesAsync(user.id);
        const payloadUser = {
            id: user.id,
            name: user.name,
            roles
        }
        return payloadUser;
    },

    async createUserAsync(user: RegisterUser): Promise<User> {
        const userRepository = getRepository(User);
        // create a password hash
        const hash = await authService.hashPasswordAsync(user.password);

        // Add roles
        const userRole = await roleService.getRoleByNameAsync(roleNames.user);

        const userData: NewUser = {
            name: user.name,
            email: user.email,
            passwordHash: hash,
            roles: [userRole],
            isVerified: false,
            createdAt: new Date(utils.getCurrentTime()),
            updatedAt: new Date(utils.getCurrentTime()),
            resetPasswordDate: new Date(utils.getCurrentTime())
        }
        // create user and save it to the database
        const newUser = userRepository.create(userData)
        await userRepository.save(newUser);
        return newUser;
    },

    async getByIdAsync(userId: number): Promise<User> {
        const repository = getRepository(User);
        const user = await repository.findOneOrFail(userId);
        return user;
    },

    async activateAsync(userId: number): Promise<void> {
        const repository = getRepository(User);
        await repository.update(userId, { isVerified: true });
    },

    async resetPassword(password: string, token: string): Promise<boolean> {
        const repository = getRepository(User);
        // create token hash
        const tokenHash = await utils.generateHashAsync(token);
        // get ChangePassword entity
        const changePassword = await resetService.getByIdAsync(tokenHash);
        if (!!changePassword) {
            // get user entity
            const user = await this.getByIdAsync(changePassword.user.id);
            // create password hash
            const newPasswordHash = await authService.hashPasswordAsync(password);
            // throw error if passwords are equal
            if (user.passwordHash === newPasswordHash) {
                throw new CustomError(400, 'Password must be different than current password');
            }
            // change password
            await repository.update(changePassword.user.id, { 
                passwordHash: newPasswordHash,
                resetPasswordDate: new Date(utils.getCurrentTime())
            });
            return true;
        }
        // return false on entity not found
        return false;
    }

}

export default userService;