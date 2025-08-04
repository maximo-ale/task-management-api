const express = require('express');
const router = express.Router();
const {create, member, invite, findBoard, modify, deleteBoard, showAll, deleteAll} = require('../controllers/boardController');
const { auth, onlyOwner, isMember } = require('../middlewares/authMiddleware');
const idValidator = require('../middlewares/idValidator');

router.post('/create', auth, create);
router.post('/invite/:id', auth, idValidator, onlyOwner, invite);
router.get('/member', auth, member);
router.get('/findBoard/:id', auth, idValidator, isMember, findBoard);
router.patch('/modify/:id', auth, idValidator, onlyOwner, modify);
router.delete('/delete/:id', auth, idValidator, onlyOwner, deleteBoard);
router.get('/getAll', auth, showAll);
router.delete('/deleteAll', auth, deleteAll);

module.exports = router;