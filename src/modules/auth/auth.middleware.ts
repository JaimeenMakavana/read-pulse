import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../../shared/errors';

/**
 * JWT authentication middleware.
 * Verifies the JWT token and attaches user info to the request.
 */
export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new UnauthorizedError('Invalid or missing token');
  }
};

