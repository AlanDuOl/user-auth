import { Request, Response } from 'express';

const accountController = {

    async getPublicAsync(req: Request, res: Response) {
        return res.status(200).json({ message: 'Public request complete' });
    },

    async getUserAsync(req: Request, res: Response) {
        return res.status(200).json({ message: 'User request complete' });
    },

}

export default accountController;