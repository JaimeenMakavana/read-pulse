import { z } from 'zod';

// Define Zod schemas for request validation
const createUserBodySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional()
});

const getUserParamsSchema = z.object({
  id: z.string().uuid()
});

export const exampleRoute = async (fastify) => {
  // POST route with Zod validation
  fastify.post('/users', {
    schema: {
      body: createUserBodySchema
    }
  }, async (request, reply) => {
    const { name, email, age } = request.body;
    
    return {
      success: true,
      message: 'User created successfully',
      data: {
        id: crypto.randomUUID(),
        name,
        email,
        age: age || null,
        createdAt: new Date().toISOString()
      }
    };
  });

  // GET route with Zod validation for params
  fastify.get('/users/:id', {
    schema: {
      params: getUserParamsSchema
    }
  }, async (request, reply) => {
    const { id } = request.params;
    
    return {
      success: true,
      data: {
        id,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date().toISOString()
      }
    };
  });

  // GET all users
  fastify.get('/users', async (request, reply) => {
    return {
      success: true,
      data: []
    };
  });
};

