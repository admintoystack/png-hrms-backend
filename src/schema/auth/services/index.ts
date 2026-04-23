import { createHash, randomUUID } from 'crypto';
import { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken';

import { getPrismaInstance } from 'datasources/prisma';

import { GraphQLContext } from 'interfaces/graphql-context';
import { User } from 'interfaces/user';

import { USER_STATUS } from 'schema/user/constants';

import { NotFoundException, UnauthenticatedException } from 'utils/errors';
import { generateAccessToken, generateRefreshToken, verifyToken } from 'utils/jwt';
import { verifyPassword } from 'utils/misc';

const prisma = getPrismaInstance();
const REFRESH_TOKEN_VALID_DAYS = 7;

const withRoleIncludes = {
  roles: {
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
} as const;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

const getUserByEmail = (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    include: withRoleIncludes,
  });
};

const getUserRoleCodes = (user: any) => user.userRoles?.map(({ role }) => role.code) || [];

const createSessionTokens = async (user: any, userAgent?: string, ipAddress?: string) => {
  const sessionId = randomUUID();
  const roleCodes = getUserRoleCodes(user);
  const accessToken = generateAccessToken(user, roleCodes, sessionId);
  const refreshToken = generateRefreshToken(user, sessionId);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + REFRESH_TOKEN_VALID_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      id: sessionId,
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt,
      userAgent,
      ipAddress,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

const revokeAllUserRefreshTokens = async (userId: string) => {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

const login = async (email: string, password: string, userAgent?: string, ipAddress?: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new NotFoundException('Resource', 'User');
  }

  if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    throw new UnauthenticatedException('Invalid password');
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new UnauthenticatedException('User is not active');
  }

  const tokenPair = await createSessionTokens(user, userAgent, ipAddress);
  return {
    ...tokenPair,
    user,
  };
};

const refreshToken = async (token: string, userAgent?: string, ipAddress?: string) => {
  const tokenPayload = verifyToken(token) as JwtPayload & { userId: string; sessionId: string; type: string };
  if (tokenPayload.type !== 'refresh') {
    throw new UnauthenticatedException('Invalid refresh token type');
  }

  const persistedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: hashToken(token),
    },
  });

  if (!persistedToken || persistedToken.expiresAt < new Date()) {
    throw new UnauthenticatedException('Refresh token invalid or expired');
  }

  const user = await prisma.user.findUnique({
    where: { id: tokenPayload.userId },
    include: withRoleIncludes,
  });

  if (!user) {
    throw new UnauthenticatedException('User not found for refresh token');
  }

  const tokenPair = await createSessionTokens(user, userAgent, ipAddress);
  await prisma.refreshToken.update({
    where: {
      id: persistedToken.id,
    },
    data: {
      revokedAt: new Date(),
      replacedByTokenId: tokenPayload.sessionId,
    },
  });

  return {
    ...tokenPair,
    user,
  };
};

const logout = async (token: string) => {
  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashToken(token),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
  return true;
};

const authenticateUser = async (request): Promise<User | null> => {
  if (request?.headers?.authorization) {
    const [type, token] = request.headers.authorization.split(' ');
    if (type === 'Bearer') {
      try {
        const tokenPayload = verifyToken(token) as JwtPayload & { userId: string };
        const userId = tokenPayload.userId;
        return await prisma.user.findUnique({
          where: { id: userId },
          include: withRoleIncludes,
        });
      } catch (error) {
        if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
          throw new UnauthenticatedException('User is not authenticated. Session token is invalid');
        }
        throw new UnauthenticatedException('User is not authenticated. Session token verification failed');
      }
    }
  }

  return null;
};

const getCurrentUser = async (context: GraphQLContext) => {
  return context.user || null;
};

export { authenticateUser, getCurrentUser, login, logout, refreshToken, revokeAllUserRefreshTokens };
