import {
  DiscoveredClassWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { JOB_METADATA_KEY } from '../decorators/job.decorator';
import { AbstractJob } from './abstract-job';
import { JobMetadata } from '../interfaces/job-metadata.interface';
import { UPLOAD_FILE_PATH } from '../uploads/upload';
import fs from 'fs';

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

    const fileName = this.getFileName(data);
    if (fileName) {
      this.assertFileExists(fileName);
    }

    // Return immediately — file parse, validate, and Pulsar publish run in background.
    void this.runJob(job.discoveredClass.instance, name, fileName, data).catch(
      (error) => {
        console.error(`Job ${name} failed`, error);
      },
    );

    return job.meta;
  }

  private async runJob(
    instance: AbstractJob<object>,
    name: string,
    fileName: string | undefined,
    data: object | object[],
  ) {
    const payload = fileName ? await this.readFile(fileName) : data;
    await instance.execute(payload, name);
  }

  private getFileName(data: object | object[]): string | undefined {
    if (Array.isArray(data) || !data || typeof data !== 'object') {
      return undefined;
    }

    const fileName = (data as { fileName?: unknown }).fileName;
    return typeof fileName === 'string' ? fileName : undefined;
  }

  private assertFileExists(fileName: string) {
    if (!fs.existsSync(`${UPLOAD_FILE_PATH}/${fileName}`)) {
      throw new BadRequestException(`File ${fileName} does not exist`);
    }
  }

  private async readFile(fileName: string) {
    try {
      const file = await fs.promises.readFile(
        `${UPLOAD_FILE_PATH}/${fileName}`,
        'utf8',
      );
      return JSON.parse(file);
    } catch {
      throw new BadRequestException(`File ${fileName} does not exist`);
    }
  }
}
