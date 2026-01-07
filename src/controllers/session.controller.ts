import { FastifyReply, FastifyRequest } from 'fastify';
import { createSession } from '../services/session.service';
import { CreateSessionInput } from '../schemas/session.schema';

/**
 * Handles POST /sessions request to create a new reading session.
 * 
 * @param request - Fastify request with validated CreateSessionInput body
 * @param reply - Fastify reply object
 * @returns Created session with calculated metrics
 */
export const createSessionHandler = async (
  request: FastifyRequest<{ Body: CreateSessionInput }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const session = await createSession(request.body);
    return reply.status(201).send({
      id: session.id,
      pagesRead: session.pagesRead,
      durationSeconds: session.durationSeconds,
      speed: `${Math.round((session.pagesRead / session.durationSeconds) * 3600)} pages/hour`,
    });
  } catch (error) {
    request.log.error(error);
    if (error instanceof Error) {
      if (error.message === 'Book not found') {
        return reply.status(404).send({ error: error.message });
      }
      if (error.message.includes('cannot exceed')) {
        return reply.status(400).send({ error: error.message });
      }
    }
    return reply.status(500).send({ error: 'Failed to create session' });
  }
};

