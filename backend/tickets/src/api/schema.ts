import { z } from "zod";
import validator from "validator";
import { ObjectId } from "mongodb";

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
  quantity: z
    .number({
      required_error: "quantity is required",
      invalid_type_error: "quantity must be a number",
    })
    .gte(0, { message: "quantity must be greater than or equal to 0" }),
});

export const updateTicketPayload = createTicketsPayload
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "No data to update",
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
  quantity: z
    .string()
    .refine((val) => validator.isNumeric(val), {
      message: "quantity must contain only numbers",
    })
    .transform((price) => Number(price))
    .refine((price) => price >= 0, {
      message: "quantity must be greater than or equal to 0",
    })
    .refine((price) => !isNaN(price), { message: "quantity must be a number" })
    .optional(),
  userId: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  createAt: z.string().datetime().optional(),
  updateAt: z.string().datetime().optional(),
});

export const deleteTicketsPayload = z.object({
  id: z
    .string({
      required_error: "id is required",
      invalid_type_error: "Invalid Data",
    })
    .array()
    .transform((val) => val.map((_id) => new ObjectId(_id)))
    .refine((arr) => arr.length > 0, { message: "No tickets for delete" }),
});
