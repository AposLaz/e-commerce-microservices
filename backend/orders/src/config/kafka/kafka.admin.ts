import { Admin } from "kafkajs";
import { kafkaClient } from "./kafka.client";

export class KafkaAdmin {
  private admin: Admin;

  constructor() {
    this.admin = kafkaClient.admin();
  }

  public async deleteTopicRecords(topic: string) {
    await this.admin.connect();

    //check if topic exists
    const listTopics = await this.admin.listTopics();
    const topicExists = listTopics.find((t) => t === topic);

    if (!topicExists) throw new Error(`Topic ${topic} not exists`);

    //fetch partitions
    const topicPartitions = await this.admin.fetchTopicMetadata({
      topics: [topic],
    });

    const partitions = topicPartitions.topics[0].partitions.map((p) => ({
      partition: p.partitionId,
      offset: "-1",
    }));

    await this.admin.deleteTopicRecords({
      topic: topic,
      partitions: partitions,
    });

    this.admin.disconnect();
  }
}
