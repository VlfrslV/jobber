import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Consumer, Message, Producer } from 'pulsar-client';

@Injectable()
export class PulsarClient implements OnModuleDestroy {
  private readonly client = new Client({
    serviceUrl: this.configService.getOrThrow<string>('PULSAR_SERVICE_URL'),
  });
  private producers: Producer[] = [];
  private consumers: Consumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async createProducer(topic: string): Promise<Producer> {
    const producer = await this.client.createProducer({
      topic,
    });
    this.producers.push(producer);
    return producer;
  }

  async createConsumer(
    topic: string,
    listener: (message: Message) => void,
  ): Promise<Consumer> {
    const consumer = await this.client.subscribe({
      topic,
      subscription: 'jobber',
      listener,
    });
    this.consumers.push(consumer);
    return consumer;
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all(this.producers.map((producer) => producer.close()));
    await Promise.all(this.consumers.map((consumer) => consumer.close()));
    await this.client.close();
  }
}
