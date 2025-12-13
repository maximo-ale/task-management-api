import express from 'express';
const router = express.Router();

import { body, param, query } from 'express-validator';
import controller from './boardController.js';

import { auth, onlyOwner, isMember } from '../../middlewares/authMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { createBoardSchema, inviteSchema, updateBoardSchema } from './boardSchema.js';
import { boardIdSchema } from '../../utils/idSchema.js';

router.post('/create',
    validate(createBoardSchema, 'body'),
    auth,
    controller.createBoard);

router.post('/invite/:boardId',
    validate(inviteSchema, 'body'), validate(boardIdSchema, 'params'),
    auth, onlyOwner,
    controller.invite); // id: board

router.get('/member', auth, controller.member);

router.get('/findBoard/:boardId',
    validate(boardIdSchema, 'params'),
    auth, isMember,
    controller.findBoard);

router.patch('/update/:boardId',
    validate(updateBoardSchema, 'body'), validate(boardIdSchema, 'params'),
    auth, onlyOwner,
    controller.update);

router.delete('/delete/:boardId',
    validate(boardIdSchema, 'params'),
    auth, onlyOwner,
    controller.deleteBoard);

export default router;