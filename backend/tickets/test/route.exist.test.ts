import request from "supertest";
import { app } from "../src/app";
import { TestEnvs, setupTestsConfigs } from "./setup";

describe("Tickets authentication", () => {
  it("[Not Authenticate] tickets can only be accessed if the user is signed in", async () => {
    const postResponse = await request(app).post(TestEnvs.ticketsUrl).send({});
    expect(postResponse.status).toEqual(401);

    const putResponse = await request(app)
      .patch(`${TestEnvs.ticketsUrl}/123`)
      .send({});
    expect(putResponse.status).toEqual(401);

    const deleteResponse = await request(app)
      .delete(TestEnvs.ticketsUrl)
      .send({});
    expect(deleteResponse.status).toEqual(401);
  });

  it("[Authenticate] tickets can only be accessed if the user is signed in", async () => {
    const postResponse = await request(app)
      .post(TestEnvs.ticketsUrl)
      .set("Cookie", await setupTestsConfigs.getSignInJwtToken())
      .send({});

    expect(postResponse.status).not.toEqual(401);

    const putResponse = await request(app)
      .patch(`${TestEnvs.ticketsUrl}/123`)
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
