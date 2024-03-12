import { Filter, FindOptions, MongoClient } from "mongodb";

export enum Databases {
  TestDb = "_init_test_tickets",
  TicketsDb = "tickets",
}
export enum Collections {
  Tickets = "tickets",
}

export type DatabaseProps = {
  database: Databases;
  collection: Collections;
};

export type DbProps = {
  client?: MongoClient;
} & DatabaseProps;

export interface ReadDocumentsQueryParameters<I extends Document = Document> {
  query: Filter<I>;
  queryOptions?: FindOptions<I> | undefined;
}
