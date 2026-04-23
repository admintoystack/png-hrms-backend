import { GraphQLID, GraphQLInt, GraphQLNonNull } from 'graphql';

import SortTypeEnumType from 'schema/misc/enums/sort-type';

import { RolesType } from '..';
import { getRoles } from '../services';

const GetRoles = {
  type: new GraphQLNonNull(RolesType),
  args: {
    cursor: { type: GraphQLID },
    limit: { type: GraphQLInt },
    sortType: { type: SortTypeEnumType },
  },
  resolve: async (_root, { cursor, limit, sortType }) => getRoles(cursor, limit, sortType),
};

export default GetRoles;
