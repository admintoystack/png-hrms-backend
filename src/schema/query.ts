import AuthQueryFields from './auth/query';
import AuditLogQueryFields from './audit-log/query';
import CompanyQueryFields from './company/query';
import RoleQueryFields from './role/query';
import UserQueryFields from './user/query';

const queryFields = {
  ...AuthQueryFields,
  ...AuditLogQueryFields,
  ...CompanyQueryFields,
  ...RoleQueryFields,
  ...UserQueryFields,
};

export default queryFields;
