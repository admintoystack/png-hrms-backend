import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { RoleType } from '..';
import { updateRole } from '../services';

const UpdateRole = {
  type: RoleType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    isActive: { type: GraphQLBoolean },
    permissionIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
  },
  resolve: async (_root, { id, name, description, isActive, permissionIds }, context) =>
    updateRole(id, { name, description, isActive, permissionIds }, context?.user?.id),
};

export default UpdateRole;
