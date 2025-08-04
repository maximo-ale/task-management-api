const express = require('express');
const router = express.Router();
const {createList, modifyList, deleteList, getLists} = require('../controllers/listController');
const { auth, isMember } = require('../middlewares/authMiddleware');
const idValidator = require('../middlewares/idValidator');

router.get('/board/:id/lists', auth, idValidator, isMember, getLists); // All lists in a board
router.post('/create/:id', auth, idValidator, isMember, createList);
router.patch('/modify/:id', auth, idValidator, isMember, modifyList);
router.delete('/delete/:id', auth, idValidator, isMember, deleteList);

module.exports = router;