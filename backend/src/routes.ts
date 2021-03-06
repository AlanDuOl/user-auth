import { Router } from 'express';
import accountController from './controllers/accountController';
import genericController from './controllers/genericController';
import authenticationHandler from './middlewares/authHandler';
import { authorizationHandler } from './middlewares/authorizationHandler';

const routes = Router();

routes.get('/verify/:token', accountController.verifyAsync);
routes.get('/sendemail/:id', accountController.sendVerificationAsync);
routes.get('/validatecode/:token', accountController.validateResetCodeAsync);
routes.get('/sendcode/:email', accountController.sendResetCodeAsync);
routes.get('/admin/:id', authenticationHandler, authorizationHandler('Admin'),
    genericController.getAdminAsync);
routes.get('/public', genericController.getPublicAsync);
routes.get('/user', authenticationHandler, genericController.getUserAsync);
routes.post('/resetpassword', accountController.resetPassword);
routes.post('/register', accountController.registerAsync);
routes.post('/login', accountController.loginAsync);

export default routes;