import { z } from 'zod';

export const createSessionSchema = z.object({
  bookId: z.string().uuid('Book ID must be a valid UUID'),
  startPage: z.number().int('Start page must be an integer').min(0, 'Start page must be non-negative'),
  endPage: z.number().int('End page must be an integer').min(1, 'End page must be at least 1'),
  startTime: z.string().datetime('Start time must be a valid ISO 8601 datetime'),
  endTime: z.string().datetime('End time must be a valid ISO 8601 datetime'),
}).refine((data) => data.endPage > data.startPage, {
  message: 'End page must be greater than start page',
  path: ['endPage'],
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

