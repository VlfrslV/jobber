FROM node:22-slim AS builder

WORKDIR /workspace

COPY package.json package-lock.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY eslint.config.mjs ./

COPY apps/jobs ./apps/jobs
COPY libs/grpc ./libs/grpc
COPY libs/graphql ./libs/graphql
COPY libs/nestjs ./libs/nestjs
COPY libs/pulsar ./libs/pulsar
COPY libs/webpack-config ./libs/webpack-config

RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler && rm -rf /var/lib/apt/lists/*

RUN npx nx build jobs

FROM node:22-slim AS runner

WORKDIR /app

ENV PORT=3001
ENV PULSAR_SERVICE_URL=pulsar://host.docker.internal:6650

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/package-lock.json ./
COPY --from=builder /workspace/apps/jobs/package.json ./apps/jobs/package.json
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/package.json
COPY --from=builder /workspace/libs/nestjs/package.json ./libs/nestjs/package.json
COPY --from=builder /workspace/libs/pulsar/package.json ./libs/pulsar/package.json

RUN npm ci --omit=dev

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/jobs/main.js"]
