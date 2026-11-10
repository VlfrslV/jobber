import { Jobs } from '@jobber/nestjs';
import { Job } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract-job';
import { ProductsLoadMessage, PulsarClient } from '@jobber/pulsar';

@Job({
  name: Jobs.LOAD_PRODUCTS,
  description: 'Load products into the database',
})
export class LoadProductsJob extends AbstractJob<ProductsLoadMessage> {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, ProductsLoadMessage);
  }
}
