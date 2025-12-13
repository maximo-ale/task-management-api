import mongoose, { Types } from 'mongoose';
import Task from './Task.js';
interface CreateTask{
    title: string,
    description: string,
    status: 'to-do' | 'in-progress' | 'done',
    board: string,
    list: string
    tags: string | string[],
}

interface UpdateTask{
    title?: string,
    description?: string,
    status?: 'to-do' | 'in-progress' | 'done',
    tags?: string | string[],
}

interface FullTaskInfo{
    id: string,
    title: string,
    description: string,
    board: string,
    list: string,
    status: 'to-do' | 'in-progress' | 'done',
    assignedTo: string[],
    tags: string | string[],
}

interface PartialTaskInfo{
    id: string,
    title: string,
}

interface UsersAssigned{
    id: string,
    title: string,
    assignedTo: string[],
}

interface Filters{
    board: string,
    title?: string,
    status?: 'to-do' | 'in-progress' | 'done',
    tags?: string[],
    assignedTo?: string[],
}

class TaskRepository{
    async getTaskById(taskId: string): Promise<FullTaskInfo | null>{
        const task = await Task.findById(taskId);

        if (!task){
            return null;
        }


        const assignedTo = task.assignedTo.map(assignedUser => assignedUser.toString());

        return {
            id: task._id.toString(),
            title: task.title,
            description: task.description || '',
            board: task.board.toString(),
            list: task.list.toString(),
            status: task.status,
            assignedTo,
            tags: task.tags,
        }
    }
    async getTasks(filters: Filters): Promise<PartialTaskInfo[]>{
        const tasks = await Task.find(filters);

        return tasks.map(t => ({
            id: t._id.toString(),
            title: t.title,
        }));
    }

    async createTask(data: CreateTask): Promise<FullTaskInfo>{
        const newTask = new Task(data);
        await newTask.save();

        const assignedTo = newTask.assignedTo.map(assignedUser => assignedUser.toString());
        return {
            id: newTask._id.toString(),
            title: newTask.title,
            description: newTask.description || '',
            board: newTask.board.toString(),
            list: newTask.list.toString(),
            status: newTask.status,
            assignedTo,
            tags: newTask.tags,
        }
    }

    async getTaskByTitle(title: string, listId: string): Promise<PartialTaskInfo | null>{
        const task = await Task.findOne({title, list: listId});

        if (!task){
            return null;
        }

        return {
            id: task._id.toString(),
            title: task.title,
        }
    }

    async updateTask(taskId: string, data: UpdateTask): Promise<FullTaskInfo>{
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {$set: data},
            {new: true, runValidators: true},
        );
        
        // 'updatedTask' will not be 'null' since the task has already been found in the service    
        const updated = updatedTask!;

        const assignedTo = updatedTask!.assignedTo.map(assignedUser => assignedUser.toString());
        return {
            id: updated._id.toString(),
            title: updated.title,
            description: updated.description || '',
            board: updated.board.toString(),
            list: updated.list.toString(),
            status: updated.status,
            assignedTo,
            tags: updatedTask!.tags,
        }
    }

    async moveTask(taskId: string, newListId: string): Promise<FullTaskInfo | null>{
        const movedTask = await Task.findById(taskId);

        if (!movedTask){
            return null;
        }

        movedTask.list = new Types.ObjectId(newListId);
        await movedTask.save();

        const assignedTo = movedTask.assignedTo.map(assignedUser => assignedUser.toString());
        return {
            id: movedTask._id.toString(),
            title: movedTask.title,
            description: movedTask.description || '',
            board: movedTask.board.toString(),
            list: movedTask.list.toString(),
            status: movedTask.status,
            assignedTo,
            tags: movedTask.tags,
        }
    }

    async assignUser(taskId: string, userId: string): Promise<UsersAssigned>{
        const taskToAssignUser = await Task.findById(taskId);

        const t = taskToAssignUser!;

        t.assignedTo.push(new mongoose.Types.ObjectId(userId));
        await t.save();

        const assignedTo = t.assignedTo.map(assignedUser => assignedUser.toString());

        return {
            id: t._id.toString(),
            title: t.title,
            assignedTo, 
        }
    }

    async deleteTask(taskId: string): Promise<PartialTaskInfo | null>{
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask){
            return null;
        }

        return {
            id: deletedTask._id.toString(),
            title: deletedTask.title,
        }
    }

    async deleteTasksFromBoard(boardId: string){
        await Task.deleteMany({ boardId });
    }

    async deleteTasksFromList(listId: string){
        await Task.deleteMany({ list: listId });
    }
    
}

export default new TaskRepository();