import request from "supertest";
import { app } from "../src/app";
import { TestEnvs, setupTestsConfigs } from "./setup";
import { Db, FindOptions, MongoClient } from "mongodb";
import { Collections, Databases, DbProps } from "../src/config/mongodb/types";
import { connect } from "../src/config/mongodb/mongo.client";
import { MongoRepository } from "../src/config/mongodb/repository";
import { TicketTimestamps } from "../src/tickets/types";

describe("Tickets validate data", () => {
  let client: MongoClient;
  let dbProps: DbProps;

  beforeAll(async () => {
    client = await connect();

    dbProps = {
      client: client,
      database: Databases.TestDb,
      collection: Collections.Tickets,
    };
  }, 120000);

  afterAll(async () => {
    //drop collection
    await MongoRepository.dropCollection(dbProps);
    await client.close();
  });

  it("Check if collection is empty", async () => {
    const query = {};
    const queryOptions: FindOptions = {};
    const tickets = await MongoRepository.readDocuments<TicketTimestamps>(
      dbProps,
      {
        query,
        queryOptions,
      }
    );
    expect(tickets.length).toEqual(0);
  });

  it("Returns an error if an invalid title (empty or not exists) is provided", async () => {
    await request(app)
      .post(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({
        title: "",
        price: 10,
      })
      .expect(400);

    await request(app)
      .post(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({
        price: 10,
      })
      .expect(400);
  });

  it("Returns an error if an invalid price is provided", async () => {
    await request(app)
      .post(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({
        title: "test",
        price: -10,
      })
      .expect(400);

    await request(app)
      .post(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({
        title: "test",
      })
      .expect(400);
  });

  it("Creates a ticket with valid params", async () => {
    await request(app)
      .post(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({
        title: "testTicket",
        price: 20,
      })
      .expect(201);

    const query = {};
    const queryOptions: FindOptions = {};
    const tickets = await MongoRepository.readDocuments<TicketTimestamps>(
      dbProps,
      {
        query,
        queryOptions,
      }
    );
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual("testTicket");
    expect(tickets[0].userId).toEqual("1234");
  });
});
