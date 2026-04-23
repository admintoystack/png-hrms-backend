import { GraphQLEnumType } from 'graphql';

const UserStatusEnumType = new GraphQLEnumType({
  name: 'UserStatusEnumType',
  description: 'User status enumeration for HRMS',
  values: {
    ACTIVE: {
      value: 1,
      description: 'Active user',
    },
    INACTIVE: {
      value: 0,
      description: 'Inactive user',
    },
    PENDING: {
      value: 2,
      description: 'Pending verification',
    },
    SUSPENDED: {
      value: 3,
      description: 'Suspended user',
    },
    DELETED: {
      value: 4,
      description: 'Deleted user',
    },
  },
});

export default UserStatusEnumType;
