import {
  DiscoveredClassWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { JOB_METADATA_KEY } from '../decorators/job.decorator';
import { AbstractJob } from './abstract-job';
import { JobMetadata } from '../interfaces/job-metadata.interface';

@Injectable()
export class JobsService implements OnModuleInit {
  private jobs: DiscoveredClassWithMeta<JobMetadata>[] = [];
  constructor(private readonly discoveryService: DiscoveryService) {}

  async onModuleInit() {
    this.jobs =
      await this.discoveryService.providersWithMetaAtKey<JobMetadata>(
        JOB_METADATA_KEY,
      );
    console.log(this.jobs);
  }

  getJobs() {
    return this.jobs.map((job) => job.meta);
  }

  async executeJob(name: string, data: object | object[]) {
    const job = this.jobs.find((job) => job.meta.name === name);

    if (!job) {
      throw new BadRequestException(`Job ${name} does not exist`);
    }

    if (!(job.discoveredClass.instance instanceof AbstractJob)) {
      throw new BadRequestException(`Job ${name} is not instantiated`);
    }

    await job.discoveredClass.instance.execute(data, job.meta.name);

    return job.meta;
  }
}
