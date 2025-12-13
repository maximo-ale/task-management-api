import { z } from 'zod';

export const userIdSchema = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const boardIdSchema = z.object({
    boardId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const listIdSchema = z.object({
    listId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const taskIdSchema = z.object({
    taskId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});