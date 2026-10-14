FROM node:22-slim AS builder

WORKDIR /workspace

COPY package.json package-lock.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY eslint.config.mjs ./

COPY apps/auth ./apps/auth
COPY libs/grpc ./libs/grpc
COPY libs/graphql ./libs/graphql
COPY libs/nestjs ./libs/nestjs
COPY libs/webpack-config ./libs/webpack-config

RUN apt-get update \
  && apt-get install -y protobuf-compiler openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN npm install

# prisma.config.ts reads AUTH_DATABASE_URL even for generate
ENV AUTH_DATABASE_URL="postgresql://postgres:example@localhost:5432/postgres"

RUN npx nx build auth

FROM node:22-slim AS runner

WORKDIR /app

ENV PORT=3000
ENV AUTH_DATABASE_URL=postgresql://postgres:example@host.docker.internal:5432/postgres
ENV AUTH_JWT_SECRET=5erh23342ty3534tthweth425
ENV JWT_EXPIRATION_MS=28800000

RUN apt-get update \
  && apt-get install -y openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/package-lock.json ./
COPY --from=builder /workspace/apps/auth/package.json ./apps/auth/package.json
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/package.json
COPY --from=builder /workspace/libs/nestjs/package.json ./libs/nestjs/package.json

RUN npm ci --omit=dev

COPY --from=builder /workspace/dist ./dist
COPY --from=builder /workspace/node_modules/@prisma-clients ./node_modules/@prisma-clients

CMD ["node", "dist/apps/auth/main.js"]
