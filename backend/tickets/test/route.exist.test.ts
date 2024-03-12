import request from "supertest";
import { app } from "../src/app";
import { TestEnvs, setupTestsConfigs } from "./setup";

describe("Ticket routes exists", () => {
  it("Has a router handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).post(TestEnvs.ticketsUrl).send({});

    expect(response.status).not.toEqual(404);
  });

  it("Has a router handler listening to /api/tickets for get requests", async () => {
    const response = await request(app).get(TestEnvs.ticketsUrl).send({});

    expect(response.status).not.toEqual(404);
  });

  it("Has a router handler listening to /api/tickets for get id requests", async () => {
    const response = await request(app).get(TestEnvs.ticketsUrl).send({});

    expect(response.status).not.toEqual(404);
  });

  it("Has a router handler listening to /api/tickets for update id requests", async () => {
    const response = await request(app).put(TestEnvs.ticketsUrl).send({});

    expect(response.status).not.toEqual(404);
  });

  it("Has a router handler listening to /api/tickets for delete id requests", async () => {
    const response = await request(app).delete(TestEnvs.ticketsUrl).send({});

    expect(response.status).not.toEqual(404);
  });
});

describe("Tickets authentication", () => {
  it("[Not Authenticate] tickets can only be accessed if the user is signed in", async () => {
    const postResponse = await request(app).post(TestEnvs.ticketsUrl).send({});
    expect(postResponse.status).toEqual(401);

    const putResponse = await request(app).put(TestEnvs.ticketsUrl).send({});
    expect(putResponse.status).toEqual(401);

    const deleteResponse = await request(app)
      .delete(TestEnvs.ticketsUrl)
      .send({});
    expect(deleteResponse.status).toEqual(401);
  });

  it("[Authenticate][POST] tickets can only be accessed if the user is signed in", async () => {
    const postResponse = await request(app)
      .post(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    expect(postResponse.status).not.toEqual(401);

    const putResponse = await request(app)
      .put(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    expect(putResponse.status).not.toEqual(401);

    const deleteResponse = await request(app)
      .delete(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    expect(deleteResponse.status).not.toEqual(401);
  });
});
