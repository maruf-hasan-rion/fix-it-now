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
  getTechnicianBookings,
  updateStatus,
};
