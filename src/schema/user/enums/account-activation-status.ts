import { GraphQLEnumType } from 'graphql';

const AccountActivationStatusEnumType = new GraphQLEnumType({
  name: 'AccountActivationStatus',
  description: 'Account activation status enumeration',
  values: {
    PENDING: {
      value: 0,
      description: 'Account activation is pending',
    },
    ACTIVATED: {
      value: 1,
      description: 'Account has been activated',
    },
    EXPIRED: {
      value: 2,
      description: 'Account activation has expired',
    },
    SUSPENDED: {
      value: 3,
      description: 'Account activation has been suspended',
    },
  },
});

export default AccountActivationStatusEnumType;
