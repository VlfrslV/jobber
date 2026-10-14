require('module-alias/register');
import { config } from 'dotenv';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { init } from '@jobber/nestjs';

config({ path: join(process.cwd(), 'apps/executor/.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await init(app);
}

bootstrap();
