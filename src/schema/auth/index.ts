import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';

import { UserType } from 'schema/user';

export const AuthenticationResponseType = new GraphQLObjectType({
  name: 'AuthenticationResponseType',
  fields: () => ({
    accessToken: {
      type: GraphQLString,
      resolve: auth => auth.accessToken,
    },
    refreshToken: {
      type: GraphQLString,
      resolve: auth => auth.refreshToken,
    },
    user: {
      type: UserType,
      resolve: auth => auth.user,
    },
  }),
});

export const AuthPayloadType = new GraphQLObjectType({
  name: 'AuthPayloadType',
  fields: () => ({
    accessToken: {
      type: GraphQLString,
      resolve: auth => auth.accessToken,
    },
    refreshToken: {
      type: GraphQLString,
      resolve: auth => auth.refreshToken,
    },
    user: {
      type: UserType,
      resolve: auth => auth.user,
    },
  }),
});

export const ForgotPasswordType = new GraphQLObjectType({
  name: 'ForgotPassword',
  fields: () => ({
    status: {
      type: GraphQLBoolean,
      resolve: auth => auth.status,
    },
    message: {
      type: GraphQLString,
      resolve: auth => auth.message,
    },
  }),
});
