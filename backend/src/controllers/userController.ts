import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import authService from '../services/authService';
import userService from '../services/userService';
import User from '../models/user';
import Role from '../models/role';
import { roleNames } from '../constants';
import * as Yup from 'yup';
import { UserData } from '../viewmodels';

const userController = {

    async getAsync(req: Request, res: Response) {
        const authorization = req.header('Authorization');
        const token = authorization?.split(' ')[1];
        // if Bearer token is present, check if it is valid
        if (!!token) {
            try {
                await authService.validateTokenAsync(token);
                res.status(200).json({ message: 'Request complete' });
            }
            catch (err) {
                res.status(401).json({ message: err.message });
            }
        }
        else {
            res.status(401).json({});
        }
    },

    async createAsync(req: Request, res: Response) {

        const userRepository = getRepository(User);
        const data = { ...req.body };

        const schema = Yup.object().shape({
            name: Yup.string().required().max(100),
            email: Yup.string().email().required().max(100),
            password: Yup.string().required(),
            confirmPassword: Yup.string().required(),
        });
        
        // validate form data
        await schema.validate(data, { abortEarly: false });

        // check if passwords match
        if (data.password !== data.confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        // check if user with email exists
        const userFromDb = await userService.findByEmailAsync(data.email);
        if (!!userFromDb) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const hash = await authService.hashPasswordAsync(data.password);

        // Add roles
        const userRole = new Role();
        userRole.name = roleNames.user;

        const user: UserData = {
            name: data.name,
            email: data.email,
            passwordHash: hash,
            roles: [userRole]
        }

        const newUser = userRepository.create(user)
        await userRepository.save(newUser);
        return res.status(201);

    },

    async loginAsync(req: Request, res: Response) {

        const data = { ...req.body };
        
        const schema = Yup.object().shape({
            email: Yup.string().email().required().max(100),
            password: Yup.string().required(),
        });

        // validate form data
        await schema.validate(data, { abortEarly: false });

        // check if user with email exists
        const userFromDb = await userService.findByEmailAsync(data.email);
        if (!userFromDb[0]) {
            return res.status(404).json({ message: "Wrong credentials" });
        }
        // validate password
        const isValid = await authService
        .validatePasswordAsync(data.password, userFromDb[0].passwordHash);
        if (isValid) {
            // find roles
            const roles = await userService.findRolesAsync(userFromDb[0].id);
            const userData = {
                id: userFromDb[0].id,
                name: userFromDb[0].name,
                roles
            }
            const result = await authService.generateTokenAsync(userData);
            res.status(200).json(result);
        }
        else {
            res.status(400).json({ message: 'Authentication failed' });
        }

    }

}

export default userController;