import './utils/module-alias';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { json } from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import depthLimit from 'graphql-depth-limit';
import { applyMiddleware } from 'graphql-middleware';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { createServer, Server } from 'node:http';
import { servicePermissions } from 'permissions';
import schema from 'schema';

import { GraphQLContext } from 'interfaces/graphql-context';

import { authenticateUser } from 'schema/auth/services';

import { cirkleLogger, logger } from 'utils/logger';
import { generateReferenceId } from 'utils/misc';


dotenv.config();
const { PORT, NODE_ENV, API_BASE_URL } = process.env;

const app = express();

app.use(cors());
app.use(
  express.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true,
  })
);
app.use(
  express.json({
    limit: '50mb',
  })
);

// Add this before your Apollo middleware
app.get('/health', (_, res) => res.sendStatus(200));

const startServer = async () => {
  const server = new ApolloServer({
    schema: applyMiddleware(schema, servicePermissions),
    introspection: NODE_ENV !== 'PROD',
    plugins: [cirkleLogger],
    validationRules: [depthLimit(6)],
    formatError: (formattedError, error: any) => {
      return {
        message: formattedError.message,
        path: formattedError.path,
        locations: formattedError.locations,
        extensions: error.extensions,
      };
    },
  });

  await server.start();

  app.use(graphqlUploadExpress());
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const sessionToken = req.headers.authorization || undefined;
        const user = await authenticateUser(req);
        return {
          sessionToken,
          user,
          requestId: generateReferenceId(4),
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
        };
      },
    })
  );
};

const start = async (): Promise<void> => {
  // 1. Start Apollo Server
  await startServer();

  const port = Number(PORT || 8081);
  const host = API_BASE_URL || 'http://localhost:8081';

  // 2. Start HTTP server
  const server: Server = createServer(app);

  server.listen(port, () => {
    logger.info(`Server running in ${NODE_ENV} mode on ${host}/graphql`);
  });

  // ─── Graceful Shutdown ─────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received — shutting down gracefully`);

    server.close(async () => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force exit if shutdown takes too long
    setTimeout(() => {
      logger.error('Forced shutdown — timed out after 10 s');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection', { reason });
});

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception', { error: err });
  process.exit(1);
});

start().catch((err: Error) => {
  logger.error('Failed to start server', { error: err });
  process.exit(1);
});
