import { Module } from '@nestjs/common';
import { FibonacciJob } from './fibonacci/fibonacci.job';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME, AUTH_PROTO_PATH } from '@jobber/grpc';
import { PulsarModule } from '@jobber/pulsar';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PulsarModule,
    DiscoveryModule,
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: AUTH_PROTO_PATH,
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  providers: [FibonacciJob, JobsService, JobsResolver],
  exports: [],
})
export class JobsModule {}
