/**
 * We have two types of errors
 *
 * 1) RequestValidationError
 * 2) DatabaseConnactionError
 * 3) Errors that I do not know how to handle them
 *
 * Error Format is {
 *                    message: 'message of error'
 *                    field: 'for example email - password etc...'
 *                 }
 */

import { Request, Response, NextFunction } from "express";
import { BaseError } from "../utils/error-api";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).send({ errors: err.ErrorMessage() });
  }

  res.status(500).send({
    errors: [
      { message: "Something gone wrong in application. Try restart!!!" },
    ],
  });
};
