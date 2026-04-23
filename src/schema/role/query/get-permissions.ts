import { GraphQLID, GraphQLInt, GraphQLNonNull } from 'graphql';

import SortTypeEnumType from 'schema/misc/enums/sort-type';

import { PermissionsType } from '..';
import { getPermissions } from '../services';

const GetPermissions = {
  type: new GraphQLNonNull(PermissionsType),
  args: {
    cursor: { type: GraphQLID },
    limit: { type: GraphQLInt },
    sortType: { type: SortTypeEnumType },
  },
  resolve: async (_root, { cursor, limit, sortType }) => getPermissions(cursor, limit, sortType),
};

export default GetPermissions;
