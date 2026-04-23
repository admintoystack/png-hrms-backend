import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLObjectType } from 'graphql';

const PaginationType = new GraphQLObjectType({
  name: 'PaginationType',
  fields: () => ({
    cursor: {
      type: GraphQLID,
      resolve: pageInfo => pageInfo.cursor,
    },
    totalCount: {
      type: GraphQLInt,
      resolve: pageInfo => pageInfo.totalCount,
    },
    hasNextPage: {
      type: GraphQLBoolean,
      resolve: pageInfo => pageInfo.hasNextPage,
    },
  }),
});

export default PaginationType;
