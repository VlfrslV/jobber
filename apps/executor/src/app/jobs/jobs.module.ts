import { Module } from '@nestjs/common';
import { FibonacciConsumer } from './fibonacci/fibonacci.consumer';
import { LoadProductsModule } from './products/load-products.module';
import { PulsarModule } from '@jobber/pulsar';

@Module({
  imports: [PulsarModule, LoadProductsModule],
  providers: [FibonacciConsumer],
  exports: [FibonacciConsumer],
})
export class JobsModule {}
