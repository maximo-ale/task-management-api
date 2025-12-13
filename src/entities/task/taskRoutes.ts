import express from 'express';
import controller from './taskController.js';
import { auth, isMember } from '../../middlewares/authMiddleware.js';
const router = express.Router();

import validate from '../../middlewares/validateRequest.js';
import { createTaskSchema, filterTaskSchema, updateTaskSchema, } from './taskSchema.js';
import { boardIdSchema, listIdSchema, taskIdSchema, userIdSchema } from '../../utils/idSchema.js';

router.get('/find/:boardId',
    validate(filterTaskSchema, 'query'), validate(boardIdSchema, 'params'),
    auth, isMember,
    controller.getTasks);
    
router.post('/create/:listId',
    validate(createTaskSchema, 'body'),
    auth, isMember,
    controller.createTask);

router.patch('/update/:taskId',
    validate(taskIdSchema, 'params'), validate(updateTaskSchema, 'body'),
    auth, isMember,
    controller.updateTask);

router.patch('/move/:taskId',
    validate(taskIdSchema, 'params'), validate(listIdSchema, 'params'),
    auth, isMember,
    controller.moveTask);

router.patch('/assign/:userId',
    validate(userIdSchema, 'params'), validate(taskIdSchema, 'body'),
    auth, isMember,
    controller.assignTaskToUser); // Assign task to a user

router.delete('/delete/:taskId',
    validate(taskIdSchema, 'params'),
    auth, isMember,
    controller.deleteTask);

export default router;