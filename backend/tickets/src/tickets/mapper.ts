import { Ticket, TicketTimestamps } from "./types";

export const mapper = {
  TicketCreate: (data: Ticket, userId: number): TicketTimestamps => ({
    ...data,
    userId: userId,
    createAt: new Date(),
    updateAt: new Date(),
  }),
  TicketUpdate: (data: Ticket) => ({
    ...data,
    updateAt: new Date(),
  }),
};
