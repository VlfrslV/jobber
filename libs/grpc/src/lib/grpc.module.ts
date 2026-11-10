import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcLoggingInterceptor } from './interceptors/grpc-logging.interceptor';

@Module({
  providers: [
    GrpcLoggingInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useExisting: GrpcLoggingInterceptor,
    },
  ],
})
export class GrpcModule {}
