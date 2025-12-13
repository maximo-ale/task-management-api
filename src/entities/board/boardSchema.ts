import { z } from 'zod';

export const createBoardSchema = z.object({
    title: z.string('Title must be a string'),
    description: z.string('Description must be a string').optional(),
});

export const inviteSchema = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const updateBoardSchema = z.object({
    title: z.string('Title must be a string').optional(),
    description: z.string('Description must be a string').optional(),
});