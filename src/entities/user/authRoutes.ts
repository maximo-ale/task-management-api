import express from 'express';
const router = express.Router();

import controller from'./authController.js';
import validate from '../../middlewares/validateRequest.js';
import { loginSchema, registerSchema } from './authSchema.js';

router.post('/register',
    validate(registerSchema, 'body'),
    controller.register);

router.post('/login',
    validate(loginSchema, 'body'),
    controller.login);

export default router;