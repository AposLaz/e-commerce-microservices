import request from "supertest";
import { app } from "../src/app";
import setupTestsConfigs from "./setup";

const ticketsUrl = "/api/v1/tickets";

describe("Tickets authentication", () => {
  it("[Not Authenticate] tickets can only be accessed if the user is signed in", async () => {
    const postResponse = await request(app).post(ticketsUrl).send({});
    expect(postResponse.status).toEqual(401);

    const putResponse = await request(app).put(ticketsUrl).send({});
    expect(putResponse.status).toEqual(401);

    const deleteResponse = await request(app).delete(ticketsUrl).send({});
    expect(deleteResponse.status).toEqual(401);
  });

  it("[Authenticate][POST] tickets can only be accessed if the user is signed in", async () => {
    const postResponse = await request(app)
      .post(ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    expect(postResponse.status).not.toEqual(401);

    const putResponse = await request(app)
      .put(ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    expect(putResponse.status).not.toEqual(401);

    const deleteResponse = await request(app)
      .delete(ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    expect(deleteResponse.status).not.toEqual(401);
  });
});

describe("Tickets validate data", () => {
  it("Returns an error if an invalid title (empty or not exists) is provided", async () => {
    await request(app)
      .post(ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({
        title: "",
        price: 10,
      })
      .expect(400);

    await request(app)
      .post(ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({
        price: 10,
      })
      .expect(400);
  });

  it("Returns an error if an invalid price is provided", async () => {
    await request(app)
      .post(ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({
        title: "test",
        price: -10,
      })
      .expect(400);

    await request(app)
      .post(ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({
        title: "test",
      })
      .expect(400);
  });

  it("Creates a ticket with valid params", async () => {
    await request(app)
      .post(ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({
        title: "testTicket",
        price: 20,
      })
      .expect(201);
  });
});
