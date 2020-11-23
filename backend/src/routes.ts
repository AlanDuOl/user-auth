
import { Router } from 'express';
import userController from './controllers/userController';

const routes = Router();

routes.post('/register', userController.registerAsync);
routes.post('/login', userController.loginAsync);
routes.get('/', userController.getAsync);

export default routes;