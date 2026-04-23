import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const CompanyType = new GraphQLObjectType({
  name: 'CompanyType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: company => company.id,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: company => company.name,
    },
    registrationNumber: {
      type: GraphQLString,
      resolve: company => company.registrationNumber,
    },
    address: {
      type: GraphQLString,
      resolve: company => company.address,
    },
    logoUrl: {
      type: GraphQLString,
      resolve: company => company.logoUrl,
    },
    financialYearStart: {
      type: GraphQLInt,
      resolve: company => company.financialYearStart,
    },
    payFrequency: {
      type: GraphQLString,
      resolve: company => company.payFrequency,
    },
    currency: {
      type: GraphQLString,
      resolve: company => company.currency,
    },
    createdAt: {
      type: GraphQLString,
    },
    updatedAt: {
      type: GraphQLString,
    },
  }),
});
