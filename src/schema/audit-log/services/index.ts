import { getPrismaInstance } from 'datasources/prisma';

import { getPageInfo } from 'utils/misc';

const prisma = getPrismaInstance();

const SANITIZED_KEYS = new Set(['passwordHash', 'tokenHash']);

const sanitizePayload = (payload?: Record<string, unknown> | null) => {
  if (!payload) return undefined;

  return Object.fromEntries(Object.entries(payload).filter(([key]) => !SANITIZED_KEYS.has(key)));
};

const writeAuditLog = async (input: {
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
}) => {
  return prisma.auditLog.create({
    data: {
      actorUserId: input.actorUserId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      before: sanitizePayload(input.before),
      after: sanitizePayload(input.after),
      metadata: sanitizePayload(input.metadata),
    },
  });
};

const getAuditLogs = async (
  cursor?: string,
  limit: number = 20,
  filters?: { action?: string; entityType?: string; actorUserId?: string }
) => {
  const whereClause = {
    action: filters?.action,
    entityType: filters?.entityType,
    actorUserId: filters?.actorUserId,
  };

  const result = await prisma.$transaction([
    prisma.auditLog.count({ where: whereClause }),
    prisma.auditLog.findMany({
      skip: cursor ? 1 : 0,
      take: limit ? limit + 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  const { resultSet, pageInfo } = getPageInfo(result, limit, cursor);
  return { logs: resultSet, pageInfo };
};

export { getAuditLogs, writeAuditLog };
