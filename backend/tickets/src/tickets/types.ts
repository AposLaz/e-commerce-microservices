export type Ticket = {
  title: string;
  price: number;
};

export type TicketTimestamps = Ticket & {
  userId: number;
  createAt: Date;
  updateAt: Date;
} & Partial<Document>;
