import { getRepository, getCustomRepository } from 'typeorm';
import { roleNames } from '../constants';
import Role from '../models/role';
import User from '../models/user';
import { PayloadUser, RegisterUser, NewUser } from '../viewmodels';
import authService from './authService';

const userService = {
    async findByEmailAsync(email: string): Promise<User | undefined> {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ email })
        return user;
    },

    async findRolesAsync(id: number): Promise<string[]> {
        const userRepository = getRepository(User);
        const user = await userRepository.find({ 
            relations: ['role'],
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
        const userRole = new Role();
        userRole.name = roleNames.user;

        const userData: NewUser = {
            name: user.name,
            email: user.email,
            passwordHash: hash,
            roles: [userRole],
            isVerified: false
        }
        // create user and save it to the database
        const newUser = userRepository.create(userData)
        await userRepository.save(newUser);
        return newUser;
    },

    async getByIdAsync(userId: number): Promise<User | undefined> {
        const repository = getRepository(User);
        const user = await repository.findOne(userId);
        return user;
    },

    async activateAsync(userId: number): Promise<void> {
        const repository = getRepository(User);
        await repository.update(userId, { isVerified: true });
    }
}

export default userService;