
import { Router } from 'express';
import accountController from './controllers/accountController';

const routes = Router();

routes.post('/register', accountController.registerAsync);
routes.post('/login', accountController.loginAsync);
routes.post('/validation', accountController.validateAsync);
routes.get('/', accountController.getAsync);

export default routes;