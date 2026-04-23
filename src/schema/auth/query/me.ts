import { UserType } from 'schema/user';

import { getCurrentUser } from '../services';

const Me = {
  type: UserType,
  resolve: async (_root, _args, context) => getCurrentUser(context),
};

export default Me;
