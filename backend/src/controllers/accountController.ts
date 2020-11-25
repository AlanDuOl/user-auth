import { Request, Response } from 'express';
import User from '../models/user';
import authService from '../services/authService';
import userService from '../services/userService';
import validationService from '../services/validationService';
import verificationService from '../services/verificationService';
import { RegisterUser, LoginUser } from '../viewmodels';

const accountController = {

    async getAsync(req: Request, res: Response) {
        
        // generate verification token
        const token = verificationService.generateActivationToken();
        const user = await userService.findByEmailAsync('alan@gmail.com');
        if (!!user) {
            // store the token in database
            await verificationService.storeActivationHashAsync(token, user);
            // send email
            await verificationService
            .sendVerificationEmailAsync('alanduartevil@gmail.com', token, req.hostname);
            res.status(200).json({ message: 'Email sent?' });
        }
        res.status(404).json({ message: 'User not found' });
        // const token = authService.getTokenFromHeader(req.header('Authorization'));
        // // if Bearer token is present, check if it is valid
        // if (!!token) {
        //     try {
        //         await authService.validateTokenAsync(token);
        //         res.status(200).json({ message: 'Request complete' });
        //     }
        //     catch (err) {
        //         res.status(401).json({ message: err.message });
        //     }
        // }
        // else {
        //     res.status(401).json({ message: 'Require authentication' });
        // }
    },

    async registerAsync(req: Request, res: Response) {

        // grab data from request
        const data: RegisterUser = { ...req.body };

        // validate data format/content
        await validationService.validateRegisterDataAsync(data);

        // check if passwords match
        if (data.password !== data.confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        // check if user with the given email does not exist
        const userFromDb = await userService.findByEmailAsync(data.email);
        if (!!userFromDb) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // create new user
        const newUser = await userService.createUserAsync(data);

        // create activation token
        const activationToken = verificationService.generateActivationToken();
        // save token hash to the database
        await verificationService.storeActivationHashAsync(activationToken, newUser);
        // send verification email
        await verificationService.sendVerificationEmailAsync(newUser.email, activationToken, req.hostname);
        
        // return success response
        return res.status(201).json({ message: 'User created successfully'});

    },

    async loginAsync(req: Request, res: Response) {
        // grab data from request
        const data: LoginUser = { ...req.body };

        // validate input data format/content
        await validationService.validateLoginDataAsync(data);

        // check if user with email exists
        const userFromDb = await userService.findByEmailAsync(data.email);
        if (!userFromDb) {
            // return not found if user does not exit
            return res.status(404).json({ message: "Wrong credentials" });
        }

        // check if user account is verified
        const isVerified = await userService.isVerified(data.email);
        if (!isVerified) {
            return res.status(400).json({ message: "Account not verified" });
        }

        // validate password
        const isValid = await authService
        .validatePasswordAsync(data.password, userFromDb.passwordHash);
        if (isValid) {
            // get user data and generate the authentication token
            const payloadUser = await userService.getPayloadUserAsync(userFromDb);
            const result = await authService.generateTokenAsync(payloadUser);
            res.status(200).json(result);
        }
        else {
            res.status(400).json({ message: 'Authentication failed' });
        }

    },

    async validateAsync() {}

}

export default accountController;