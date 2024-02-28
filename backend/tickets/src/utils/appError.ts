/**
 * @Scope is to return same format for all errors
 *
 * Format will be  [{ message:string,field?: string }]
 */

import { logger } from "../config/logger";
import { ErrorResponse, STATUS_CODES } from "../types";
import { ValidationError } from "express-validator";

export abstract class BaseError extends Error {
  constructor(public isOperational: boolean) {
    super();

    this.isOperational = isOperational;

    // Use this line Only because extend a build in class
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract statusCode(): STATUS_CODES;
  abstract ResponseError(): ErrorResponse[];
}

export class RouteError extends BaseError {
  private description: string;

  constructor(description = "Route not exists", isOperational = false) {
    super(isOperational);

    this.description = description;
    // Use this line Only because extend a build in class
    Object.setPrototypeOf(this, RouteError.prototype);
  }

  statusCode(): STATUS_CODES {
    return STATUS_CODES.NOT_FOUND;
  }
  ResponseError(): ErrorResponse[] {
    return [{ message: this.description }];
  }
}

export class BadRequestError extends BaseError {
  private description: string;
  private field?: string;
  constructor(description: string, field?: string, isOperational = false) {
    super(isOperational);

    this.field = field;
    this.description = description;
    // Use this line Only because extend a build in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  statusCode(): STATUS_CODES {
    return STATUS_CODES.BAD_REQUEST;
  }
  ResponseError(): ErrorResponse[] {
    return [
      { message: this.description, ...(this.field && { field: this.field }) },
    ];
  }
}

export class DatabaseConnectionError extends BaseError {
  private description: string;

  constructor(
    description = "Internal database connection error",
    isOperational = false
  ) {
    super(isOperational);

    this.description = description;
    // Use this line Only because extend a build in class
    Object.setPrototypeOf(this, RouteError.prototype);
  }

  statusCode(): STATUS_CODES {
    return STATUS_CODES.INTERNAL_SERVER_ERROR;
  }
  ResponseError(): ErrorResponse[] {
    return [{ message: this.description }];
  }
}

export class ExpressValidationError extends BaseError {
  public expressValidatorErrors: ValidationError[];
  constructor(errors: ValidationError[], isOperational = true) {
    super(isOperational);
    this.expressValidatorErrors = errors;
  }

  statusCode(): STATUS_CODES {
    return STATUS_CODES.BAD_REQUEST;
  }
  ResponseError(): ErrorResponse[] {
    return this.expressValidatorErrors.map((errorVars) => {
      if (errorVars.type === "field") {
        return { message: errorVars.msg, field: errorVars.path }; //return the format of error
      }
      return { message: errorVars.msg };
    });
  }
}

export class ErrorLogger {
  constructor() {}

  async logError(error: string) {
    console.log("==================== Start Error Logger ===============");
    logger.log({
      private: true,
      level: "error",
      message: error,
    });
    console.log("==================== End Error Logger ===============");
  }

  isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}
