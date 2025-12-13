import User from './User.js';

import bcrypt from 'bcrypt';
import generateToken from '../../utils/generateToken.js';
import authService from './authService.js';
import type { Request, Response } from 'express';

class AuthController{
    async register(req: Request, res: Response){
        const user = await authService.register(req.body);

        res.status(201).json({
            message: 'User created successfully',
            user,
        });
    }

    async login(req: Request, res: Response){
        const token = await authService.login(req.body);

        return res.status(200).json({ token });
    }
}

export default new AuthController();