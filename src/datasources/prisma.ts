import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { Pool } from 'pg';
import { pagination } from 'prisma-extension-pagination';
import { softDeleteExtension } from 'prisma-soft-delete';
import type { SoftDeleteConfig } from 'prisma-soft-delete';

const softDeleteConfig = {
  models: {
    user: { field: 'deleted', deletedAtField: 'deletedAt' },
    role: { field: 'deleted', deletedAtField: 'deletedAt' },
    permission: { field: 'deleted', deletedAtField: 'deletedAt' },
    company: { field: 'deleted', deletedAtField: 'deletedAt' },
    refreshToken: { field: 'revoked', deletedAtField: 'revokedAt' },
  },
  relationToModel: {
    roles: 'userRole',
    userRoles: 'userRole',
    rolePermissions: 'rolePermission',
    user: 'user',
    role: 'role',
    permission: 'permission',
    refreshTokens: 'refreshToken',
    activities: 'auditLog',
    actor: 'user',
  },
} satisfies SoftDeleteConfig;

const createPrismaClient = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ['info'],
  })
    .$extends(softDeleteExtension(softDeleteConfig))
    .$extends(
      pagination({
        pages: {
          limit: 10,
          includePageCount: true,
        },
      })
    );
};

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

let client: ExtendedPrismaClient | undefined;

export const getPrismaInstance = (): ExtendedPrismaClient => {
  if (!client) {
    client = createPrismaClient();
  }

  return client;
};
