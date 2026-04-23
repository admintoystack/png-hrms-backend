import { GraphQLID, GraphQLNonNull } from 'graphql';

import { UserType } from '..';
import { reactivateUser } from '../services';

const ReactivateUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_root, { id }, context) => reactivateUser(id, context?.user?.id),
};

export default ReactivateUser;
