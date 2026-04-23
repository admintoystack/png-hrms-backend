import { GraphQLID, GraphQLNonNull } from 'graphql';

import { RoleType } from '..';
import { getRole } from '../services';

const GetRole = {
  type: new GraphQLNonNull(RoleType),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_root, { id }) => getRole(id),
};

export default GetRole;
