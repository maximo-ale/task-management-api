import boardService from './boardService.js';

import type { Request, Response } from 'express';

class BoardController{
    // Create new board
    async createBoard(req: Request, res: Response){
        const board = await boardService.createBoard(req.userId!, req.body)

        res.status(201).json({
            message: 'Created board successfully',
            board,
        });
    }

    // Add member
    async invite(req: Request, res: Response){
        const userInvited = await boardService.invite(req.params.userId, req.params.boardId);

        res.status(200).json({
            message: 'User invited successfully',
            userInvited,
        });
    }

    // Return boards in which the user is either member or owner
    async member(req: Request, res: Response){
        const boards = await boardService.member(req.userId!);

        res.status(200).json({
            message: 'Boards found successfully',
            count: boards.length,
            boards,
        });
    }

    // Find a specific board (only of joined)
    async findBoard(req: Request, res: Response){
        const board = await boardService.findBoard(req.params.boardId);
        
        res.status(200).json({
            message: 'Board found successfully',
            board,
        });
    }

    // Update board (only owner)
    async update(req: Request, res: Response){
        const updatedBoard = await boardService.update(req.params.boardId, req.body)

        res.status(200).json({
            message: 'Board updated successfully',
            board: {
                title: updatedBoard.title,
                description: updatedBoard.description,
            }
        });
    }

    // Delete board (only owner)
    async deleteBoard(req: Request, res: Response){
        const deletedBoard = await boardService.delete(req.params.boardId);

        res.status(200).json({
            message: 'Board deleted successfully',
            deletedBoard,
        });
    }
}

export default new BoardController();