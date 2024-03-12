import { Request, Response } from "express";
import { createTicketsPayload } from "./schema";
import { ZodValidationError } from "@aplaz-tech/error-handler";
import { mapper } from "./mapper";
import { MongoRepository } from "../config/mongodb/repository";
import { Collections, Databases, DbProps } from "../config/mongodb/types";
import { MongoError } from "mongodb";

const dbProps: DbProps = {
  database: Databases.TicketsDb,
  collection: Collections.Tickets,
};

export const TicketController = {
  //tickets controller
  async createTicket(req: Request, res: Response) {
    const parsedBody = createTicketsPayload.safeParse(req.body);
    if (!parsedBody.success) {
      throw new ZodValidationError(parsedBody.error);
    }

    const ticket = mapper.TicketCreate(parsedBody.data, res.locals.user.id);
    const insertData = await MongoRepository.insertDocuments(dbProps, [
      ticket,
    ] as Document[]);

    if (insertData.insertedCount < 1) throw new MongoError("Save data failed");
    res.status(201).send(insertData);
  },
};
