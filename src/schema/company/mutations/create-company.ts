import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';

import { CompanyType } from '..';
import { createCompany } from '../services';

const CreateCompany = {
  type: CompanyType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    registrationNumber: { type: GraphQLString },
    address: { type: GraphQLString },
    logoUrl: { type: GraphQLString },
    financialYearStart: { type: GraphQLInt },
    payFrequency: { type: GraphQLString },
    currency: { type: GraphQLString },
  },
  resolve: async (_root, args, context) => createCompany(args, context?.user?.id),
};

export default CreateCompany;
