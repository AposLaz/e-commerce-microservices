import { BaseErrorType, STATUS_CODES } from "../types";
import { ValidationError } from "express-validator";

export abstract class BaseError extends Error {
  constructor(message: string) {
    super(message);

    // Use this line Only because extend a build in class
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract statusCode: number;
  abstract ErrorMessage(): BaseErrorType[];
}

//400
export class ErrorValidationHandler extends BaseError {
  statusCode: STATUS_CODES = STATUS_CODES.BAD_REQUEST;
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super("Invalid data");
    this.errors = errors;

    // Use this line Only because extend a build in class
    Object.setPrototypeOf(this, ErrorValidationHandler.prototype);
  }

  ErrorMessage(): BaseErrorType[] {
    return this.errors.map((errorVars) => {
      if (errorVars.type === "field") {
        return { message: errorVars.msg, field: errorVars.path }; //return the format of error
      }
      return { message: errorVars.msg };
    });
  }
}

//400
export class BadRequestError extends BaseError {
  statusCode: STATUS_CODES = STATUS_CODES.BAD_REQUEST;
  public errorMessage: string;
  public field?: string;
  constructor(errorMessage: string, field?: string) {
    super(errorMessage);

    this.errorMessage = errorMessage;
    this.field = field;
    // Use this line Only because extend a build in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  ErrorMessage(): BaseErrorType[] {
    return [
      {
        message: this.errorMessage,
        field: this.field,
      },
    ];
  }
}

//500
export class DatabaseConnectionError extends BaseError {
  statusCode: STATUS_CODES = STATUS_CODES.INTERNAL_ERROR;
  errorMessage = "Cannot connect to Database";

  constructor() {
    super("Error connecting to database");

    // Use this line Only because extend a build in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  ErrorMessage(): BaseErrorType[] {
    return [
      {
        message: this.errorMessage,
      },
    ];
  }
}

export class NotRouteError extends BaseError {
  statusCode = 404;

  constructor() {
    super("The Route does Not exists");
    // Use this line Only because extend a build in class
    Object.setPrototypeOf(this, NotRouteError.prototype);
  }

  ErrorMessage(): BaseErrorType[] {
    return [{ message: "Route Not Found" }];
  }
}
