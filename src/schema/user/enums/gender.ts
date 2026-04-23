import { GraphQLEnumType } from 'graphql';

const GenderEnumType = new GraphQLEnumType({
  name: 'Gender',
  description: 'Gender enumeration for user profiles',
  values: {
    MALE: {
      value: 'MALE',
      description: 'Male gender',
    },
    FEMALE: {
      value: 'FEMALE',
      description: 'Female gender',
    },
    OTHER: {
      value: 'OTHER',
      description: 'Other gender',
    },
    PREFER_NOT_TO_SAY: {
      value: 'PREFER_NOT_TO_SAY',
      description: 'Prefer not to say',
    },
  },
});

export default GenderEnumType;
