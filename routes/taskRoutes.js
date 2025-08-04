const express = require('express');
const {getTasks, createTask, modifyTask, assignUser, deleteTask, moveTask} = require('../controllers/taskController');
const { auth, isMember } = require('../middlewares/authMiddleware');
const idValidator = require('../middlewares/idValidator');
const router = express.Router();

router.get('/find/:id', auth, idValidator, isMember, getTasks); // Get tasks in a list
router.post('/create', auth, isMember, createTask);
router.patch('/modify/:id', auth, idValidator ,isMember, modifyTask);
router.patch('/move/:id', auth, idValidator, isMember, moveTask); // Move task to a list
router.patch('/assign/:id', auth, idValidator, isMember, assignUser); // Assign task to a user
router.delete('/delete/:id', auth, idValidator, isMember, deleteTask);

module.exports = router;