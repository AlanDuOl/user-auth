import { getRepository } from 'typeorm';
import Role from "../models/role";


const roleService = {

    async getRoleByNameAsync(roleName: string): Promise<Role> {
        const repository = getRepository(Role);
        const role = await repository.findOneOrFail({ name: roleName });
        return role;
    }
    
}

export default roleService;