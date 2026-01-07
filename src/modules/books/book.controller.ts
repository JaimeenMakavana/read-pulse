import { FastifyReply, FastifyRequest } from "fastify";
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "./book.service";
import { CreateBookInput, UpdateBookInput, GetBooksQuery } from "./book.schema";
import { AppError } from "../../shared/errors";

/**
 * Handles POST /books request to create a new book.
 *
 * @param request - Fastify request with validated CreateBookInput body and JWT user
 * @param reply - Fastify reply object
 * @returns Created book
 */
export const createBookHandler = async (
  request: FastifyRequest<{ Body: CreateBookInput }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: "Authentication required" });
    }
    const userId = request.user.id;
    const book = await createBook(request.server, request.body, userId);
    return reply.status(201).send(book);
  } catch (error) {
    request.log.error(error);
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Failed to create book" });
  }
};

/**
 * Handles GET /books request to list user's books.
 *
 * @param request - Fastify request with query parameters and JWT user
 * @param reply - Fastify reply object
 * @returns List of books
 */
export const getBooksHandler = async (
  request: FastifyRequest<{ Querystring: GetBooksQuery }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: "Authentication required" });
    }
    const userId = request.user.id;
    const result = await getBooks(request.server, userId, request.query);
    return reply.status(200).send(result);
  } catch (error) {
    request.log.error(error);
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Failed to fetch books" });
  }
};

/**
 * Handles GET /books/:id request to get a single book.
 *
 * @param request - Fastify request with book ID and JWT user
 * @param reply - Fastify reply object
 * @returns Book details
 */
export const getBookByIdHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: "Authentication required" });
    }
    const userId = request.user.id;
    const book = await getBookById(request.server, request.params.id, userId);
    return reply.status(200).send(book);
  } catch (error) {
    request.log.error(error);
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Failed to fetch book" });
  }
};

/**
 * Handles PATCH /books/:id request to update a book.
 *
 * @param request - Fastify request with book ID, update data, and JWT user
 * @param reply - Fastify reply object
 * @returns Updated book
 */
export const updateBookHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateBookInput }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: "Authentication required" });
    }
    const userId = request.user.id;
    const book = await updateBook(
      request.server,
      request.params.id,
      request.body,
      userId
    );
    return reply.status(200).send(book);
  } catch (error) {
    request.log.error(error);
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Failed to update book" });
  }
};

/**
 * Handles DELETE /books/:id request to delete a book.
 *
 * @param request - Fastify request with book ID and JWT user
 * @param reply - Fastify reply object
 * @returns Success message
 */
export const deleteBookHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: "Authentication required" });
    }
    const userId = request.user.id;
    await deleteBook(request.server, request.params.id, userId);
    return reply.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    request.log.error(error);
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Failed to delete book" });
  }
};
