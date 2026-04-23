import { getPrismaInstance } from 'datasources/prisma';
import { writeAuditLog } from 'schema/audit-log/services';
import { ConflictException, InvalidOperationException, NotFoundException } from 'utils/errors';
import { getPageInfo } from 'utils/misc';

const prisma = getPrismaInstance();

const getRole = async (id: string) => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (!role) {
    throw new NotFoundException('Role', id);
  }

  return role;
};

const getRoles = async (cursor?: string, limit: number = 20, sortType: string = 'DESC') => {
  const result = await prisma.$transaction([
    prisma.role.count(),
    prisma.role.findMany({
      skip: cursor ? 1 : 0,
      take: limit ? limit + 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        createdAt: sortType.toLowerCase() as 'asc' | 'desc',
      },
    }),
  ]);

  const { resultSet, pageInfo } = getPageInfo(result, limit, cursor);
  return { roles: resultSet, pageInfo };
};

const getPermissions = async (cursor?: string, limit: number = 20, sortType: string = 'DESC') => {
  const result = await prisma.$transaction([
    prisma.permission.count(),
    prisma.permission.findMany({
      skip: cursor ? 1 : 0,
      take: limit ? limit + 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: sortType.toLowerCase() as 'asc' | 'desc',
      },
    }),
  ]);

  const { resultSet, pageInfo } = getPageInfo(result, limit, cursor);
  return { permissions: resultSet, pageInfo };
};

const createRole = async (
  name: string,
  code: string,
  description: string | null,
  permissionIds: string[] = [],
  actorUserId?: string
) => {
  const role = await prisma.role.create({
    data: {
      name,
      code,
      description: description || undefined,
      isSystem: false,
      rolePermissions: {
        create: permissionIds.map(permissionId => ({
          permissionId,
        })),
      },
    },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  await writeAuditLog({
    actorUserId,
    action: 'CREATE',
    entityType: 'ROLE',
    entityId: role.id,
    after: role,
  });

  return role;
};

const updateRole = async (
  id: string,
  updates: { name?: string; description?: string; isActive?: boolean; permissionIds?: string[] },
  actorUserId?: string
) => {
  const existingRole = await prisma.role.findUnique({ where: { id } });
  if (!existingRole) {
    throw new NotFoundException('Role', id);
  }

  if (existingRole.isSystem) {
    throw new InvalidOperationException('System roles are immutable');
  }

  await prisma.role.update({
    where: { id },
    data: {
      name: updates.name,
      description: updates.description,
      isActive: updates.isActive,
    },
  });

  if (updates.permissionIds) {
    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId: id } }),
      prisma.rolePermission.createMany({
        data: updates.permissionIds.map(permissionId => ({ roleId: id, permissionId })),
        skipDuplicates: true,
      }),
    ]);
  }

  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });
  await writeAuditLog({
    actorUserId,
    action: 'UPDATE',
    entityType: 'ROLE',
    entityId: id,
    before: existingRole,
    after: role,
  });
  return role;
};

const deleteRole = async (id: string, actorUserId?: string) => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      userRoles: true,
    },
  });

  if (!role) {
    throw new NotFoundException('Role', id);
  }

  if (role.isSystem) {
    throw new InvalidOperationException('System roles cannot be deleted');
  }

  if (role.userRoles.length > 0) {
    throw new ConflictException('Cannot delete role assigned to users');
  }

  await prisma.role.delete({ where: { id } });
  await writeAuditLog({
    actorUserId,
    action: 'DELETE',
    entityType: 'ROLE',
    entityId: id,
    before: role,
  });
  return true;
};

export { createRole, deleteRole, getPermissions, getRole, getRoles, updateRole };
