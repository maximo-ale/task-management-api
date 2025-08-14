const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Board = require('../models/Board');
const { member } = require('../controllers/boardController');
const List = require('../models/List');
const Task = require('../models/Task');

const auth = async (req, res, next) => {

    // Get token from header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token){
        return res.status(401).json({message: 'No token'});
    }
    try {
        // Verify neither token has expired nor is invalid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.userId;

        // Only users from the DB
        const userInDB = await User.findById(decoded.userId);
        if (!userInDB){
            return res.status(403).json({message: 'Invalid token'});
        }
        
        next();
    } catch {
        return res.status(403).json({message: 'Invalid token'});
    }
}
const onlyOwner = async (req, res, next) => {
    try {
        const board = await Board.findById(req.params.id);

        if (!board){
            return res.status(404).json({message: 'Board not found'});
        }
        if (!board.owner.equals(req.userId)){
            return res.status(403).json({message: 'Not authorized'});
        }
        next();
    } catch (err){
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}
const isMember = async (req, res, next) => {
    try {
        const userId = req.userId;
        let board;
        let list;
        let task;

        if ((!mongoose.Types.ObjectId.isValid(req.body.listId)) && (req.body.listId)){
            return res.status(400).json({message: 'Invalid ID'});
        }
        
        if (!mongoose.Types.ObjectId.isValid(req.body.taskId) && req.body.taskId){
            return res.status(400).json({message: 'Invalid ID'});
        }

        // Find list
        if (req.params.id || req.body.listId){
            list = await List.findOne({
                $or: [
                    {_id: req.params.id},
                    {_id: req.body.listId},
                ],
            }).populate('board'); 
        }
        
        // Find task
        if (req.params.id || req.body.taskId){
            task = await Task.findOne({
                $or: [
                    {_id: req.params.id},
                    {_id: req.body.taskId},
                ],
            }).populate({
                path: 'list',
                populate: {path: 'board'},
            });
        }

        // Find board
        if (list){
            board = list.board;
        } else if (task){
            board = task.list.board;
        } else {
            board = await Board.findById(req.params.id);
        }

        if (!board){
            return res.status(404).json({message: 'Board not found'});
        }

        req.board = board;
        req.list = list;
        req.task = task;

        const isOwner = board.owner.equals(userId);
        const isMember = board.members.some(member => member.equals(userId));

        if (!isOwner && !isMember){
            return res.status(403).json({message: 'Access denied. You must join the board first'});
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {auth, onlyOwner, isMember};