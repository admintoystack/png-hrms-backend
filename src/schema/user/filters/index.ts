import { GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import UserRoleEnumType from '../enums/role';
import UserStatusEnumType from '../enums/user-status';

const UserFilterInputType = new GraphQLInputObjectType({
  name: 'UserFilterInputType',
  fields: () => ({
    text: {
      type: GraphQLString,
    },
    status: {
      type: UserStatusEnumType,
    },
    roles: {
      type: new GraphQLList(UserRoleEnumType),
    },
    roleIds: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
    },
  }),
});

export { UserFilterInputType };
