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
import { BaseError, ErrorLogger } from "../utils/error-api";

export const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logError = new ErrorLogger();
  //if error is operational

  if (err instanceof BaseError) {
    if (!logError.isTrustedError(err))
      await logError.logError(err.ResponseError()[0].message); //log error

    return res.status(err.statusCode()).send({ errors: err.ResponseError() });
  }

  await logError.logError(err.message); //log error
  res.status(500).send({
    errors: [{ message: err }],
  });
};
