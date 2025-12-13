import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string('Name must be an string'),
    email: z.email('Invalid email'),
    password: z.string('Password must be a string').min(5, 'Password must be at least 5 characters long'),
});

export const loginSchema = z.object({
    name: z.string('Name must be an string').optional(),
    email: z.email('Invalid email').optional(),
    password: z.string('Password must be a string'),
}).superRefine((data, ctx) => {
    if (!data.name && !data.email){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'At least name or email must be provided',
            path: ['name', 'email'],
        });
    }
});