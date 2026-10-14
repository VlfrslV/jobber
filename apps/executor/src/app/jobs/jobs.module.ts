import { Module } from '@nestjs/common';
import { FibonacciConsumer } from './fibonacci/fibonacci.consumer';
import { PulsarModule } from '@jobber/pulsar';

@Module({
  imports: [PulsarModule],
  providers: [FibonacciConsumer],
  exports: [FibonacciConsumer],
})
export class JobsModule {}
