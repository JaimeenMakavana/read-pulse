import { FastifyReply, FastifyRequest } from 'fastify';
import {
  getReadingSpeedByTimeOfDay,
  getReadingVelocity,
  getReadingSummary,
} from './analytics.service';
import { AnalyticsQuery } from './analytics.schema';
import { AppError } from '../../shared/errors';

/**
 * Handles GET /analytics/speed request to get reading speed by time of day.
 * 
 * @param request - Fastify request with query parameters and JWT user
 * @param reply - Fastify reply object
 * @returns Reading speed statistics by hour
 */
export const getSpeedHandler = async (
  request: FastifyRequest<{ Querystring: AnalyticsQuery }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Authentication required' });
    }
    const userId = request.user.id;
    const result = await getReadingSpeedByTimeOfDay(request.server, userId, request.query);
    return reply.status(200).send(result);
  } catch (error) {
    request.log.error(error);
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    return reply.status(500).send({ error: 'Failed to fetch reading speed analytics' });
  }
};

/**
 * Handles GET /analytics/velocity request to get reading velocity predictions.
 * 
 * @param request - Fastify request with query parameters and JWT user
 * @param reply - Fastify reply object
 * @returns Velocity trends and predictions
 */
export const getVelocityHandler = async (
  request: FastifyRequest<{ Querystring: AnalyticsQuery }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Authentication required' });
    }
    const userId = request.user.id;
    const result = await getReadingVelocity(request.server, userId, request.query);
    return reply.status(200).send(result);
  } catch (error) {
    request.log.error(error);
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    return reply.status(500).send({ error: 'Failed to fetch velocity analytics' });
  }
};

/**
 * Handles GET /analytics/summary request to get overall reading statistics.
 * 
 * @param request - Fastify request with query parameters and JWT user
 * @param reply - Fastify reply object
 * @returns Summary statistics
 */
export const getSummaryHandler = async (
  request: FastifyRequest<{ Querystring: AnalyticsQuery }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Authentication required' });
    }
    const userId = request.user.id;
    const result = await getReadingSummary(request.server, userId, request.query);
    return reply.status(200).send(result);
  } catch (error) {
    request.log.error(error);
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    return reply.status(500).send({ error: 'Failed to fetch summary analytics' });
  }
};

