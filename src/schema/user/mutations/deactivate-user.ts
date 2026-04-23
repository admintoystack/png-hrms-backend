import { GraphQLID, GraphQLNonNull } from 'graphql';

import { UserType } from '..';
import { deactivateUser } from '../services';

const DeactivateUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_root, { id }, context) => deactivateUser(id, context?.user?.id),
};

export default DeactivateUser;
