import GetPermissions from './get-permissions';
import GetRole from './get-role';
import GetRoles from './get-roles';

const RoleQueryFields = {
  getRole: GetRole,
  getRoles: GetRoles,
  getPermissions: GetPermissions,
};

export default RoleQueryFields;
