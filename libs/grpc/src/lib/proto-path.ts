import { existsSync } from 'fs';
import { join } from 'path';

const distAuthProto = join(process.cwd(), 'dist/libs/grpc/proto/auth.proto');
const srcAuthProto = join(process.cwd(), 'libs/grpc/src/lib/proto/auth.proto');

const distProductsProto = join(
  process.cwd(),
  'dist/libs/grpc/proto/products.proto',
);
const srcProductsProto = join(
  process.cwd(),
  'libs/grpc/src/lib/proto/products.proto',
);

export const AUTH_PROTO_PATH = existsSync(distAuthProto)
  ? distAuthProto
  : srcAuthProto;

export const PRODUCTS_PROTO_PATH = existsSync(distProductsProto)
  ? distProductsProto
  : srcProductsProto;
