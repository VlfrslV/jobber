import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Packages, PRODUCTS_PROTO_PATH } from '@jobber/grpc';
import { PulsarModule } from '@jobber/pulsar';
import { LoadProductsConsumer } from './load-products.consumer';

@Module({
  imports: [
    PulsarModule,
    ClientsModule.registerAsync([
      {
        name: Packages.PRODUCTS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: Packages.PRODUCTS,
            protoPath: PRODUCTS_PROTO_PATH,
            url: configService.getOrThrow<string>('PRODUCTS_GRPC_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [LoadProductsConsumer],
})
export class LoadProductsModule {}
