import { getPrismaInstance } from 'datasources/prisma';

import { User } from 'interfaces/user';

import { writeAuditLog } from 'schema/audit-log/services';
import { revokeAllUserRefreshTokens } from 'schema/auth/services';

import { ConflictException, InternalServerException, NotFoundException, ValidationException } from 'utils/errors';
import { logger } from 'utils/logger';
import { getPageInfo, hashPassword } from 'utils/misc';

import { SYSTEM_ROLE_CODES, USER_STATUS } from '../constants';

const prisma = getPrismaInstance();

const withRoleIncludes = {
  roles: {
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
} as const;

const createUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  roleCodes: string[],
  isKiosk: boolean = false,
  actorUserId?: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictException('User already exists', 'CONFLICT', {
      field: 'email',
      value: email,
    });
  }

  if (!isKiosk && roleCodes.includes(SYSTEM_ROLE_CODES.KIOSK)) {
    throw new ValidationException('Kiosk role can only be assigned to kiosk accounts', 'BAD_USER_INPUT', {
      field: 'roleCodes',
    });
  }

  const roles = await prisma.role.findMany({
    where: {
      code: {
        in: roleCodes,
      },
    },
    select: { id: true },
  });

  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      passwordHash: hashPassword(password),
      status: USER_STATUS.ACTIVE,
      isKiosk,
      roles: {
        create: roles.map(role => ({
          roleId: role.id,
        })),
      },
    },
    include: withRoleIncludes,
  });

  await writeAuditLog({
    actorUserId,
    action: 'CREATE',
    entityType: 'USER',
    entityId: user.id,
    after: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      isKiosk: user.isKiosk,
      roleCodes,
    },
  });

  return user;
};

const updateUser = async (
  id: string,
  userData: { firstName?: string; lastName?: string; email?: string; isKiosk?: boolean },
  actorUserId?: string
) => {
  const before = await prisma.user.findUnique({
    where: { id },
  });

  if (!before) {
    throw new NotFoundException('User', id);
  }

  const user = await prisma.user.update({
    where: { id },
    data: userData,
    include: withRoleIncludes,
  });

  await writeAuditLog({
    actorUserId,
    action: 'UPDATE',
    entityType: 'USER',
    entityId: user.id,
    before,
    after: user,
  });

  return user;
};

const ensureNotLastActiveHrAdmin = async (targetUserId: string, nextStatus: number) => {
  if (nextStatus === USER_STATUS.ACTIVE) {
    return;
  }

  const targetHasAdminRole = await prisma.userRole.findFirst({
    where: {
      userId: targetUserId,
      role: {
        code: SYSTEM_ROLE_CODES.HR_ADMIN,
      },
    },
  });

  if (!targetHasAdminRole) {
    return;
  }

  const activeHrAdmins = await prisma.user.count({
    where: {
      status: USER_STATUS.ACTIVE,
      roles: {
        some: {
          role: {
            code: SYSTEM_ROLE_CODES.HR_ADMIN,
          },
        },
      },
    },
  });

  if (activeHrAdmins <= 1) {
    throw new ValidationException('Cannot deactivate the last active HR admin', 'BAD_USER_INPUT', {
      field: 'status',
    });
  }
};

const deactivateUser = async (id: string, actorUserId?: string) => {
  await ensureNotLastActiveHrAdmin(id, USER_STATUS.INACTIVE);
  const before = await prisma.user.findUnique({ where: { id } });
  if (!before) {
    throw new NotFoundException('User', id);
  }
  await revokeAllUserRefreshTokens(id);
  const user = await prisma.user.update({
    where: { id },
    data: { status: USER_STATUS.INACTIVE },
    include: withRoleIncludes,
  });
  await writeAuditLog({
    actorUserId,
    action: 'DEACTIVATE',
    entityType: 'USER',
    entityId: user.id,
    before,
    after: user,
  });
  return user;
};

const reactivateUser = async (id: string, actorUserId?: string) => {
  const before = await prisma.user.findUnique({ where: { id } });
  if (!before) {
    throw new NotFoundException('User', id);
  }
  const user = await prisma.user.update({
    where: { id },
    data: { status: USER_STATUS.ACTIVE },
    include: withRoleIncludes,
  });
  await writeAuditLog({
    actorUserId,
    action: 'REACTIVATE',
    entityType: 'USER',
    entityId: user.id,
    before,
    after: user,
  });
  return user;
};

const assignRoles = async (userId: string, roleIds: string[], actorUserId?: string) => {
  const roles = await prisma.role.findMany({
    where: { id: { in: roleIds } },
  });

  if (roles.some(role => role.code === SYSTEM_ROLE_CODES.KIOSK)) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User', userId);
    }
    if (!user.isKiosk) {
      throw new ValidationException('Kiosk role can only be assigned to kiosk accounts', 'BAD_USER_INPUT', {
        field: 'roleIds',
      });
    }
  }

  const before = await prisma.user.findUnique({
    where: { id: userId },
    include: withRoleIncludes,
  });

  await prisma.$transaction([
    prisma.userRole.deleteMany({ where: { userId } }),
    prisma.userRole.createMany({
      data: roles.map(role => ({ userId, roleId: role.id })),
      skipDuplicates: true,
    }),
  ]);

  await revokeAllUserRefreshTokens(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: withRoleIncludes,
  });
  await writeAuditLog({
    actorUserId,
    action: 'ASSIGN_ROLES',
    entityType: 'USER',
    entityId: userId,
    before,
    after: user,
  });
  return user;
};

const getUser = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: withRoleIncludes,
  });

  if (!user) {
    throw new NotFoundException('User', id);
  }

  return user;
};

const getUsers = async (
  cursor?: string,
  limit: number = 20,
  filters?: { text?: string; status?: number; roles?: string[] },
  sortType: string = 'DESC'
) => {
  const { text = '', status, roles } = filters || {};
  const result = await prisma.$transaction([
    prisma.user.count({
      where: {
        OR: [{ email: { contains: text, mode: 'insensitive' } }],
        status,
        roles: roles?.length
          ? {
              some: {
                role: {
                  code: {
                    in: roles,
                  },
                },
              },
            }
          : undefined,
      },
    }),
    prisma.user.findMany({
      skip: cursor ? 1 : 0,
      take: limit ? limit + 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        OR: [
          { email: { contains: text, mode: 'insensitive' } },
          { firstName: { contains: text, mode: 'insensitive' } },
          { lastName: { contains: text, mode: 'insensitive' } },
        ],
        status,
      },
      include: withRoleIncludes,
      orderBy: { createdAt: sortType.toLowerCase() as 'asc' | 'desc' },
    }),
  ]);

  const { resultSet, pageInfo } = getPageInfo(result, limit, cursor);
  return { users: resultSet, pageInfo };
};

const getUserRole = async (userId: string) => {
  try {
    const roles = await prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return roles.map(({ role }) => role.code);
  } catch (error) {
    logger.error('Get user role error:', error);
    throw new InternalServerException('Failed to get user roles');
  }
};

export { assignRoles, createUser, deactivateUser, getUser, getUserRole, getUsers, reactivateUser, updateUser };
