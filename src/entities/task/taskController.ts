import Task from './Task.js';
import User from '../user/User.js';
import type { Request, Response } from 'express';
import taskService from './taskService.js';
import { RequestHandler } from 'express';
interface Query{
    title?: string,
    status?: 'to-do' | 'in-progress' | 'done',
    tags?: string[],
    assignedTo?: string[],
}

interface BoardId{
    // 'boardId' is actually required and is validated in the middleware,
    // but is marked as optional to avoid errors
    boardId?: string,
}

class TaskController{
    async getTasks(req: Request<BoardId, {}, {}, Query>, res: Response){
        const tasks = await taskService.getTasks(req.params.boardId!, req.query);

        res.status(200).json({
            message: 'Tasks found',
            tasks,
        });
    }

    async createTask(req: Request, res: Response){
        const newTask = await taskService.createTask(req.params.listId, req.body);

        res.status(201).json({
            message: 'Task created successfully',
            task: newTask,
        });
    }

    async updateTask(req: Request, res: Response){
        const updatedTask = await taskService.updateTask(req.params.taskId, req.body);

        res.status(200).json({
            message: 'Successfully updated task',
            updatedTask,
        });
    }

    async moveTask(req: Request, res: Response){
        const task = await taskService.moveTask(req.params.taskId, req.body)

        res.status(200).json({
            message: 'Task moved successfully',
            task,
        });
    }

    async assignTaskToUser(req: Request, res: Response){
        const assignedUsers = taskService.assignUser(req.params.taskId, req.body.userId);

        res.status(200).json({
            message: 'User assigned successfully',
            assignedUsers,
        });
    }

    async deleteTask(req: Request, res: Response){
        await taskService.deleteTask(req.params.taskId);

        res.status(200).json({message: 'Task deleted successfully'});
    }
}

export default new TaskController();