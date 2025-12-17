import listDB from '../list/listRepository.js';
import authDB from '../user/authRepository.js';
import taskDB from './taskRepository.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

// Interfaces
import {
    FullTaskInfo,
    PartialTaskInfo,
    Filters,
    UpdateTask,
    CreateTask,
    UsersAssigned
} from './taskInterface.js';

class TaskService{
    async getTasks(boardId: string, filters: Filters): Promise<PartialTaskInfo[]>{
        const { assignedTo, tags } = filters;
        const filter: Filters = {};

        if (assignedTo) filter.assignedTo = assignedTo;
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            filter.tags = tagArray;
        };

        const tasks = await taskDB.getTasks(boardId, filter);

        return tasks;
    }

    async createTask(listId: string, data: CreateTask): Promise<FullTaskInfo>{
        const {title, description, status, board, tags} = data;

        const possibleTitle = await taskDB.getTaskByTitle(title, listId);
        if (possibleTitle){
            throw new BadRequestError('Lists cannot have 2 tasks named the same');
        }

        const newTask = await taskDB.createTask({
            title,
            description,
            status,
            board,
            list: listId,
            tags,
        });

        return newTask;
    }

    async updateTask(taskId: string, data: UpdateTask): Promise<FullTaskInfo>{
        const {title, description, status, assignedTo, list} = data;

        const task = await taskDB.getTaskById(taskId);

        if (!task){
            throw new NotFoundError('Task not found');
        }

        if (assignedTo) {
            throw new BadRequestError('Cannot assign task to someone here');
        }
        
        if (list){
            throw new BadRequestError('Cannot move task from list here');
        }

        const possibleTitle = await taskDB.getTaskByTitle(task.title, task.list);

        if (possibleTitle){
            throw new BadRequestError('Task title must be unique within the list');
        }

        const updatedTask = await taskDB.updateTask(
            taskId,
            {
                title,
                description,
                status,
            }
        );

        return updatedTask;
    }

    async moveTask(taskId: string, newListId: string): Promise<FullTaskInfo>{
        const task = await taskDB.getTaskById(taskId);
        const list = await listDB.getListById(newListId);

        if (!task){
            throw new NotFoundError('Task not found');
        }

        if (!list){
            throw new NotFoundError('List not found');
        }

        if (list.boardId !== task.board){
            throw new BadRequestError('Cannot move task to another board');
        }

        if (task.list === list.id){
            throw new BadRequestError('Task is already in that list');
        }

        const movedTask = await taskDB.moveTask(taskId, newListId);

        if (!movedTask){
            throw new NotFoundError('Task not found');
        }

        return movedTask;
    }

    async assignUser(taskId: string, userId: string): Promise<UsersAssigned>{
      const user = await authDB.findUserById(userId);

        if (!user){
            throw new NotFoundError('User not found');
        }
        const task = await taskDB.getTaskById(taskId);

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        const isAssigned = task.assignedTo.includes(userId);
        if (isAssigned){
            throw new BadRequestError('User is already assigned');
        }

        const updatedTask = await taskDB.assignUser(taskId, userId);

        return updatedTask;
    }

    async deleteTask(taskId: string){
        const taskDeleted = await taskDB.deleteTask(taskId);
        
        if (!taskDeleted){
            throw new NotFoundError('Task not found');
        }
    }
}

export default new TaskService();