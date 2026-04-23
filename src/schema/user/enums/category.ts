import { GraphQLEnumType } from 'graphql';

const CategoryEnumType = new GraphQLEnumType({
  name: 'Category',
  description: 'User category types for school system',
  values: {
    STUDENT: {
      value: 'STUDENT',
      description: 'Student user category',
    },
    TEACHER: {
      value: 'TEACHER',
      description: 'Teacher user category',
    },
    STAFF: {
      value: 'STAFF',
      description: 'Staff user category',
    },
    ADMINISTRATOR: {
      value: 'ADMINISTRATOR',
      description: 'Administrator user category',
    },
    PARENT: {
      value: 'PARENT',
      description: 'Parent user category',
    },
    GUEST: {
      value: 'GUEST',
      description: 'Guest user category',
    },
  },
});

export default CategoryEnumType;
