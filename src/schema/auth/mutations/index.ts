import Login from './login';
import Logout from './logout';
import RefreshToken from './refresh-token';

const AuthMutationFields = {
  login: Login,
  refreshToken: RefreshToken,
  logout: Logout,
};

export default AuthMutationFields;
