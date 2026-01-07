import { FastifyInstance } from "fastify";
import { z } from "zod";

// Define Zod schemas for request validation
const createUserBodySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
});

const getUserParamsSchema = z.object({
  id: z.string().uuid(),
});

// Infer types from Zod schemas
type CreateUserBody = z.infer<typeof createUserBodySchema>;
type GetUserParams = z.infer<typeof getUserParamsSchema>;

export const exampleRoute = async (fastify: FastifyInstance) => {
  // POST route with Zod validation
  fastify.post<{
    Body: CreateUserBody;
  }>(
    "/users",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async (request, reply) => {
      const { name, email, age } = request.body;

      return {
        success: true,
        message: "User created successfully",
        data: {
          id: crypto.randomUUID(),
          name,
          email,
          age: age || null,
          createdAt: new Date().toISOString(),
        },
      };
    }
  );

  // GET route with Zod validation for params
  fastify.get<{
    Params: GetUserParams;
  }>(
    "/users/:id",
    {
      schema: {
        params: getUserParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      return {
        success: true,
        data: {
          id,
          name: "John Doe",
          email: "john@example.com",
          createdAt: new Date().toISOString(),
        },
      };
    }
  );

  // GET all users
  fastify.get("/users", async (request, reply) => {
    return {
      success: true,
      data: [],
    };
  });
};
