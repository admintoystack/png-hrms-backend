import AuthMutationFields from './auth/mutations';
import CompanyMutationFields from './company/mutations';
import RoleMutationFields from './role/mutations';
import UserMutationFields from './user/mutations';

const mutationFields = {
  ...AuthMutationFields,
  ...CompanyMutationFields,
  ...RoleMutationFields,
  ...UserMutationFields,
};

export default mutationFields;
