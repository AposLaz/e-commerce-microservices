import request from "supertest";
import { app } from "../src/app";

describe("Ticket routes exists", () => {
  it("Has a router handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).post("/api/v1/tickets").send({});

    expect(response.status).not.toEqual(404);
  });

  it("Has a router handler listening to /api/tickets for get requests", async () => {
    const response = await request(app).get("/api/v1/tickets").send({});

    expect(response.status).not.toEqual(404);
  });

  it("Has a router handler listening to /api/tickets for get id requests", async () => {
    const response = await request(app).get("/api/v1/tickets/12345").send({});

    expect(response.status).not.toEqual(404);
  });

  it("Has a router handler listening to /api/tickets for update id requests", async () => {
    const response = await request(app).put("/api/v1/tickets").send({});

    expect(response.status).not.toEqual(404);
  });

  it("Has a router handler listening to /api/tickets for delete id requests", async () => {
    const response = await request(app).delete("/api/v1/tickets").send({});

    expect(response.status).not.toEqual(404);
  });
});
