import { Consumer, Message } from 'pulsar-client';
import { PulsarClient } from './pulsar.client';
import { Logger, OnModuleInit } from '@nestjs/common';
import { deserialize } from './serialize';

export abstract class PulsarConsumer<T> implements OnModuleInit {
  private consumer!: Consumer;
  protected readonly logger = new Logger(this.topic);

  constructor(
    private readonly pulsarClient: PulsarClient,
    private readonly topic: string,
  ) {}

  async onModuleInit() {
    this.consumer = await this.pulsarClient.createConsumer(
      this.topic,
      this.listener.bind(this),
    );
  }

  private async listener(message: Message): Promise<void> {
    try {
      const data = deserialize<T>(message.getData());
      this.logger.log(`Received message: ${JSON.stringify(data)}`);
      await this.onMessage(data);
    } catch (error) {
      this.logger.error(`Error processing message: ${error}`);
    } finally {
      this.consumer.acknowledge(message);
    }
  }

  protected abstract onMessage(data: T): Promise<void>;
}
