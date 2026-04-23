import { GraphQLBoolean, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';

import { UserType } from '..';
import { updateUser } from '../services';

const UpdateUser = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    isKiosk: { type: GraphQLBoolean },
  },
  resolve: async (_root, { id, firstName, lastName, email, isKiosk }, context) =>
    updateUser(id, { firstName, lastName, email, isKiosk }, context?.user?.id),
};

export default UpdateUser;
