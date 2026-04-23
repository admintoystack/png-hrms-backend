import { User } from './user';

export interface GraphQLContext {
  sessionToken?: string;
  user: User | null;
  requestId: string;
  userAgent?: string;
  ipAddress?: string;
}
