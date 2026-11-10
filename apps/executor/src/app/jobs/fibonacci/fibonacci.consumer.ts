import { Injectable } from '@nestjs/common';
import { Jobs } from '@jobber/nestjs';
import {
  FibonacciDataMessage,
  PulsarClient,
  PulsarConsumer,
} from '@jobber/pulsar';
import { iterate } from 'fibonacci';

@Injectable()
export class FibonacciConsumer extends PulsarConsumer<FibonacciDataMessage> {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, Jobs.FIBONACCI);
  }

  protected async onMessage(data: FibonacciDataMessage): Promise<void> {
    // iterate(0) runs forever in the fibonacci package; skip poison/backlog messages
    if (!data.iterations || data.iterations < 1) {
      this.logger.warn(`Skipping invalid iterations: ${data.iterations}`);
      return;
    }
    const result = iterate(data.iterations);
    this.logger.log(result);
  }
}
