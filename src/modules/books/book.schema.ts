import { z } from "zod";

export const bookStatusEnum = z.enum([
  "READING",
  "COMPLETED",
  "PAUSED",
  "DROPPED",
  "WISHLIST",
]);

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(200, "Author must be less than 200 characters"),
  totalPages: z
    .number()
    .int("Total pages must be an integer")
    .min(1, "Total pages must be greater than 0"),
  status: bookStatusEnum.default("READING"),
});

export const updateBookSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    author: z.string().min(1).max(200).optional(),
    totalPages: z.number().int().min(1).optional(),
    status: bookStatusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const getBooksQuerySchema = z.object({
  status: bookStatusEnum.optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(() => 50),
  offset: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(() => 0),
});

export const bookParamsSchema = z.object({
  id: z.string().uuid("Book ID must be a valid UUID"),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type GetBooksQuery = z.infer<typeof getBooksQuerySchema>;
export type BookParams = z.infer<typeof bookParamsSchema>;
