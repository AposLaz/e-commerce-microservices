import { MongoClient } from "mongodb";

export type Databases = "_init_test_tickets" | "tickets";
export type Collections = "";

export type DatabaseProps = {
  database: Databases;
  collection: Collections;
};

export type MongoDbProps = {
  client: MongoClient;
} & DatabaseProps;
