import { FastifyReply, FastifyRequest } from 'fastify';
import { createSession } from './session.service';
import { CreateSessionInput } from './session.schema';
import { formatReadingSpeed } from '../../shared/utils';
import { AppError } from '../../shared/errors';

/**
 * Handles POST /sessions request to create a new reading session.
 * 
 * @param request - Fastify request with validated CreateSessionInput body and JWT user
 * @param reply - Fastify reply object
 * @returns Created session with calculated metrics
 */
export const createSessionHandler = async (
  request: FastifyRequest<{ Body: CreateSessionInput }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const userId = (request.user as { id: string }).id;
    const session = await createSession(request.server, request.body, userId);
    return reply.status(201).send({
      id: session.id,
      pagesRead: session.pagesRead,
      durationSeconds: session.durationSeconds,
      speed: formatReadingSpeed(session.pagesRead, session.durationSeconds),
    });
  } catch (error) {
    request.log.error(error);
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    return reply.status(500).send({ error: 'Failed to create session' });
  }
};

