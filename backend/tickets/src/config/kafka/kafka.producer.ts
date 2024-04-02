import {
  Message,
  Partitioners,
  Producer,
  ProducerBatch,
  TopicMessages,
} from "kafkajs";
import { kafkaClient } from "./kafka.client";
import { logger } from "config/logger";

export type ProducerMessageSchema = {};

export class KafkaProducerClient {
  private producer: Producer;
  private topic: string;

  constructor(topic: string) {
    this.topic = topic;
    this.createProducer();
    this.connect();
  }

  private createProducer() {
    this.producer = kafkaClient.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
      allowAutoTopicCreation: false,
      idempotent: true,
      retry: {
        maxRetryTime: 20000,
        initialRetryTime: 2000,
        retries: 10,
      },
    });
  }

  private async connect() {
    try {
      await this.producer.connect();
    } catch (error) {
      logger.error("Error connecting the producer: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect();
  }

  public async sendBatch(
    messages: Array<ProducerMessageSchema>
  ): Promise<void> {
    const kafkaMessages: Array<Message> = messages.map((message) => {
      return {
        value: JSON.stringify(message),
      };
    });

    const topicMessages: TopicMessages = {
      topic: this.topic,
      messages: kafkaMessages,
    };

    const batch: ProducerBatch = {
      topicMessages: [topicMessages],
    };

    await this.producer.sendBatch(batch);
  }
}
