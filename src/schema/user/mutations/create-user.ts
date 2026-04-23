import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { UserType } from '..';
import { createUser } from '../services';

const CreateUser = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    roleCodes: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) },
    isKiosk: { type: GraphQLBoolean },
  },
  resolve: async (_root, { email, password, firstName, lastName, roleCodes, isKiosk }, context) => {
    return createUser(email, password, firstName, lastName, roleCodes, isKiosk, context?.user?.id);
  },
};

export default CreateUser;
