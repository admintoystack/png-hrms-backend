import { CompanyType } from '..';
import { getCompany } from '../services';

const GetCompany = {
  type: CompanyType,
  resolve: async () => getCompany(),
};

export default GetCompany;
