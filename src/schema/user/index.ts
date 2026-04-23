import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import PaginationType from 'schema/pagination/pagination';
import { RoleType } from 'schema/role';

import UserStatusEnumType from './enums/user-status';

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: user => user.id,
    },
    email: {
      type: GraphQLString,
      resolve: user => user.email,
    },
    firstName: {
      type: GraphQLString,
      resolve: user => user.firstName,
    },
    lastName: {
      type: GraphQLString,
      resolve: user => user.lastName,
    },
    status: {
      type: new GraphQLNonNull(UserStatusEnumType),
      resolve: user => user.status,
    },
    roleCodes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      resolve: user => user.userRoles?.map(({ role }) => role.code) || [],
    },
    roles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(RoleType))),
      resolve: user => user.userRoles?.map(({ role }) => role) || [],
    },
    isKiosk: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: user => user.isKiosk,
    },
    createdAt: {
      type: GraphQLString,
    },
    updatedAt: {
      type: GraphQLString,
    },
  }),
});

export const UsersType = new GraphQLObjectType({
  name: 'UsersType',
  fields: () => ({
    nodes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: obj => obj.users,
    },
    pageInfo: {
      type: new GraphQLNonNull(PaginationType),
      resolve: obj => obj.pageInfo,
    },
  }),
});
