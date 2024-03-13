import {
  Collection,
  DeleteOptions,
  DeleteResult,
  Filter,
  InsertManyResult,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
  WithId,
} from "mongodb";
import { connect } from "./mongo.client";
import {
  Collections,
  Databases,
  DbProps,
  ReadDocumentsQueryParameters,
} from "./types";

const getCollection = async <T extends Document>(
  dbProps: DbProps
): Promise<Collection<T>> => {
  const mongoClient = dbProps.client ? dbProps.client : await connect();
  let database = dbProps.database;
  let collection = dbProps.collection;

  if (process.env.NODE_ENV === "test") {
    database = Databases.TestDb;
    collection = Collections.Tickets;
  }

  return mongoClient.db(database).collection<T>(collection);
};

const dropCollection = async (dbProps: DbProps): Promise<boolean> => {
  const collection = await getCollection(dbProps);
  return await collection.drop();
};

const insertDocuments = async <T extends Document>(
  dbProps: DbProps,
  docs: OptionalUnlessRequiredId<T>[]
): Promise<InsertManyResult> => {
  const collection = await getCollection<T>(dbProps);

  return await collection.insertMany(docs);
};

const readDocuments = async <T>(
  dbProps: DbProps,
  params: ReadDocumentsQueryParameters
): Promise<T[]> => {
  const collection = await getCollection(dbProps);
  const res: T[] = [];
  const cursor = await collection
    .find(params.query, params.queryOptions)
    .toArray();

  cursor.forEach((item: WithId<Document>) => res.push(item as unknown as T));

  return res;
};

const readSingleDocument = async <T>(
  dbProps: DbProps,
  params: ReadDocumentsQueryParameters
): Promise<T | null> => {
  const collection = await getCollection(dbProps);

  return await collection.findOne<T>(params.query, params.queryOptions);
};

const updateSingleDocument = async <T extends Document>(
  dbProps: DbProps,
  filter: Filter<T>,
  update: any,
  options?: UpdateOptions
) => {
  const collection = await getCollection<T>(dbProps);

  const updateOptions = options ? options : { upsert: true };
  return await collection.updateOne(filter, { $set: update }, updateOptions);
};

const deleteDocuments = async <T extends Document>(
  dbProps: DbProps,
  filter: Filter<T>,
  deleteOptions?: DeleteOptions
): Promise<DeleteResult> => {
  const collection = await getCollection<T>(dbProps);
  return await collection.deleteMany(filter, deleteOptions);
};

export const MongoRepository = {
  insertDocuments,
  readDocuments,
  readSingleDocument,
  updateSingleDocument,
  deleteDocuments,
  dropCollection,
};
