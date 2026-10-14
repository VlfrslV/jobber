import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@jobber/nestjs';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggerModule, JobsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
