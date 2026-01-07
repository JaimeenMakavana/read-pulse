import { FastifyInstance } from 'fastify';
import { createSessionHandler } from './session.controller';
import { createSessionSchema } from './session.schema';

/**
 * Registers session-related routes.
 * 
 * @param app - Fastify instance
 */
export async function sessionRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    '/sessions',
    {
      preHandler: [app.authenticate],
      schema: {
        body: createSessionSchema,
        tags: ['Sessions'],
        description: 'Create a new reading session with automatic metric calculation',
        security: [{ bearerAuth: [] }],
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              pagesRead: { type: 'number' },
              durationSeconds: { type: 'number' },
              speed: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          404: {
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
    createSessionHandler
  );
}

