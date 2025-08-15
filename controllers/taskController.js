const Task = require('../models/Task');
const User = require('../models/User');

exports.getTasks = async (req, res) => {
    try {
        const {state, date, assignedTo, tags} = req.query;
        const board = req.board._id;
        const filter = {board};

        if (state) filter.state = state;
        if (date) filter.date = {$eq: new Date(date)};
        if (assignedTo) filter.assignedTo = assignedTo;
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            filter.tags = {$in: tagArray};
        };

        const tasks = await Task.find({...filter, list: req.params.id}).populate({
            path: 'list',
            populate: {
                path: 'board',
            },
        });

        if(tasks.length === 0){
            return res.status(200).json({message: `List ${req.params.id} has 0 tasks`});
        }

        res.status(200).json({
            message: 'Tasks found',
            tasks,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

exports.createTask = async (req, res) => {
    try {
        const {title, description, status, dueDate, tags, assignedTo} = req.body;
        const list = req.list;

        if (!list){
            return res.status(400).json({message: 'List is mandatory'});
        }

        const possibleTitle = await Task.findOne({title, list});
        if (possibleTitle){
            return res.status(400).json({message: 'Lists cannot have 2 tasks named the same'});
        }
        
        const newTask = new Task({
            title,
            description,
            status,
            dueDate,
            tags,
            list,
            board: list.board,
            assignedTo,
        });

        await newTask.save();

        res.status(201).json({
            message: 'Task created successfully',
            task: newTask,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

exports.modifyTask = async (req, res) => {
    try {
        const {title, assignedTo, list} = req.body;

        if (assignedTo) {
            return res.status(400).json({message: 'Cannot assign task to someone here'});
        }
        
        if (list){
            return res.status(400).json({message: 'Cannot modify list of the task'});
        }

        const possibleTitle = await Task.findOne({title, list: req.task.list});
        if (possibleTitle && !possibleTitle._id.equals(req.task._id)){
            return res.status(400).json({message: 'Task title must be unique'});
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true, runValidators: true},
        );

        if (!task){
            return res.status(404).json({message: 'Task not found'});
        }

        res.status(200).json({
            message: 'Successfully updated task',
            task,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

exports.moveTask = async (req, res) => {
    try {
        const list = req.list;
        const task = req.task;

        if (!list || !task){
            return res.status(404).json({message: 'List or task not found'});
        }

        if (!list.board.equals(task.list.board)){
            return res.status(400).json({message: 'Cannot move task to another board'});
        }

        if (task.list.equals(list._id)){
            return res.status(400).json({message: 'Task is already in that list'});
        }
        task.list = list._id;
        await task.save();

        res.status(200).json({
            message: 'Task moved successfully',
            task,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}
exports.assignUser = async (req, res) => {
    try {
        const assignTo = await User.findById(req.params.id);

        if (!assignTo){
            return res.status(404).json({message: 'User not found'});
        }
        const task = req.task;
        const board = req.board;

        if (!task) {
            return res.status(404).json({message: 'Task not found'});
        }

        const isMember = board.owner.equals(assignTo._id) || board.members.some(m => m.equals(assignTo._id));
        if (!isMember){
            return res.status(400).json({message: 'Must join the board before assigning someone'});
        }

        const isAssigned = task.assignedTo.some(u => u.equals(assignTo._id));
        if (isAssigned){
            return res.status(400).json({message: 'User is already assigned'});
        }

        const updatedTask = await Task.findByIdAndUpdate(
            task._id,
            {$push: {assignedTo: assignTo._id}},
            {new: true, runValidators: true},
        );

        res.status(200).json({
            message: 'User assigned successfully',
            assignedUsers: updatedTask.assignedTo,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const taskDeleted = await Task.findByIdAndDelete(req.params.id);
        
        if (!taskDeleted){
            return res.status(404).json({message: 'Task not found'});
        }

        res.status(200).json({
            message: 'Task deleted successfully',
            taskDeleted: taskDeleted._id,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}