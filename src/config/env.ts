import { z } from 'zod';

const baseSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
});

export type Env = {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL: string;
  JWT_SECRET: string;
};

let cachedEnv: Env | undefined;

/**
 * Validates and returns environment variables.
 * In development, falls back to sensible defaults if missing.
 */
export const getEnv = (): Env => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = baseSchema.parse(process.env);

  const isDev = parsed.NODE_ENV === 'development' || parsed.NODE_ENV === 'test';

  const databaseUrl =
    parsed.DATABASE_URL ||
    (isDev
      ? 'postgresql://user:password@localhost:5432/readpulse?schema=public'
      : '');

  const jwtSecret =
    parsed.JWT_SECRET ||
    (isDev
      ? 'dev-secret-please-change-me-dev-secret-please-change'
      : '');

  if (!databaseUrl || !jwtSecret) {
    throw new Error('Missing required environment variables: DATABASE_URL and/or JWT_SECRET');
  }

  cachedEnv = {
    PORT: parsed.PORT,
    NODE_ENV: parsed.NODE_ENV,
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
  };

  return cachedEnv;
};

