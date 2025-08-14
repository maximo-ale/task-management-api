const express = require('express');
const {getTasks, createTask, modifyTask, assignUser, deleteTask, moveTask} = require('../controllers/taskController');
const { auth, isMember } = require('../middlewares/authMiddleware');
const idValidator = require('../middlewares/idValidator');
const router = express.Router();

const { body, param, query } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

router.get('/find/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, isMember, getTasks); // Get tasks in a list
    
router.post('/create',
    body('title').isString().withMessage('Title must be a string').bail().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('status').optional().isIn(['to-do', 'in-progress', 'done']).withMessage('Invalid status value'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    validateRequest, auth, isMember, createTask);

router.patch('/modify/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    body('title').optional().isString().withMessage('Title must be a string').bail().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('status').optional().isIn(['to-do', 'in-progress', 'done']).withMessage('Invalid status value'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    validateRequest, auth, isMember, modifyTask);

router.patch('/move/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, isMember, moveTask); // Move task to a list

router.patch('/assign/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, isMember, assignUser); // Assign task to a user

router.delete('/delete/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, isMember, deleteTask);

module.exports = router;