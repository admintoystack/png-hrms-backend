FROM node:22.12.0-slim AS base
WORKDIR /opt/server/png-hrms-backend

FROM base AS deps
COPY package.json yarn.lock ./
COPY prisma ./prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN yarn install --frozen-lockfile

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN yarn build

# Production node_modules only (do not use npm prune on yarn layouts — it can drop deps listed in both dev + prod, e.g. argon2).
FROM base AS prod-deps
COPY package.json yarn.lock ./
COPY prisma ./prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN yarn install --frozen-lockfile --production

FROM node:22.12.0-slim AS runner
WORKDIR /opt/server/png-hrms-backend

ENV NODE_ENV=production

COPY package.json ./
COPY --from=prod-deps /opt/server/png-hrms-backend/node_modules ./node_modules

COPY --from=build /opt/server/png-hrms-backend/build ./build
COPY prisma ./prisma

RUN chown -R node:node /opt/server/png-hrms-backend

EXPOSE 8081

CMD ["node", "build/src/server.js"]