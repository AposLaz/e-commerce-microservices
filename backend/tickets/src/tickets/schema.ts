import { z } from "zod";

export const createTicketsPayload = z.object({
  title: z
    .string({ required_error: "title is required" })
    .min(1, { message: "title is required" }),
  price: z
    .number({
      required_error: "price is required",
      invalid_type_error: "price must be a number",
    })
    .gt(0, { message: "price must be greater than 0" })
    .positive({ message: "price must be a positive number" }),
});
