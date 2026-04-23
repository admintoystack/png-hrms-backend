import { GraphQLEnumType } from 'graphql';

const SortTypeEnumType = new GraphQLEnumType({
  name: 'SortTypeEnumType',
  values: {
    ASCENDING: { value: 'ASC' },
    DESCENDING: { value: 'DESC' },
  },
});

export default SortTypeEnumType;
