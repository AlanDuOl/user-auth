import { Request, Response, RequestHandler, NextFunction } from 'express';
import authService from '../services/authService';


const authenticationHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    // get token from header
    const token = authService.getTokenFromHeader(req.header('Authorization'));
    if (!!token) {
        // if there is a token, validate it
        const result = await authService.validateTokenAsync(token);
        if (!!result) {
            // if token is valid, proceed to route handler
            next();
        }
    }
    return res.status(401).json({ message: 'Require authentication' });
}

export default authenticationHandler;