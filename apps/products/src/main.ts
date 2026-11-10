require('module-alias/register');
import { config } from 'dotenv';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { Packages, PRODUCTS_PROTO_PATH } from '@jobber/grpc';
import { init } from '@jobber/nestjs';
import { ConfigService } from '@nestjs/config';

config({ path: join(process.cwd(), 'apps/products/.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  await init(app);
  app.connectMicroservice<GrpcOptions>(
    {
      transport: Transport.GRPC,
      options: {
        url: app
          .get(ConfigService)
          .getOrThrow<string>('PRODUCTS_GRPC_SERVICE_URL'),
        package: Packages.PRODUCTS,
        protoPath: PRODUCTS_PROTO_PATH,
      },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
}

bootstrap();
