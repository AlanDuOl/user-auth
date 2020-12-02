import { Router } from 'express';
import accountController from './controllers/accountController';

const routes = Router();

routes.get('/verify/:token', accountController.verifyAsync);
routes.get('/sendemail/:id', accountController.sendVerificationAsync);
routes.get('/validatecode/:token', accountController.validateResetCodeAsync);
routes.post('/sendcode/:email', accountController.sendResetCodeAsync);
routes.post('/resetpassword', accountController.resetPassword);
routes.post('/register', accountController.registerAsync);
routes.post('/login', accountController.loginAsync);
routes.get('/', accountController.getAsync);

export default routes;