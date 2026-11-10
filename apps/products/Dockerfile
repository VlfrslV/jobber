FROM node:22-slim AS builder

WORKDIR /workspace

RUN apt-get update \
    && apt-get install -y protobuf-compiler openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY eslint.config.mjs ./

COPY apps/products ./apps/products
COPY libs/grpc ./libs/grpc
COPY libs/graphql ./libs/graphql
COPY libs/nestjs ./libs/nestjs
COPY libs/webpack-config ./libs/webpack-config

RUN npm install

# drizzle.config.ts reads PRODUCTS_DATABASE_URL even for generate
ENV PRODUCTS_DATABASE_URL="postgresql://postgres:example@localhost:5432/postgres"

RUN npx nx build products

FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update \
    && apt-get install -y openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/package-lock.json ./
COPY --from=builder /workspace/apps/products/package.json ./apps/products/package.json
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/package.json
COPY --from=builder /workspace/libs/nestjs/package.json ./libs/nestjs/package.json

COPY --from=builder /workspace/apps/products/drizzle ./apps/products/drizzle
COPY --from=builder /workspace/apps/products/drizzle.config.ts ./apps/products/drizzle.config.ts

RUN npm ci --omit=dev

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/products/main.js"]
