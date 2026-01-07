import { FastifyReply, FastifyRequest } from 'fastify';
import { signup, login } from './auth.service';
import { SignupInput, LoginInput } from './auth.schema';
import { AppError } from '../../shared/errors';

/**
 * Handles POST /auth/signup request to create a new user account.
 * 
 * @param request - Fastify request with validated SignupInput body
 * @param reply - Fastify reply object
 * @returns Created user information
 */
export const signupHandler = async (
  request: FastifyRequest<{ Body: SignupInput }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const user = await signup(request.server, request.body);
    return reply.status(201).send({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    request.log.error(error);
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    return reply.status(500).send({ error: 'Failed to create user' });
  }
};

/**
 * Handles POST /auth/login request to authenticate a user.
 * 
 * @param request - Fastify request with validated LoginInput body
 * @param reply - Fastify reply object
 * @returns JWT token and user information
 */
export const loginHandler = async (
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const result = await login(request.server, request.body);
    return reply.status(200).send(result);
  } catch (error) {
    request.log.error(error);
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    return reply.status(500).send({ error: 'Failed to login' });
  }
};

