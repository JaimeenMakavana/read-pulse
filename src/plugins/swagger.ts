import { FastifyPluginAsync } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";
import { getEnv } from "../config/env";

/**
 * Swagger/OpenAPI documentation plugin for Fastify.
 * Configures API documentation with Swagger UI.
 */
const swaggerPlugin: FastifyPluginAsync = async (app) => {
  const env = getEnv();
  await app.register(swagger, {
    openapi: {
      info: {
        title: "ReadPulse API",
        description: "Bio-Rhythm Reading Tracker Backend",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });
};

export default fp(swaggerPlugin);
