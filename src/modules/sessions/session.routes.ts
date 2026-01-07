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
      },
    },
    createSessionHandler
  );
}

