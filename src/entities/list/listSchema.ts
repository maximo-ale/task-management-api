import { z } from 'zod';

export const createListSchema = z.object({
    title: z.string('Title must be a string'),
});

export const updateListSchema = z.object({
    title: z.string('Title must be a string').optional(),
});