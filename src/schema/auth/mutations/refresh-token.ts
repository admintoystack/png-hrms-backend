import { GraphQLNonNull, GraphQLString } from 'graphql';

import { AuthPayloadType } from '..';
import { refreshToken } from '../services';

const RefreshToken = {
  type: AuthPayloadType,
  args: {
    refreshToken: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_root, { refreshToken: rawRefreshToken }, context) => {
    return refreshToken(rawRefreshToken, context?.userAgent, context?.ipAddress);
  },
};

export default RefreshToken;
