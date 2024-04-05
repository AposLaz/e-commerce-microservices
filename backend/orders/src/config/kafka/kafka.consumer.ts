import { Consumer, ConsumerSubscribeTopics, EachBatchPayload } from "kafkajs";
import { kafkaClient } from "./kafka.client";
import { logger } from "../logger";

export class KafkaConsumerClient {
  private consumer: Consumer;

  constructor(topic: string) {
    this.createConsumer(topic);
    this.connectConsumer();
  }

  private createConsumer(topic: string) {
    this.consumer = kafkaClient.consumer({ groupId: `group-${topic}` });
  }

  private async connectConsumer() {
    try {
      await this.consumer.connect();
      logger.info(`Consumer connected succesfully`);
    } catch (error) {
      logger.error("Error connecting the consumer: ", error);
    }
  }

  // TODO => pass a function to process messages, PASS
  public async startBatchConsumer<T>(
    topicC: string,
    fn?: (data: T) => T | Promise<T>
  ): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [topicC],
      fromBeginning: false,
    };

    try {
      await this.consumer.subscribe(topic);

      await this.consumer.run({
        eachBatch: async (eachBatchPayload: EachBatchPayload) => {
          const { batch } = eachBatchPayload;
          for (const message of batch.messages) {
            if (message.value) {
              const jsonString = message.value.toString("utf8");
              const data = JSON.parse(jsonString);

              console.log(data);
              //TODO something with the function
              //await fn(data)
            }
          }
        },
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}
