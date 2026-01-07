import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { getEnv } from "./config/env";
import prismaPlugin from "./plugins/prisma";
import jwtPlugin from "./plugins/jwt";
import swaggerPlugin from "./plugins/swagger";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookRoutes } from "./modules/books/book.routes";
import { sessionRoutes } from "./modules/sessions/session.routes";
import { analyticsRoutes } from "./modules/analytics/analytics.routes";

/**
 * Creates and configures a Fastify application instance.
 *
 * @returns Configured Fastify instance
 */
export const createApp = async (): Promise<FastifyInstance> => {
  const env = getEnv();
  const app = Fastify({
    logger: env.NODE_ENV === "development",
  });

  // Register CORS
  await app.register(cors, {
    origin: env.NODE_ENV === "development" ? "*" : false,
  });

  // Setup Zod Validation for Fastify v5
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Register plugins
  await app.register(prismaPlugin);
  await app.register(jwtPlugin);
  await app.register(swaggerPlugin);

  // Health check route
  app.get("/health", async () => {
    return { status: "OK", timestamp: new Date() };
  });

  // Register routes
  await app.register(authRoutes, { prefix: "/api/v1" });
  await app.register(bookRoutes, { prefix: "/api/v1" });
  await app.register(sessionRoutes, { prefix: "/api/v1" });
  await app.register(analyticsRoutes, { prefix: "/api/v1" });

  return app;
};
