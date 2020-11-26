
import { Router } from 'express';
import accountController from './controllers/accountController';

const routes = Router();

routes.get('/verify/:token', accountController.verifyAsync);
routes.post('/register', accountController.registerAsync);
routes.post('/login', accountController.loginAsync);
routes.get('/', accountController.getAsync);

export default routes;