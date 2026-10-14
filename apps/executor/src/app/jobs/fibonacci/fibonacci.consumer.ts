import { Injectable } from '@nestjs/common';
import { PulsarClient, PulsarConsumer } from '@jobber/pulsar';
import { FibonacciData } from './fibonacci-data.interface';
import { iterate } from 'fibonacci';

@Injectable()
export class FibonacciConsumer extends PulsarConsumer<FibonacciData> {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'fibonacci');
  }

  protected async onMessage(data: FibonacciData): Promise<void> {
    // iterate(0) runs forever in the fibonacci package; skip poison/backlog messages
    if (!data.iterations || data.iterations < 1) {
      this.logger.warn(`Skipping invalid iterations: ${data.iterations}`);
      return;
    }
    const result = iterate(data.iterations);
    this.logger.log(result);
  }
}
