import { Jobs } from '@jobber/nestjs';
import { FibonacciDataMessage, PulsarClient } from '@jobber/pulsar';
import { Job } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract-job';

@Job({
  name: Jobs.FIBONACCI,
  description: 'Generate a Fibonaci and store in db',
})
export class FibonacciJob extends AbstractJob<FibonacciDataMessage> {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, FibonacciDataMessage);
  }
}
