const List = require('../models/List');

// Get all lists from a board
exports.getLists = async (req, res) => {
    try {
        const board = req.board;
        const lists = await List.find({board: board._id});

        if (lists.length === 0){
            return res.status(200).json({message: `Board ${board._id} has no lists`});
        }

        res.status(200).json({
            message: 'Lists from board found',
            lists,
        });
    } catch (err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Create list (only members)
exports.createList = async (req, res) => {
    try {
        const {title, position} = req.body;
        
        // Ensure title does not repeat within the same board
        const possibleUsedTitle = await List.findOne({title, board: req.board._id});
        if (possibleUsedTitle){
            return res.status(400).json({message: 'Title must be unique'});
        }

        if (!title || title.trim() === ""){
            return res.status(400).json({message: 'Title cannot be empty'});
        }

        if (position && (typeof position !== 'number' || position < 0)){
            return res.status(400).json({message: 'Invalid position'});
        }

        const newList = new List({
            title,
            board: req.params.id,
            position,
        });
        await newList.save();

        res.status(201).json({
            message: 'New list created successfully',
            newList,
        });
    } catch (err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Modify list (only members)
exports.modifyList = async (req, res) => {
    try {
        const {title, board, position} = req.body;
        if (board) {
            return res.status(400).json({message: 'Cannot modify board'});
        }
        if (!title || title.trim() === "" || typeof position !== 'number' || position < 0){
            return res.status(400).json({message: 'Invalid information'});
        }

        const possibleTitle = await List.findOne({title, board: board._id});
        if (possibleTitle){
            return res.status(400).json({message: 'Title must be unique'});
        }

        const newList = await List.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true, runValidators: true}
        );

        if (!newList){
            return res.status(404).json({message: 'List not found'});
        }

        res.status(200).json({
            message: 'List successfully modified',
            newList,
        });
    } catch (err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Delete list (only members)
exports.deleteList = async (req, res) => {
    try {
        const deletedList = await List.findByIdAndDelete(req.params.id);

        if (!deletedList){
            return res.status(404).json({message: 'List not found'});
        }

        res.status(200).json({
            message: 'Successfully deleted list',
            deletedList,
        });
    } catch (err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}