import { GraphQLBoolean, GraphQLID, GraphQLNonNull } from 'graphql';

import { deleteRole } from '../services';

const DeleteRole = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_root, { id }, context) => deleteRole(id, context?.user?.id),
};

export default DeleteRole;
