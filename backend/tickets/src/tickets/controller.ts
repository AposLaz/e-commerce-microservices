import { Request, Response } from "express";
import { createTicketsPayload, getTicketParams } from "./schema";
import { mapper } from "./mapper";
import { MongoRepository } from "../config/mongodb/repository";
import {
  Collections,
  Databases,
  DbProps,
  ReadDocumentsQueryParameters,
} from "../config/mongodb/types";
import { MongoError } from "mongodb";
import { TicketTimestamps } from "./types";
import { DataNotFound, ZodValidationError } from "@aplaz-tech/error-handler";

const dbProps: DbProps = {
  database: Databases.TicketsDb,
  collection: Collections.Tickets,
};

export const Controller = {
  //tickets controller
  createTicket: async (req: Request, res: Response) => {
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

  getTicket: async (req: Request, res: Response) => {
    const parseParams = getTicketParams.safeParse(req.query);
    if (!parseParams.success) {
      throw new ZodValidationError(parseParams.error);
    }

    const query = parseParams.data;
    const options = {};

    const params: ReadDocumentsQueryParameters = {
      query: query,
      queryOptions: options,
    };

    const tickets = await MongoRepository.readDocuments<TicketTimestamps>(
      dbProps,
      params
    );

    if (tickets.length === 0) throw new DataNotFound("Tickets not found");

    res.status(200).send(tickets);
  },

  getTicketById: async (req: Request, res: Response) => {
    const ticketId = req.params.id;
  },
};
