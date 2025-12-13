import listService from './listService.js';
import type { Request, Response } from 'express';
import List from './List.js';

class ListController{
    // Get all lists from a board
    async getLists(req: Request, res: Response){
        const lists = await listService.getBoardLists(req.params.boardId);

        res.status(200).json({
            message: 'Lists from board found',
            lists,
        });
    }

    // Create list (only members)
    async createList(req: Request, res: Response){
        const newList = await listService.createList(req.params.boardId, req.body);

        res.status(201).json({
            message: 'New list created successfully',
            newList,
        });
    }

    // Update list (only members)
    async updateList(req: Request, res: Response){
        const updatedList = await listService.updateList(req.params.listId, req.body);

        res.status(200).json({
            message: 'List successfully modified',
            updatedList,
        });
    }

    // Delete list (only members)
    async deleteList(req: Request, res: Response){
        const deletedList = await listService.deleteList(req.params.listId);

        res.status(200).json({
            message: 'Successfully deleted list',
            deletedList,
        });
    }
}

export default new ListController();