import httpStatus from "http-status";

class AppError extends Error {
  statusCode: number;

  constructor(
    statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
    message: string,
  ) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
