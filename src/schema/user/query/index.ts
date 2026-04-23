import GetUser from './get-user';
import GetUsers from './get-users';
import User from './user';
import Users from './users';

const UserQueryFields = {
  user: User,
  getUser: GetUser,
  users: Users,
  getUsers: GetUsers,
};

export default UserQueryFields;
