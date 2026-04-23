import { GraphQLID, GraphQLNonNull } from 'graphql';

import { UserType } from '..';
import { getUser } from '../services';

const GetUser = {
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_root, { id }) => getUser(id),
};

export default GetUser;
