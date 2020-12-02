import { Request, Response } from 'express';

const accountController = {

    async getUserAsync(req: Request, res: Response) {
        return res.status(200).json({ message: 'User request complete' });
    },

}

export default accountController;