import { FastifyInstance } from 'fastify';
import { signupHandler, loginHandler } from './auth.controller';
import { signupSchema, loginSchema } from './auth.schema';

/**
 * Registers authentication-related routes.
 * 
 * @param app - Fastify instance
 */
export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    '/auth/signup',
    {
      schema: {
        body: signupSchema,
        tags: ['Authentication'],
        description: 'Create a new user account',
        response: {
          201: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  email: { type: 'string' },
                  timezone: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
    },
    signupHandler
  );

  app.post(
    '/auth/login',
    {
      schema: {
        body: loginSchema,
        tags: ['Authentication'],
        description: 'Authenticate user and receive JWT token',
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  email: { type: 'string' },
                  timezone: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    loginHandler
  );
}

