import { BadRequestError, ConflictError, NotFoundError } from '../../utils/errors.js';
import listDB from '../list/listRepository.js';
import membershipDB from '../membership/membershipRepository.js';
import taskDB from '../task/taskRepository.js';
import authDB from '../user/authRepository.js';
import boardDB from './boardRepository.js';

// Interfaces
import {
    FullBoardInfo,
    CreateBoardService,
    UpdateBoard,
    ProtectedUserInfo,
    PartialBoardInfo
} from './boardInterface.js';

class BoardService{
    async createBoard(userId: string, data: CreateBoardService): Promise<FullBoardInfo>{
        const {title, description} = data;

        // Create and board
        const board = await boardDB.creteBoard({
            title,
            description: description || '',
            owner: userId,
        });

        await membershipDB.addMembership(userId, board.id);
        
        return board;
    }

    async invite(userId: string, boardId: string): Promise<ProtectedUserInfo>{
        const member = await authDB.findUserById(userId);
        const board = await boardDB.findBoardById(boardId);
        const boardMembers = await membershipDB.getBoardMembers(boardId);

        if (!member) {
            throw new NotFoundError('User not found');
        }

        if (!board) {
            throw new NotFoundError('Board not found');
        }

        // Check if user is not already on board
        const isOnBoard = board.owner === userId || boardMembers.some(m => m.id === userId);
        if (isOnBoard){
            throw new ConflictError('User has already been invited');
        }
        
        await membershipDB.addMembership(userId, boardId);

        return {
            id: member.id,
            name: member.name,
        }
    }

    async member(userId: string): Promise<PartialBoardInfo[]>{
        const userBoards = await membershipDB.getUserBoards(userId);

        return userBoards;
    }

    async findBoard(boardId: string): Promise<FullBoardInfo>{
        const board = await boardDB.findBoardById(boardId);

        if (!board){
            throw new NotFoundError('Board not found');
        }

        return {
            id: board.id.toString(),
            title: board.title,
            description: board.description,
            owner: board.owner.toString(),
        }
    }

    async update(boardId: string, data: UpdateBoard): Promise<FullBoardInfo>{
        const { title, description, owner } = data
        const boardToUpdate = await boardDB.findBoardById(boardId);

        if (!boardToUpdate){
            throw new NotFoundError('Board not found');
        }

        // Prevent user from modifying members or owner
        if (owner){
            throw new BadRequestError('Cannot modify board owner');
        }

        const updatedBoard = await boardDB.updateBoard(boardId, {title, description});

        return updatedBoard;
    }

    async delete(boardId: string): Promise<FullBoardInfo>{
        const deletedBoard = await boardDB.deleteBoard(boardId);

        if (!deletedBoard){
            throw new NotFoundError('Board not found');
        }
        
        // Delete lists and tasks
        await listDB.deleteListsFromBoard(boardId);
        await taskDB.deleteTasksFromBoard(boardId);

        return deletedBoard;
    }
}

export default new BoardService();