import { Producer } from 'pulsar-client';
import { PulsarClient, serialize } from '@jobber/pulsar';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export abstract class AbstractJob<T extends object> {
  private producer: Producer;

  constructor(
    private readonly pulsarClient: PulsarClient,
    private readonly messageClass: new () => T,
  ) {}

  async execute(data: T | T[], job: string) {
    await this.validateData(data);
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }

    const items = Array.isArray(data) ? data : [data];
    for (const item of items) {
      await this.producer.send({
        data: serialize(item),
      });
    }
  }

  private async validateData(data: T | T[]): Promise<void> {
    const items = Array.isArray(data) ? data : [data];
    const instances = plainToInstance(this.messageClass, items);
    const errors = (
      await Promise.all(instances.map((item) => validate(item)))
    ).flat();

    if (errors.length) {
      throw new BadRequestException(
        `Invalid data for job: ${JSON.stringify(errors)}`,
      );
    }
  }
}
