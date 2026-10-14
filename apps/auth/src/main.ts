require('module-alias/register');
import { config } from 'dotenv';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME, AUTH_PROTO_PATH } from '@jobber/grpc';
import { init } from '@jobber/nestjs';

config({ path: join(process.cwd(), 'apps/auth/.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  await init(app);
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: AUTH_PROTO_PATH,
      url: '0.0.0.0:50051',
    },
  });
  await app.startAllMicroservices();
}

bootstrap();
