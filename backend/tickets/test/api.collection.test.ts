import request from "supertest";
import { app } from "../src/app";
import { TestEnvs, setupTestsConfigs } from "./setup";
import { Db, FindOptions, MongoClient } from "mongodb";
import { Collections, Databases, DbProps } from "../src/config/mongodb/types";
import { connect } from "../src/config/mongodb/mongo.client";
import { MongoRepository } from "../src/config/mongodb/repository";
import { TicketTimestamps } from "../src/tickets/types";
import { KafkaAdmin } from "../src/config/kafka/kafka.admin";
import { Config } from "../src/config/config";

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
    await new KafkaAdmin().deleteTopicRecords(Config.topicCreate);
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

  it("Returns 404 error if ticket not found", async () => {
    const url1 = `${TestEnvs.ticketsUrl}?title=test`; //by query params
    await request(app)
      .get(url1)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({})
      .expect(404);

    const url2 = `${TestEnvs.ticketsUrl}/123`; //by id
    const response = await request(app)
      .get(url2)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    expect([404, 500]).toContain(response.status);
  });

  it("Returns the ticket if it is found", async () => {
    const url1 = `${TestEnvs.ticketsUrl}?title=testTicket`; //by query params
    const response = await request(app)
      .get(url1)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    expect(response.status).toEqual(200);

    const id = response.body[0]._id;

    const url2 = `${TestEnvs.ticketsUrl}/${id}`; //by id
    await request(app)
      .get(url2)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({})
      .expect(200);
  });

  it("Update Ticket with invalid data", async () => {
    //get ticket
    const response = await request(app)
      .get(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    await request(app)
      .patch(`${TestEnvs.ticketsUrl}/${response.body[0]._id}`)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({})
      .expect(400);

    await request(app)
      .patch(`${TestEnvs.ticketsUrl}/${response.body[0]._id}`)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({ title: "" })
      .expect(400);

    await request(app)
      .patch(`${TestEnvs.ticketsUrl}/${response.body[0]._id}`)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({ price: -1 })
      .expect(400);
  });
  it("Update Ticket valid data", async () => {
    //get ticket
    const response = await request(app)
      .get(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    await request(app)
      .patch(`${TestEnvs.ticketsUrl}/${response.body[0]._id}`)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({ title: "aaa" })
      .expect(204);

    await request(app)
      .patch(`${TestEnvs.ticketsUrl}/${response.body[0]._id}`)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({ price: 100 })
      .expect(204);

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
    expect(tickets[0].price).toEqual(100);
    expect(tickets[0].title).toEqual("aaa");
    expect(tickets[0].userId).toEqual("1234");
  });

  it("Delete Ticket Invalid data", async () => {
    await request(app)
      .delete(`${TestEnvs.ticketsUrl}`)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({ id: "aaa" })
      .expect(400);

    await request(app)
      .delete(`${TestEnvs.ticketsUrl}`)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({ id: [] })
      .expect(400);
  });

  it("Delete Ticket valid data", async () => {
    //get ticket
    const response = await request(app)
      .get(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    await request(app)
      .delete(`${TestEnvs.ticketsUrl}`)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({ id: [response.body[0]._id] })
      .expect(204);
  });
});
