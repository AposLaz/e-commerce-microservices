import { KafkaAdmin } from "./kafka.admin";
import { KafkaConsumerClient } from "./kafka.consumer";
import { KafkaProducerClient } from "./kafka.producer";

export class KafkaFactory {
  private static producer: KafkaProducerClient; //static method can be accessible without create a class instance
  private static consumer: KafkaConsumerClient;
  private static admin: KafkaAdmin;

  public static async KafkaProducer(topic: string) {
    //this is a singleton instance for producer
    if (!this.producer) {
      this.producer = new KafkaProducerClient(topic);
    }

    return this.producer;
  }

  public static async KafkaConsumer(topic: string) {
    //this is a singleton instance for consumer
    if (!this.producer) {
      this.consumer = new KafkaConsumerClient(topic);
    }

    return this.consumer;
  }

  public static async KafkaAdmin() {
    //this is a singleton instance for admin
    if (!this.admin) {
      this.admin = new KafkaAdmin();
    }

    return this.admin;
  }
}
