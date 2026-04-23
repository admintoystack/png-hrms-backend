import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { User } from 'interfaces/user';

const APP_SECRET = process.env.APP_SECRET || '12345';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const APP_PRIVATE_KEY = process.env.APP_PRIVATE_KEY?.replace(/\\n/g, '\n');
const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY?.replace(/\\n/g, '\n');
const useAsymmetricKeys = Boolean(APP_PRIVATE_KEY && APP_PUBLIC_KEY);

export const generateAccessToken = (user: User, roleCodes: string[], sessionId: string): string => {
  const payload = { userId: user.id, email: user.email, roleCodes, sessionId };
  if (useAsymmetricKeys) {
    return sign(
      payload,
      APP_PRIVATE_KEY as string,
      {
        algorithm: 'RS256',
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      } as any
    );
  }

  return sign(payload, APP_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  } as any);
};

export const generateRefreshToken = (user: User, sessionId: string): string => {
  const payload = { userId: user.id, email: user.email, sessionId, type: 'refresh' };
  if (useAsymmetricKeys) {
    return sign(
      payload,
      APP_PRIVATE_KEY as string,
      {
        algorithm: 'RS256',
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      } as any
    );
  }

  return sign(payload, APP_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  } as any);
};

export const generateUserInviteToken = (user: User): string => {
  return sign(user, APP_SECRET, {
    expiresIn: '15d',
  });
};

export const verifyToken = (token: string): JwtPayload & { [key: string]: any } => {
  if (useAsymmetricKeys) {
    return verify(token, APP_PUBLIC_KEY as string, {
      algorithms: ['RS256'],
    }) as JwtPayload & { [key: string]: any };
  }

  return verify(token, APP_SECRET) as JwtPayload & { [key: string]: any };
};
