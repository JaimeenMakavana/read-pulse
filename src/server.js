import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from '@fastify/zod';
import { exampleRoute } from './routes/example.js';

const fastify = Fastify({
  logger: true
});

// Register Zod serializer and validator
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Register routes
fastify.register(exampleRoute, { prefix: '/api' });

// Health check route
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    fastify.log.info(`Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

