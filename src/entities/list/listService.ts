import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import taskDB from '../task/taskRepository.js';
import listDB from './listRepository.js';

interface CreateList{
    title: string,
}

interface UpdateList{
    title?: string,
    board?: string,
}

interface FullListInfo{
    id: string,
    title: string,
    boardId: string,
}

interface PartialCourseInfo{
    id: string,
    title: string,
}

class ListService{
    async getBoardLists(boardId: string): Promise<PartialCourseInfo[]>{
        const lists = await listDB.getLists(boardId);

        return lists;
    }

    async createList(boardId: string, data: CreateList): Promise<FullListInfo>{
        const { title } = data;

        const newList = await listDB.createList(
            boardId,
            { title },
        );

        return newList;
    }

    async updateList(listId: string, data: UpdateList): Promise<FullListInfo>{
        const { board } = data;
        if (board) {
            throw new BadRequestError('Board cannot be modified');
        }

        const updatedList = await listDB.updateList(listId, data);

        if (!updatedList){
            throw new NotFoundError('List not found');
        }
        return updatedList;
    }

    async deleteList(listId: string){
        const deletedList = await listDB.deleteList(listId);

        if (!deletedList){
            throw new NotFoundError('List not found');
        }

        await taskDB.deleteTasksFromList(listId);
    }
}

export default new ListService();