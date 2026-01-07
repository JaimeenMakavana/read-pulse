import { FastifyInstance } from "fastify";
import {
  createBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
} from "./book.controller";
import {
  createBookSchema,
  updateBookSchema,
  getBooksQuerySchema,
  bookParamsSchema,
} from "./book.schema";

/**
 * Registers book-related routes.
 *
 * @param app - Fastify instance
 */
export async function bookRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    "/books",
    {
      preHandler: [app.authenticate],
      schema: {
        body: createBookSchema,
        tags: ["Books"],
        description: "Create a new book",
        security: [{ bearerAuth: [] }],
      },
    },
    createBookHandler
  );

  app.get(
    "/books",
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: getBooksQuerySchema,
        tags: ["Books"],
        description: "Get all books for the authenticated user",
        security: [{ bearerAuth: [] }],
      },
    },
    getBooksHandler
  );

  app.get(
    "/books/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        params: bookParamsSchema,
        tags: ["Books"],
        description: "Get a single book by ID",
        security: [{ bearerAuth: [] }],
      },
    },
    getBookByIdHandler
  );

  app.patch(
    "/books/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        params: bookParamsSchema,
        body: updateBookSchema,
        tags: ["Books"],
        description: "Update a book",
        security: [{ bearerAuth: [] }],
      },
    },
    updateBookHandler
  );

  app.delete(
    "/books/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        params: bookParamsSchema,
        tags: ["Books"],
        description: "Delete a book",
        security: [{ bearerAuth: [] }],
      },
    },
    deleteBookHandler
  );
}
