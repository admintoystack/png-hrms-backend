import { scryptSync } from 'crypto';
import ShortUniqueId from 'short-unique-id';

export function generateReferenceId(length: number): string {
  const uid = new ShortUniqueId();
  return uid.randomUUID(length);
}

const salt = process.env.AUTHENTICATION_HASH_SALT || '';

export function hashPassword(password: string): string {
  const hash = scryptSync(password, salt, 64);

  const hashedPassword = `${hash.toString('hex')}.${salt}`;
  return hashedPassword;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [storedHash, salt] = hashedPassword.split('.');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return hash === storedHash;
}

export function getPageInfo(result, limit = 20, _cursor) {
  const resultSet = result[1];
  const hasNextPage = resultSet.length > (limit || 0);
  if (hasNextPage) resultSet.pop();

  const resultSetLength = resultSet.length;
  // we are doing a take: limit + 1 to check if there is a next page. If there is, we will remove the last element.
  const cursorNode = resultSetLength > 0 ? resultSet[resultSetLength - 1] : null;

  const pageInfo = {
    totalCount: result[0],
    limit: limit || 0,
    cursor: cursorNode ? cursorNode.id : undefined,
    hasNextPage,
  };

  return { resultSet, pageInfo };
}
