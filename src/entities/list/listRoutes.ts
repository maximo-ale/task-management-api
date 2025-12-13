import express from 'express';
const router = express.Router();
import controller from './listController.js';
import { auth, isMember } from '../../middlewares/authMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { createListSchema, updateListSchema } from './listSchema.js';
import { boardIdSchema, listIdSchema } from '../../utils/idSchema.js';

router.get('/board/:boardId/lists',
    validate(boardIdSchema, 'params'),
    auth, isMember,
    controller.getLists); // All lists in a board
    
router.post('/create/:boardId',
    validate(boardIdSchema, 'params'), validate(createListSchema, 'body'),
    auth, isMember,
    controller.createList);

router.patch('/update/:boardId',
    validate(boardIdSchema, 'params'), validate(updateListSchema, 'body'),
    auth, isMember,
    controller.updateList);

router.delete('/delete/:listId',
    validate(listIdSchema, 'params'),
    auth, isMember,
    controller.deleteList);

export default router;