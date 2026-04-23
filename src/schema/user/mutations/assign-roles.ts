import { GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql';

import { UserType } from '..';
import { assignRoles } from '../services';

const AssignRoles = {
  type: UserType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    roleIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) },
  },
  resolve: async (_root, { userId, roleIds }, context) => assignRoles(userId, roleIds, context?.user?.id),
};

export default AssignRoles;
