import { FastifyInstance } from 'fastify';
import {
  getSpeedHandler,
  getVelocityHandler,
  getSummaryHandler,
} from './analytics.controller';
import { analyticsQuerySchema } from './analytics.schema';

/**
 * Registers analytics-related routes.
 * 
 * @param app - Fastify instance
 */
export async function analyticsRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    '/analytics/speed',
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: analyticsQuerySchema,
        tags: ['Analytics'],
        description: 'Get reading speed statistics grouped by time of day',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              speedByHour: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    hour: { type: 'number' },
                    averageSpeed: { type: 'number' },
                    totalPages: { type: 'number' },
                    totalDuration: { type: 'number' },
                    sessionCount: { type: 'number' },
                  },
                },
              },
              totalSessions: { type: 'number' },
            },
          },
          401: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          500: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    getSpeedHandler
  );

  app.get(
    '/analytics/velocity',
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: analyticsQuerySchema,
        tags: ['Analytics'],
        description: 'Get reading velocity trends and predictions',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              averageSpeed: { type: 'number' },
              recentSpeed: { type: 'number' },
              velocityChange: { type: 'number' },
              trend: { type: 'string', enum: ['increasing', 'decreasing', 'stable'] },
              totalSessions: { type: 'number' },
            },
          },
          401: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          500: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    getVelocityHandler
  );

  app.get(
    '/analytics/summary',
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: analyticsQuerySchema,
        tags: ['Analytics'],
        description: 'Get overall reading statistics summary',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              totalSessions: { type: 'number' },
              totalBooks: { type: 'number' },
              totalPagesRead: { type: 'number' },
              totalReadingTime: { type: 'number' },
              averageSpeed: { type: 'number' },
              averageSessionDuration: { type: 'number' },
            },
          },
          401: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          500: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    getSummaryHandler
  );
}

