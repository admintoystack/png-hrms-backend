import { GraphQLID, GraphQLInt, GraphQLNonNull } from 'graphql';

import SortTypeEnumType from 'schema/misc/enums/sort-type';

import { UsersType } from '..';
import { UserFilterInputType } from '../filters';
import { getUsers } from '../services';

const GetUsers = {
  type: new GraphQLNonNull(UsersType),
  args: {
    cursor: { type: GraphQLID },
    limit: { type: GraphQLInt },
    filters: { type: UserFilterInputType },
    sortType: { type: SortTypeEnumType },
  },
  resolve: async (_root, { cursor, limit, filters, sortType }) => {
    return getUsers(cursor, limit, filters, sortType);
  },
};

export default GetUsers;
