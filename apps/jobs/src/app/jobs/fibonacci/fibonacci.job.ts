import { Job } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract-job';
import { PulsarClient } from '@jobber/pulsar';
import { FibonacciDataMessage } from './fibonacci-data.message';

@Job({
  name: 'fibonacci',
  description: 'Generate a Fibonaci and store in db',
})
export class FibonacciJob extends AbstractJob<FibonacciDataMessage> {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, FibonacciDataMessage);
  }
}
