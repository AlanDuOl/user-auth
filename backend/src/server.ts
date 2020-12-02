import express from 'express';
import cors from 'cors';
// this must be imported before routes
import 'express-async-errors';
import './database/connection';
import routes from './routes';
import requestErrorHandler from './middlewares/errorHandler';
import 'reflect-metadata';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(requestErrorHandler);

app.listen(2000, () => {
    console.log('server listening on port 2000');
});