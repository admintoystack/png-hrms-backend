import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import PaginationType from 'schema/pagination/pagination';

export const PermissionType = new GraphQLObjectType({
  name: 'PermissionType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: permission => permission.id,
    },
    code: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: permission => permission.code,
    },
    resource: {
      type: GraphQLString,
      resolve: permission => permission.resource,
    },
    action: {
      type: GraphQLString,
      resolve: permission => permission.action,
    },
    description: {
      type: GraphQLString,
      resolve: permission => permission.description,
    },
  }),
});

export const RoleType = new GraphQLObjectType({
  name: 'RoleType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: role => role.id,
    },
    code: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: role => role.code,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: role => role.name,
    },
    description: {
      type: GraphQLString,
      resolve: role => role.description,
    },
    isSystem: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: role => role.isSystem,
    },
    isActive: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: role => role.isActive,
    },
    permissions: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PermissionType))),
      resolve: role => role.rolePermissions?.map(({ permission }) => permission) || [],
    },
    createdAt: {
      type: GraphQLString,
    },
    updatedAt: {
      type: GraphQLString,
    },
  }),
});

export const RolesType = new GraphQLObjectType({
  name: 'RolesType',
  fields: () => ({
    nodes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(RoleType))),
      resolve: obj => obj.roles,
    },
    pageInfo: {
      type: new GraphQLNonNull(PaginationType),
      resolve: obj => obj.pageInfo,
    },
  }),
});

export const PermissionsType = new GraphQLObjectType({
  name: 'PermissionsType',
  fields: () => ({
    nodes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PermissionType))),
      resolve: obj => obj.permissions,
    },
    pageInfo: {
      type: new GraphQLNonNull(PaginationType),
      resolve: obj => obj.pageInfo,
    },
  }),
});
