import { FastifyInstance } from 'fastify';
import { AnalyticsQuery } from './analytics.schema';
import { getHourOfDay, groupBy, calculateReadingSpeed } from '../../shared/utils';

/**
 * Gets reading speed grouped by time of day.
 * 
 * @param app - Fastify instance with prisma decorator
 * @param userId - ID of the user
 * @param query - Query parameters (date range, book filter)
 * @returns Reading speed statistics grouped by hour of day
 */
export const getReadingSpeedByTimeOfDay = async (
  app: FastifyInstance,
  userId: string,
  query: AnalyticsQuery
) => {
  const where: {
    book: { userId: string; id?: string };
    startTime?: { gte?: Date; lte?: Date };
  } = {
    book: { userId },
  };

  if (query.bookId) {
    where.book.id = query.bookId;
  }

  if (query.startDate || query.endDate) {
    where.startTime = {};
    if (query.startDate) {
      where.startTime.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      where.startTime.lte = new Date(query.endDate);
    }
  }

  const sessions = await app.prisma.readingSession.findMany({
    where,
    include: {
      book: {
        select: {
          userId: true,
          user: {
            select: {
              timezone: true,
            },
          },
        },
      },
    },
    take: query.limit,
    orderBy: { startTime: 'desc' },
  });

  // Group sessions by hour of day (using user's timezone)
  const hourGroups = new Map<number, { pagesRead: number; durationSeconds: number; count: number }>();

  for (const session of sessions) {
    const timezone = session.book.user.timezone || 'Asia/Kolkata';
    const hour = getHourOfDay(session.startTime, timezone);

    const existing = hourGroups.get(hour) || { pagesRead: 0, durationSeconds: 0, count: 0 };
    existing.pagesRead += session.pagesRead;
    existing.durationSeconds += session.durationSeconds;
    existing.count += 1;
    hourGroups.set(hour, existing);
  }

  // Calculate average speed per hour
  const speedByHour = Array.from(hourGroups.entries())
    .map(([hour, data]) => ({
      hour,
      averageSpeed: calculateReadingSpeed(data.pagesRead, data.durationSeconds),
      totalPages: data.pagesRead,
      totalDuration: data.durationSeconds,
      sessionCount: data.count,
    }))
    .sort((a, b) => a.hour - b.hour);

  return {
    speedByHour,
    totalSessions: sessions.length,
  };
};

/**
 * Gets reading velocity predictions (trend analysis).
 * 
 * @param app - Fastify instance with prisma decorator
 * @param userId - ID of the user
 * @param query - Query parameters (date range, book filter)
 * @returns Velocity trends and predictions
 */
export const getReadingVelocity = async (
  app: FastifyInstance,
  userId: string,
  query: AnalyticsQuery
) => {
  const where: {
    book: { userId: string; id?: string };
    startTime?: { gte?: Date; lte?: Date };
  } = {
    book: { userId },
  };

  if (query.bookId) {
    where.book.id = query.bookId;
  }

  if (query.startDate || query.endDate) {
    where.startTime = {};
    if (query.startDate) {
      where.startTime.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      where.startTime.lte = new Date(query.endDate);
    }
  }

  const sessions = await app.prisma.readingSession.findMany({
    where,
    orderBy: { startTime: 'asc' },
    take: query.limit,
  });

  if (sessions.length === 0) {
    return {
      averageSpeed: 0,
      trend: 'stable',
      recentSpeed: 0,
      velocityChange: 0,
    };
  }

  // Calculate average speed across all sessions
  const totalPages = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
  const totalDuration = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const averageSpeed = calculateReadingSpeed(totalPages, totalDuration);

  // Calculate recent speed (last 30% of sessions)
  const recentCount = Math.max(1, Math.floor(sessions.length * 0.3));
  const recentSessions = sessions.slice(-recentCount);
  const recentPages = recentSessions.reduce((sum, s) => sum + s.pagesRead, 0);
  const recentDuration = recentSessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const recentSpeed = calculateReadingSpeed(recentPages, recentDuration);

  // Determine trend
  const velocityChange = recentSpeed - averageSpeed;
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (velocityChange > 5) {
    trend = 'increasing';
  } else if (velocityChange < -5) {
    trend = 'decreasing';
  }

  return {
    averageSpeed,
    recentSpeed,
    velocityChange,
    trend,
    totalSessions: sessions.length,
  };
};

/**
 * Gets overall reading statistics summary.
 * 
 * @param app - Fastify instance with prisma decorator
 * @param userId - ID of the user
 * @param query - Query parameters (date range, book filter)
 * @returns Summary statistics
 */
export const getReadingSummary = async (
  app: FastifyInstance,
  userId: string,
  query: AnalyticsQuery
) => {
  const where: {
    book: { userId: string; id?: string };
    startTime?: { gte?: Date; lte?: Date };
  } = {
    book: { userId },
  };

  if (query.bookId) {
    where.book.id = query.bookId;
  }

  if (query.startDate || query.endDate) {
    where.startTime = {};
    if (query.startDate) {
      where.startTime.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      where.startTime.lte = new Date(query.endDate);
    }
  }

  const [sessions, books] = await Promise.all([
    app.prisma.readingSession.findMany({
      where,
      select: {
        pagesRead: true,
        durationSeconds: true,
        startTime: true,
      },
    }),
    app.prisma.book.count({
      where: {
        userId,
        ...(query.bookId ? { id: query.bookId } : {}),
      },
    }),
  ]);

  const totalPages = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
  const totalDuration = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const averageSpeed = calculateReadingSpeed(totalPages, totalDuration);

  return {
    totalSessions: sessions.length,
    totalBooks: books,
    totalPagesRead: totalPages,
    totalReadingTime: totalDuration,
    averageSpeed,
    averageSessionDuration: sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0,
  };
};

