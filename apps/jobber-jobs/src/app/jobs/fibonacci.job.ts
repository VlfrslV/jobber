import { Job } from '../decorators/job.decorator';
import { AbstractJob } from './abstract-job';

@Job({
  name: 'fibonacci',
  description: 'Generate a Fibonaci and store in db',
})
export class FibonacciJob extends AbstractJob {}
