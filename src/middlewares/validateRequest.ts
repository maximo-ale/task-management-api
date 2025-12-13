import { ZodSchema } from 'zod';
import type { Request, Response, NextFunction } from 'express';

const validate = (schema: ZodSchema, type: 'body' | 'params' | 'query') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[type]);

        if (!result.success){
            return res.status(400).json({
                message: 'Invalid provided fields',
                fields: result.error.flatten(),
            });
        }

        Object.keys(req[type]).forEach(key => delete req[type][key])
        Object.assign(req[type], result.data)
        next();
    }
}

export default validate;