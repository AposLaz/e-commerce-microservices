import {
  Message,
  Partitioners,
  Producer,
  ProducerBatch,
  TopicMessages,
} from "kafkajs";
import { kafkaClient } from "./kafka.client";
import { logger } from "../logger";
import { TicketTimestamps } from "../../tickets/types";

export type CreateTicketSchema = TicketTimestamps &
  Omit<TicketTimestamps, keyof Partial<Document>>;

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
      transactionalId: `transactional-producer-${this.topic}`,
      allowAutoTopicCreation: true,
      idempotent: true,
      maxInFlightRequests: 1,
    });
  }

  private async connect() {
    try {
      await this.producer.connect();
      logger.info("Producer connected succesfully");
    } catch (error) {
      logger.error("Error connecting the producer: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect();
  }

  public async sendBatch(messages: Array<CreateTicketSchema>): Promise<void> {
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

  public async sendTransactionBatch(
    messages: Array<CreateTicketSchema>
  ): Promise<boolean> {
    const transaction = await this.producer.transaction();

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

    try {
      await transaction.sendBatch(batch);
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.abort();
      return false;
    }
  }
}
