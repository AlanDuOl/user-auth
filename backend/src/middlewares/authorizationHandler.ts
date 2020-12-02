import { Request, Response, RequestHandler, NextFunction } from 'express';
import userService from '../services/userService';
import validationService from '../services/validationService';

export function authorizationHandler(requiredRole: string): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        // get user id
        const { id } = req.params;
        // validate id
        await validationService.validateIdAsync(+id);
        // get user from db
        const roles = await userService.findRolesAsync(+id);
        // check if user has required role
        const hasRole = roles.includes(requiredRole);
        // authorize or deny access
        if (hasRole) {
            next();
        }
        else {
            return res.status(403).json({ message: 'Access denied' });
        }
    }
}