import { z } from 'zod';

export const filterTaskSchema = z.object({
    title: z
        .string('Title must be a string')
        .optional(),
    status: z
        .enum(['to-do', 'in-progress', 'done'], `Status must be 'to-do', 'in-progress' or 'done'`)
        .optional(),
    tags: z
        .union([z.string('Tag must be a string'), z.array(z.string())])
        .optional(),
    assignedTo: z
        .union([z.string().regex(/^[0-9a-fA-F]{24}$/), z.array(z.string().regex(/^[0-9a-fA-F]{24}$/))]),
});

export const createTaskSchema = z.object({
    title: z.string('Title must be a string'),
    description: z.string('Description must be a string').optional(),
    status: z.enum(['to-do', 'in-progress', 'done'], `Status must be 'to-do', 'in-progress' or 'done'`),
    tags: z.union([z.string('Tag must be a string'), z.array(z.string())]),
});

export const updateTaskSchema = z.object({
    title: z.string('Title must be a string').optional(),
    description: z.string('Description must be a string').optional(),
    status: z.enum(['to-do', 'in-progress', 'done'], `Status must be 'to-do', 'in-progress' or 'done'`).optional(),
    tags: z.union([z.string('Tag must be a string'), z.array(z.string())]).optional(),
});