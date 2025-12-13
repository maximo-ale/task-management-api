import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError){
        return res.status(err.statusCode).json({error: err.message});
    }

    if (err.code === 11000){
        const keys = Object.keys(err.keyValue).join(', ');
        const values = Object.values(err.keyValue).join(', ');

        return res.status(400).json({
            error: `Duplicated key error for keys ${keys} with values ${values}`,
        });
    }

    console.error(err);
    return res.status(500).json({message: 'Internal server error'});
}

export default errorHandler;