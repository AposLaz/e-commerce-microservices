export type ErrorResponse = {
  message: string;
  field?: string;
};

export enum STATUS_CODES {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
