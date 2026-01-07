import { FastifyInstance } from 'fastify';
import { CreateSessionInput } from './session.schema';
import { NotFoundError, ValidationError } from '../../shared/errors';

/**
 * Creates a new reading session with automatic calculation of metrics.
 * 
 * @param app - Fastify instance with prisma decorator
 * @param data - The session input data containing bookId, pages, and times
 * @param userId - The ID of the user creating the session
 * @returns The created reading session with calculated fields
 * @throws NotFoundError if book doesn't exist
 * @throws ValidationError if endPage exceeds book's totalPages or user doesn't own the book
 */
export const createSession = async (
  app: FastifyInstance,
  data: CreateSessionInput,
  userId: string
) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  // Calculate metrics (The "ReadPulse" Logic)
  const durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  const pagesRead = data.endPage - data.startPage;

  // Verify book exists and user owns it
  const book = await app.prisma.book.findUnique({
    where: { id: data.bookId },
    select: { totalPages: true, userId: true },
  });

  if (!book) {
    throw new NotFoundError('Book');
  }

  if (book.userId !== userId) {
    throw new ValidationError('You do not have access to this book');
  }

  if (data.endPage > book.totalPages) {
    throw new ValidationError(`End page (${data.endPage}) cannot exceed book's total pages (${book.totalPages})`);
  }

  // Create session with auto-calculated fields
  const session = await app.prisma.readingSession.create({
    data: {
      bookId: data.bookId,
      startTime: start,
      endTime: end,
      startPage: data.startPage,
      endPage: data.endPage,
      durationSeconds,
      pagesRead,
    },
  });

  return session;
};

