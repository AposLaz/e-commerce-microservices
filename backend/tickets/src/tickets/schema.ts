import { z } from "zod";
import validator from "validator";

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

export const getTicketParams = z.object({
  title: z
    .string({ required_error: "title is required" })
    .min(1, { message: "title is required" })
    .optional(),
  price: z
    .string()
    .refine((val) => validator.isNumeric(val), {
      message: "price must contain only numbers",
    })
    .transform((price) => Number(price))
    .refine((price) => price > 0, { message: "price must be greater than 0" })
    .refine((price) => !isNaN(price), { message: "price must be a number" })
    .optional(),
  userId: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  createAt: z.string().datetime().optional(),
  updateAt: z.string().datetime().optional(),
});
