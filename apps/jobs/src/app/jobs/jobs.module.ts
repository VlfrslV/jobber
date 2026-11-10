import { Module } from '@nestjs/common';
import { FibonacciJob } from './fibonacci/fibonacci.job';
import { LoadProductsJob } from './products/load-products.job';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PROTO_PATH, Packages } from '@jobber/grpc';
import { PulsarModule } from '@jobber/pulsar';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PulsarModule,
    DiscoveryModule,
    ClientsModule.registerAsync([
      {
        name: Packages.AUTH,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: Packages.AUTH,
            protoPath: AUTH_PROTO_PATH,
            url: configService.getOrThrow<string>('AUTH_GRPC_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [FibonacciJob, LoadProductsJob, JobsService, JobsResolver],
  exports: [],
})
export class JobsModule {}
