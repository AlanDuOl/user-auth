
import { Router } from 'express';
import userController from './controllers/userController';

const routes = Router();

routes.post('/create', userController.createAsync);
routes.post('/login', userController.loginAsync);
routes.get('/', userController.getAsync);

export default routes;