import { z } from "zod";
import {
  createTicketsPayload,
  deleteTicketsPayload,
  updateTicketPayload,
} from "./schema";

export type Ticket = z.infer<typeof createTicketsPayload>;

export type TicketUpdate = z.infer<typeof updateTicketPayload> & {
  updateAt: Date;
};

export type TicketsDelete = z.infer<typeof deleteTicketsPayload>;

export type TicketTimestamps = Ticket & {
  userId: number;
  createAt: Date;
  updateAt: Date;
} & Partial<Document>;
