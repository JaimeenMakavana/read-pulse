import 'dotenv/config';
import { createApp } from './app';
import { getEnv } from './config/env';

/**
 * Starts the Fastify server.
 */
const start = async (): Promise<void> => {
  try {
    const env = getEnv();
    const app = await createApp();

    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`Server running at http://localhost:${env.PORT}`);
    console.log(`Swagger docs at http://localhost:${env.PORT}/docs`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();

