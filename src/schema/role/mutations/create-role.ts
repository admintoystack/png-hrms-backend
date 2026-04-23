import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { RoleType } from '..';
import { createRole } from '../services';

const CreateRole = {
  type: RoleType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    code: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    permissionIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
  },
  resolve: async (_root, { name, code, description, permissionIds }, context) =>
    createRole(name, code, description, permissionIds || [], context?.user?.id),
};

export default CreateRole;
