import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'yup';
import jwt from 'jsonwebtoken';

interface InputValidationError {
    [key: string]: string[]
}

const requestErrorHandler: ErrorRequestHandler = (error, request, response, next) => {
    if (error instanceof ValidationError) {
        let errors: InputValidationError = {};
        try {
            error.inner.forEach(err => {
                errors[err.path] = err.errors;
            });
        } catch (error) {
            console.error('error on error')
        }

        return response.status(400).json({ message: 'Validation error', errors });
    }
    else if (error instanceof jwt.JsonWebTokenError) {
        return response.status(401).json({ message: 'Unauthorized' });
    }
    return response.status(500).json({ message: 'Internal server error', error });
}

export default requestErrorHandler;