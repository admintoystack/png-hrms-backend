import { rule, shield } from 'graphql-shield';

import { ForbiddenException, UnauthenticatedException } from 'utils/errors';

import { PUBLIC_OPERATIONS } from './schema/auth/constants';

// Authentication rule
const isAuthenticated = rule({ cache: 'contextual' })(async (_root, _args, context, _info) => {
  if (!context.user) {
    return new UnauthenticatedException('Authentication required');
  }
  return true;
});

const hasPermission = (permissionCode: string) =>
  rule({ cache: 'contextual' })(async (_root, _args, context) => {
    if (!context.user) {
      return new UnauthenticatedException('Authentication required');
    }

    const rolePermissions =
      context.user.roles?.flatMap(userRole =>
        userRole.role.rolePermissions?.map(rolePermission => rolePermission.permission.code)
      ) || [];

    if (!rolePermissions.includes(permissionCode)) {
      return new ForbiddenException('Forbidden');
    }
    return true;
  });

const allowByDefault = rule({ cache: 'contextual' })(async (_root, _args, _context, info) => {
  if (PUBLIC_OPERATIONS.has(info.fieldName)) {
    return true;
  }

  return new ForbiddenException('Forbidden');
});

// Service permissions with all rules enabled
export const servicePermissions = shield(
  {
    Query: {
      me: isAuthenticated,
      user: hasPermission('user.read'),
      getUser: hasPermission('user.read'),
      users: hasPermission('user.read'),
      getUsers: hasPermission('user.read'),
      getCompany: hasPermission('company.read'),
      getRole: hasPermission('role.read'),
      getRoles: hasPermission('role.read'),
      getPermissions: hasPermission('permission.read'),
      getAuditLog: hasPermission('audit.read'),
    },
    Mutation: {
      login: allowByDefault,
      refreshToken: allowByDefault,
      logout: isAuthenticated,
      createCompany: hasPermission('company.update'),
      updateCompany: hasPermission('company.update'),
      createUser: hasPermission('user.create'),
      updateUser: hasPermission('user.update'),
      deactivateUser: hasPermission('user.deactivate'),
      reactivateUser: hasPermission('user.activate'),
      assignRoles: hasPermission('role.assign'),
      createRole: hasPermission('role.create'),
      updateRole: hasPermission('role.update'),
      deleteRole: hasPermission('role.delete'),
    },
  },
  {
    allowExternalErrors: true,
  }
);
