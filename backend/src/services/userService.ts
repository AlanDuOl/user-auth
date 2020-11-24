import { getRepository, getCustomRepository } from 'typeorm';
import User from '../models/user';
import { PayloadUser } from '../viewmodels';

const userService = {
    async findByEmailAsync(email: string): Promise<User> {
        const userRepository = getRepository(User);
        const user = await userRepository.find({ email })
        return user[0];
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

    async getUserDataAsync(user: User): Promise<PayloadUser> {
        const roles = await userService.findRolesAsync(user.id);
        const userData = {
            id: user.id,
            name: user.name,
            roles
        }
        return userData;
    }
}

export default userService;