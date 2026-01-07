import { prisma } from '../lib/prisma';
import { CreateSessionInput } from '../schemas/session.schema';

/**
 * Creates a new reading session with automatic calculation of metrics.
 * 
 * @param data - The session input data containing bookId, pages, and times
 * @returns The created reading session with calculated fields
 * @throws Error if book doesn't exist or endPage exceeds book's totalPages
 */
export const createSession = async (data: CreateSessionInput) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  // Calculate metrics (The "ReadPulse" Logic)
  const durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  const pagesRead = data.endPage - data.startPage;

  // Verify book exists and check page constraints
  const book = await prisma.book.findUnique({
    where: { id: data.bookId },
    select: { totalPages: true },
  });

  if (!book) {
    throw new Error('Book not found');
  }

  if (data.endPage > book.totalPages) {
    throw new Error(`End page (${data.endPage}) cannot exceed book's total pages (${book.totalPages})`);
  }

  // Create session with auto-calculated fields
  const session = await prisma.readingSession.create({
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

