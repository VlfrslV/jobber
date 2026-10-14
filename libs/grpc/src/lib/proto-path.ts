import { existsSync } from 'fs';
import { join } from 'path';

const distProto = join(process.cwd(), 'dist/libs/grpc/proto/auth.proto');
const srcProto = join(process.cwd(), 'libs/grpc/proto/auth.proto');

export const AUTH_PROTO_PATH = existsSync(distProto) ? distProto : srcProto;
