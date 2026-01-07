import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  bookId: z.string().uuid().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).default('100'),
});

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;

