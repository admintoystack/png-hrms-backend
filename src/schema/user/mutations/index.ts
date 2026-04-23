import AssignRoles from './assign-roles';
import CreateUser from './create-user';
import DeactivateUser from './deactivate-user';
import ReactivateUser from './reactivate-user';
import UpdateUser from './update-user';

const UserMutationFields = {
  createUser: CreateUser,
  updateUser: UpdateUser,
  deactivateUser: DeactivateUser,
  reactivateUser: ReactivateUser,
  assignRoles: AssignRoles,
};

export default UserMutationFields;
