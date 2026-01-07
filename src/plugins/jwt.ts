import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import jwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import { getEnv } from '../config/env';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user?: { id: string; email: string };
  }
}

/**
 * JWT plugin for Fastify.
 * Configures JWT authentication and provides authenticate decorator.
 */
const jwtPlugin: FastifyPluginAsync = async (app) => {
  const env = getEnv();

  await app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Add authenticate method to app instance
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const decoded = await request.jwtVerify();
      request.user = decoded as { id: string; email: string };
    } catch (error) {
      reply.status(401).send({ error: 'Invalid or missing token' });
      return;
    }
  });
};

export default fp(jwtPlugin);

