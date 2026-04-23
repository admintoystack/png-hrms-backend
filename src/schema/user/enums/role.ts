import { GraphQLEnumType } from 'graphql';

const UserRoleEnumType = new GraphQLEnumType({
  name: 'UserRoleEnumType',
  description: 'System roles in HRMS',
  values: {
    HR_ADMIN: {
      value: 'HR_ADMIN',
      description: 'Full access role for system administration',
    },
    PAYROLL_OFFICER: {
      value: 'PAYROLL_OFFICER',
      description: 'Payroll operations role',
    },
    MANAGER: {
      value: 'MANAGER',
      description: 'Manager workflow role',
    },
    EMPLOYEE: {
      value: 'EMPLOYEE',
      description: 'Employee self-service role',
    },
    KIOSK: {
      value: 'KIOSK',
      description: 'Kiosk-only role',
    },
  },
});

export default UserRoleEnumType;
