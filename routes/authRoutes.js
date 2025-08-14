const {register, login} = require('../controllers/authController');
const express = require('express');
const router = express.Router();

const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

router.post('/register',
    body('name').isString().withMessage('Name must be a string').bail().trim().notEmpty().withMessage('Invalid name'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password').isString().withMessage('Password must be a string').bail().trim().isLength({min: 5}).withMessage('Password must be at least 5 characters long'),
    validateRequest , register);

router.post('/login',
    body('name').optional().trim().notEmpty().withMessage('Invalid name'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('password').trim().notEmpty().withMessage('Invalid password'),
    validateRequest, login);

module.exports = router;