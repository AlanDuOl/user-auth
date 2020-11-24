import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import authService from '../services/authService';
import userService from '../services/userService';
import validationService from '../services/validationService';
import User from '../models/user';
import Role from '../models/role';
import { roleNames } from '../constants';
import { RegisterUser, UserData, LoginUser } from '../viewmodels';

const accountController = {

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

    async registerAsync(req: Request, res: Response) {

        const userRepository = getRepository(User);
        const data: RegisterUser = { ...req.body };

        // validate data format
        await validationService.validateRegisterDataAsync(data);

        // check if passwords match
        if (data.password !== data.confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        // check if user with email does not exist
        const userFromDb = await userService.findByEmailAsync(data.email);
        if (!!userFromDb[0]) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // create a password hash
        const hash = await authService.hashPasswordAsync(data.password);

        // Add roles
        const userRole = new Role();
        userRole.name = roleNames.user;

        const user: UserData = {
            name: data.name,
            email: data.email,
            passwordHash: hash,
            roles: [userRole],
            isVerified: false
        }

        const newUser = userRepository.create(user)
        await userRepository.save(newUser);
        return res.status(201).json({ message: 'User created successfully'});

    },

    async loginAsync(req: Request, res: Response) {

        const data: LoginUser = { ...req.body };
        // validate input data
        await validationService.validateLoginDataAsync(data);
        
        // check if user account is verified

        // check if user with email exists
        const userFromDb = await userService.findByEmailAsync(data.email);
        if (!userFromDb) {
            // return not found if user does not exit
            return res.status(404).json({ message: "Wrong credentials" });
        }

        // validate password
        const isValid = await authService
        .validatePasswordAsync(data.password, userFromDb.passwordHash);
        if (isValid) {
            // get user data and generate the authentication token
            const userData = await userService.getUserDataAsync(userFromDb);
            const result = await authService.generateTokenAsync(userData);
            res.status(200).json(result);
        }
        else {
            res.status(400).json({ message: 'Authentication failed' });
        }

    },

    async validateAsync() {}

}

export default accountController;