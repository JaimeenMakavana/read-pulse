import { FastifyInstance } from 'fastify';
import { CreateBookInput, UpdateBookInput, GetBooksQuery } from './book.schema';
import { NotFoundError, ForbiddenError } from '../../shared/errors';

/**
 * Creates a new book for a user.
 * 
 * @param app - Fastify instance with prisma decorator
 * @param data - Book creation data
 * @param userId - ID of the user creating the book
 * @returns Created book
 */
export const createBook = async (
  app: FastifyInstance,
  data: CreateBookInput,
  userId: string
) => {
  const book = await app.prisma.book.create({
    data: {
      ...data,
      userId,
    },
  });

  return book;
};

/**
 * Gets all books for a user with optional filtering.
 * 
 * @param app - Fastify instance with prisma decorator
 * @param userId - ID of the user
 * @param query - Query parameters (status, limit, offset)
 * @returns Array of books and total count
 */
export const getBooks = async (
  app: FastifyInstance,
  userId: string,
  query: GetBooksQuery
) => {
  const where: { userId: string; status?: string } = { userId };
  if (query.status) {
    where.status = query.status;
  }

  const [books, total] = await Promise.all([
    app.prisma.book.findMany({
      where,
      take: query.limit,
      skip: query.offset,
      orderBy: { createdAt: 'desc' },
    }),
    app.prisma.book.count({ where }),
  ]);

  return { books, total };
};

/**
 * Gets a single book by ID.
 * 
 * @param app - Fastify instance with prisma decorator
 * @param bookId - ID of the book
 * @param userId - ID of the user (for ownership validation)
 * @returns Book if found and owned by user
 * @throws NotFoundError if book doesn't exist
 * @throws ForbiddenError if user doesn't own the book
 */
export const getBookById = async (
  app: FastifyInstance,
  bookId: string,
  userId: string
) => {
  const book = await app.prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new NotFoundError('Book');
  }

  if (book.userId !== userId) {
    throw new ForbiddenError('You do not have access to this book');
  }

  return book;
};

/**
 * Updates a book.
 * 
 * @param app - Fastify instance with prisma decorator
 * @param bookId - ID of the book
 * @param data - Update data
 * @param userId - ID of the user (for ownership validation)
 * @returns Updated book
 * @throws NotFoundError if book doesn't exist
 * @throws ForbiddenError if user doesn't own the book
 */
export const updateBook = async (
  app: FastifyInstance,
  bookId: string,
  data: UpdateBookInput,
  userId: string
) => {
  const existingBook = await app.prisma.book.findUnique({
    where: { id: bookId },
    select: { userId: true },
  });

  if (!existingBook) {
    throw new NotFoundError('Book');
  }

  if (existingBook.userId !== userId) {
    throw new ForbiddenError('You do not have access to this book');
  }

  const book = await app.prisma.book.update({
    where: { id: bookId },
    data,
  });

  return book;
};

/**
 * Deletes a book.
 * 
 * @param app - Fastify instance with prisma decorator
 * @param bookId - ID of the book
 * @param userId - ID of the user (for ownership validation)
 * @throws NotFoundError if book doesn't exist
 * @throws ForbiddenError if user doesn't own the book
 */
export const deleteBook = async (
  app: FastifyInstance,
  bookId: string,
  userId: string
) => {
  const book = await app.prisma.book.findUnique({
    where: { id: bookId },
    select: { userId: true },
  });

  if (!book) {
    throw new NotFoundError('Book');
  }

  if (book.userId !== userId) {
    throw new ForbiddenError('You do not have access to this book');
  }

  await app.prisma.book.delete({
    where: { id: bookId },
  });
};

