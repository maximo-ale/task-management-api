const express = require('express');
const mongoose = require('mongoose');
const Board = require('../models/Board');
const User = require('../models/User');
const List = require('../models/List');

// Create new board
exports.create = async(req, res) => {
    try {
        const {title, description} = req.body;

        // Look for invalid info
        if (!title || title.trim() === "" || !description || description.trim() === ""){
            return res.status(400).json({message: 'Invalid information'});
        }

        // Create and board
        const board = new Board({
            title,
            description,
            owner: req.userId,
        });
        await board.save();

        res.status(201).json({
            message: 'Created board successfully',
            board,
        });
    } catch (err) {
        if (err.code === 11000){
            return res.status(400).json({message: 'Title must be unique'});
        }
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Add member
exports.invite = async (req, res) => {
    try {
        const { email } = req.body.email?.trim().toLowerCase();

        if (!email || email.trim() === ""){
            return res.status(400).json({message: 'Invalid email'});
        }
        const member = await User.findOne({email: req.body.email});
        const board = await Board.findById(req.params.id);

        if (!member) {
            return res.status(404).json({message: 'User not found'});
        }
        if (!board) {
            return res.status(404).json({message: 'Board not found'});
        }

        // Check if user is not already on board
        const isOnBoard = board.owner.equals(member._id) || board.members.some(m => m.equals(member._id));
        if (isOnBoard){
            return res.status(409).json({message: 'User has already been invited'});
        }
        
        board.members.push(member._id);
        await board.save();

        res.status(200).json({
            message: 'User invited successfully',
            userInvited: member,
            board,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}
// Return boards in which the user is either member or owner
exports.member = async (req, res) => {
    try {
        const boards = await Board.find({
            $or: [
                {owner: req.userId},
                {members: req.userId},
            ],
        });

        if (boards.length === 0){
            return res.status(200).json({message: `You haven't joined any board yet`});
        }

        res.status(200).json({
            message: 'Boards found successfully',
            count: boards.length,
            boards,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Find a specific board (only if joined)
exports.findBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);

        res.status(200).json({
            message: 'Board found successfully',
            board,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Modify board (only owner)
exports.modify = async (req, res) => {
    try {
        const {title} = req.body

        // Prevent user from modifying members or teacher
        if (req.body.members || req.body.teacher){
            return res.status(400).json({message: 'Cannot modify members or teacher'});
        }

        if (title?.trim() === "") return res.status(400).json({message: 'Invalid title'});

        // Update board
        const boardToModify = await Board.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true, runValidators: true},

        );

        res.status(200).json({
            message: 'Board updated successfully',
            board: {
                title: boardToModify.title,
                description: boardToModify.description,
            }
        });
    } catch (err) {
        if (err.code === 11000){
            return res.status(400).json({message: 'Title must be unique'});
        }
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

// Delete board (only owner)
exports.deleteBoard = async (req, res) => {
    try {
        const boardToDelete = await Board.findByIdAndDelete(req.params.id);

        // Delete lists and tasks
        const deletedLists = await List.deleteMany({board: boardToDelete._id});
        await Task.deleteMany({list: {$in: {deletedLists}}});

        res.status(200).json({
            message: 'Board deleted successfully',
            deletedBoard: boardToDelete,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}