import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from 'graphql';

import { logout } from '../services';

const Logout = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    refreshToken: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_root, { refreshToken }) => logout(refreshToken),
};

export default Logout;
