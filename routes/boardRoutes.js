const express = require('express');
const router = express.Router();
const {create, member, invite, findBoard, modify, deleteBoard} = require('../controllers/boardController');
const { auth, onlyOwner, isMember } = require('../middlewares/authMiddleware');

const { body, param, query } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

router.post('/create',
    body('title').isString().withMessage('Title must be a string').bail().trim().notEmpty().withMessage('Invalid title value'),
    body('description').optional().isString().withMessage('Description must be a string').bail().trim().notEmpty().withMessage('Invalid description value'),
    validateRequest, auth, create);

router.post('/invite/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    validateRequest, auth, invite); // id: board

router.get('/member',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, member);

router.get('/findBoard/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, isMember, findBoard);

router.patch('/modify/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    body('title').optional().isString().withMessage('Title must be a string').bail().trim().notEmpty().withMessage('Invalid title value'),
    body('description').optional().isString().withMessage('Description must be a string'),
    validateRequest, auth, onlyOwner, modify);

router.delete('/delete/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, onlyOwner, deleteBoard);

module.exports = router;