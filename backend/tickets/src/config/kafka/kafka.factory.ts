import { KafkaAdmin } from "./kafka.admin";
import { KafkaProducerClient } from "./kafka.producer";

export class KafkaFactory {
  private static producer: KafkaProducerClient; //static method can be accessible without create a class instance
  private static admin: KafkaAdmin;

  public static async KafkaProducer(topic: string) {
    //this is a singleton instance for producer
    if (!this.producer) {
      this.producer = new KafkaProducerClient(topic);
    }

    return this.producer;
  }

  public static async KafkaAdmin() {
    //this is a singleton instance for producer
    if (!this.admin) {
      this.admin = new KafkaAdmin();
    }

    return this.admin;
  }
}
