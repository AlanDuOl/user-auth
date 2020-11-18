import { getRepository, getCustomRepository } from 'typeorm';
import User from '../models/user';

const userService = {
    async findByEmailAsync(email: string) {
        const userRepository = getRepository(User);
        const user = await userRepository.find({ email })
        return user;
    },

    async findRolesAsync(id: number) {
        const userRepository = getRepository(User);
        const user = await userRepository.find({ 
            relations: ['roles'],
            where: { id }
        })
        const roles = user[0].roles.map(role => role.name);
        return roles;
    }
}

export default userService;