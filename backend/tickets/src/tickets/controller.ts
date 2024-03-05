import { Request, Response } from "express";
import { createTicketsPayload } from "./schema";
import { ZodValidationError } from "@aplaz-tech/error-handler";

export const TicketController = {
  //tickets controller
  async createTicket(req: Request, res: Response) {
    const parsedBody = createTicketsPayload.safeParse(req.body);
    if (!parsedBody.success) {
      throw new ZodValidationError(parsedBody.error);
    }

    res.status(201).send();
  },
};
