import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type { IBooking } from "./booking.interface";
import httpStatus from "http-status";

const createBooking = async (bookingData: IBooking, customerId: string) => {
  const service = await prisma.service.findUnique({
    where: {
      id: bookingData.serviceId,
    },
  });
  if (!service) throw new AppError(httpStatus.NOT_FOUND, "Service not found");

  const technician = await prisma.technicianProfile.findUnique({
    where: {
      id: service.technicianId,
    },
  });

  if (!technician?.isAvailable) {
    throw new AppError(httpStatus.BAD_REQUEST, "Technician is not available");
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: customerId,
      serviceId: bookingData.serviceId,
      bookingDate: new Date(bookingData.bookingDate),
      address: bookingData.address,
      note: bookingData.note ?? null,
    },
  });

  return booking;
};

const getAllBookings = async (customerId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      customerId: customerId,
    },
    include: {
      service: {
        include: {
          category: true,
        },
      },
    },
  });
  return bookings;
};

const getSingleBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  return booking;
};

const cancelBookingIntoDB = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized");
  }

  if (
    booking.status === BookingStatus.IN_PROGRESS ||
    booking.status === BookingStatus.COMPLETED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Booking cannot be cancelled when status is ${booking.status}`,
    );
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking has already been cancelled",
    );
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: BookingStatus.CANCELLED,
    },
  });

  return result;
};

const getTechnicianBookings = async (technicianId: string) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: {
      userId: technicianId,
    },
  });

  if (!profile)
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");

  const bookings = await prisma.booking.findMany({
    where: {
      service: {
        technicianId: profile.id,
      },
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      service: true,
    },
  });
  return bookings;
};

const updateStatus = async (
  bookingId: string,
  status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED",
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  if (!booking) throw new AppError(httpStatus.NOT_FOUND, "Booking not found");

  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: status,
    },
  });

  return updatedBooking;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  cancelBookingIntoDB,
  getTechnicianBookings,
  updateStatus,
};
