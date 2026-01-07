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
      },
    },
    getSummaryHandler
  );
}

