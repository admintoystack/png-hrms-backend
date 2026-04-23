import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';

import { CompanyType } from '..';
import { updateCompany } from '../services';

const UpdateCompany = {
  type: CompanyType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    registrationNumber: { type: GraphQLString },
    address: { type: GraphQLString },
    logoUrl: { type: GraphQLString },
    financialYearStart: { type: GraphQLInt },
    payFrequency: { type: GraphQLString },
    currency: { type: GraphQLString },
  },
  resolve: async (_root, { id, ...input }, context) => updateCompany(id, input, context?.user?.id),
};

export default UpdateCompany;
