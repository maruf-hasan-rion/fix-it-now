import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";
import { ZodError } from "zod";
import AppError from "../utils/AppError";
// import AppError from "../errors/AppError";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorDetails: unknown = null;

  // Custom App Error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error";
    errorDetails = err.issues;
  }

  // Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid data or missing required fields.";
  }

  // Prisma Known Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        message = "A record with this value already exists.";
        break;

      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Foreign key constraint failed.";
        break;

      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        message = "Record not found.";
        break;

      default:
        statusCode = httpStatus.BAD_REQUEST;
        message = err.message;
    }
  }

  // Prisma Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    switch (err.errorCode) {
      case "P1000":
        statusCode = httpStatus.UNAUTHORIZED;
        message = "Database authentication failed.";
        break;

      case "P1001":
        statusCode = httpStatus.SERVICE_UNAVAILABLE;
        message = "Unable to connect to the database.";
        break;

      default:
        message = err.message;
    }
  }

  // Prisma Unknown Error
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = "An unexpected database error occurred.";
  }

  // Native Error
  else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
    ...(process.env.NODE_ENV === "development" &&
      err instanceof Error && {
        stack: err.stack,
      }),
  });
};
