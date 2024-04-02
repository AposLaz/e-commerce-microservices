import { KafkaProducerClient } from "./kafka.producer";

export class KafkaFactory {
  private static producer: KafkaProducerClient; //static method can be accessible without create a class instance

  public static KafkaProducer(topic: string) {
    //this is a singleton instance for producer
    if (!this.producer) {
      this.producer = new KafkaProducerClient(topic);
    }

    return this.producer;
  }
}
