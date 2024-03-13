import { Request, Response } from "express";
import {
  createTicketsPayload,
  deleteTicketsPayload,
  getTicketParams,
  updateTicketPayload,
} from "./schema";
import { mapper } from "./mapper";
import { MongoRepository } from "../config/mongodb/repository";
import {
  Collections,
  Databases,
  DbProps,
  ReadDocumentsQueryParameters,
} from "../config/mongodb/types";
import { MongoError, ObjectId } from "mongodb";
import { TicketTimestamps, TicketUpdate, TicketsDelete } from "./types";
import {
  BadRequestError,
  DataNotFound,
  ZodValidationError,
} from "@aplaz-tech/error-handler";

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

  getTickets: async (req: Request, res: Response) => {
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

    const params = {
      query: { _id: new ObjectId(ticketId) },
      queryOptions: { projection: { _id: 0 } },
    };

    const ticket = await MongoRepository.readSingleDocument<TicketTimestamps>(
      dbProps,
      params
    );

    if (!ticket) throw new DataNotFound("Ticket not found");

    res.status(200).send(ticket);
  },

  updateTicket: async (req: Request, res: Response) => {
    const parseBody = updateTicketPayload.safeParse(req.body);

    if (!parseBody.success) {
      throw new ZodValidationError(parseBody.error);
    }

    const ticketId = req.params.id;

    const filter = {
      _id: new ObjectId(ticketId),
    };
    const update = mapper.TicketUpdate(parseBody.data);

    const updateTicket = await MongoRepository.updateSingleDocument<
      TicketUpdate & Document
    >(dbProps, filter, update);

    if (updateTicket.modifiedCount === 0) {
      throw new BadRequestError("Update not happened");
    }

    res.status(204).send();
  },
  deleteTickets: async (req: Request, res: Response) => {
    const parseBody = deleteTicketsPayload.safeParse(req.body);

    if (!parseBody.success) {
      throw new ZodValidationError(parseBody.error);
    }

    const filter = { _id: { $in: parseBody.data.id } };

    const deleteTickets = await MongoRepository.deleteDocuments<
      TicketsDelete & Document
    >(dbProps, filter);

    if (deleteTickets.deletedCount === 0) {
      throw new DataNotFound("Tickets not found");
    }

    res.status(204).send();
  },
};
