import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const systemRoles = [
  { code: 'HR_ADMIN', name: 'HR Admin', isSystem: true },
  { code: 'PAYROLL_OFFICER', name: 'Payroll Officer', isSystem: true },
  { code: 'MANAGER', name: 'Manager', isSystem: true },
  { code: 'EMPLOYEE', name: 'Employee', isSystem: true },
  { code: 'KIOSK', name: 'Kiosk', isSystem: true },
];

const permissions = [
  { code: 'company.read', resource: 'company', action: 'read' },
  { code: 'company.update', resource: 'company', action: 'update' },
  { code: 'user.read', resource: 'user', action: 'read' },
  { code: 'user.create', resource: 'user', action: 'create' },
  { code: 'user.update', resource: 'user', action: 'update' },
  { code: 'user.activate', resource: 'user', action: 'activate' },
  { code: 'user.deactivate', resource: 'user', action: 'deactivate' },
  { code: 'role.read', resource: 'role', action: 'read' },
  { code: 'role.create', resource: 'role', action: 'create' },
  { code: 'role.update', resource: 'role', action: 'update' },
  { code: 'role.delete', resource: 'role', action: 'delete' },
  { code: 'role.assign', resource: 'role', action: 'assign' },
  { code: 'permission.read', resource: 'permission', action: 'read' },
  { code: 'audit.read', resource: 'audit', action: 'read' },
];

const rolePermissionMap: Record<string, string[]> = {
  HR_ADMIN: permissions.map(permission => permission.code),
  PAYROLL_OFFICER: ['company.read', 'user.read', 'role.read', 'permission.read'],
  MANAGER: ['company.read', 'user.read'],
  EMPLOYEE: ['company.read'],
  KIOSK: [],
};

const run = async () => {
  for (const role of systemRoles) {
    await prisma.role.upsert({
      where: { code: role.code },
      create: {
        code: role.code,
        name: role.name,
        description: `${role.name} system role`,
        isSystem: role.isSystem,
      },
      update: {
        name: role.name,
        isSystem: role.isSystem,
        isActive: true,
      },
    });
  }

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      create: {
        code: permission.code,
        resource: permission.resource,
        action: permission.action,
        description: `${permission.resource} ${permission.action}`,
      },
      update: {
        resource: permission.resource,
        action: permission.action,
      },
    });
  }

  for (const [roleCode, permissionCodes] of Object.entries(rolePermissionMap)) {
    const role = await prisma.role.findUniqueOrThrow({ where: { code: roleCode } });
    for (const permissionCode of permissionCodes) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { code: permissionCode } });
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
        update: {},
      });
    }
  }
};

run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
