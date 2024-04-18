import { Filter, FindOptions, MongoClient } from "mongodb";

export enum Databases {
  TestDb = "_init_test_orders",
  OrdersDb = "orders",
}
export enum Collections {
  Orders = "orders",
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
