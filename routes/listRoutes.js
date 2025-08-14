const express = require('express');
const router = express.Router();
const {createList, modifyList, deleteList, getLists} = require('../controllers/listController');
const { auth, isMember } = require('../middlewares/authMiddleware');

const { body, param, query } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

router.get('/board/:id/lists',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, isMember, getLists); // All lists in a board
    
router.post('/create/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    body('title').isString().withMessage('Title must be a string').bail().trim().notEmpty().withMessage('Invalid title value'),
    body('position').isInt().withMessage('Invalid position value').toInt(),
    validateRequest, auth, isMember, createList);

router.patch('/modify/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    body('title').optional().isString().withMessage('Title must be a string').bail().trim().notEmpty().withMessage('Invalid title value'),
    body('position').optional().isInt().withMessage('Invalid position value').toInt(),
    validateRequest, auth, isMember, modifyList);

router.delete('/delete/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, isMember, deleteList);

module.exports = router;