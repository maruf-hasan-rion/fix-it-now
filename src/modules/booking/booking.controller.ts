import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { BookingService } from "./booking.service";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const result = await BookingService.createBooking(
      req.body,
      customerId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking created successfully",
      data: result,
    });
  },
);

const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    const result = await BookingService.getAllBookings(customerId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Bookings retrieved successfully",
      data: result,
    });
  },
);

const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceId = req.params.id;

    if (!serviceId) {
      throw new Error("Service Id Required In Params");
    }
    const result = await BookingService.getSingleBooking(serviceId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service retrieved successfully",
      data: result,
    });
  },
);

const getTechnicianBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.user?.id;
    const result = await BookingService.getTechnicianBookings(
      technicianId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician bookings retrieved successfully",
      data: result,
    });
  },
);
const updateStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.id;
    const { status } = req.body;

    if (!bookingId) {
      throw new Error("Booking Id Required In Params");
    }

    const result = await BookingService.updateStatus(
      bookingId as string,
      status,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking status updated successfully",
      data: result,
    });
  },
);

export const BookingController = {
  createBooking,
  getMyBookings,
  getSingleBooking,
  getTechnicianBookings,
  updateStatus,
};
