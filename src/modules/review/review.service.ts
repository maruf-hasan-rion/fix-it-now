import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import type { IReview } from "./review.interface";

const createReviewIntoDB = async (payload: IReview, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: payload.bookingId,
    },
    include: {
      service: true,
    },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.customerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized");
  }

  if (booking.status !== BookingStatus.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only completed bookings can be reviewed",
    );
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId: payload.bookingId,
    },
  });

  if (existingReview) {
    throw new AppError(httpStatus.BAD_REQUEST, "Review already submitted");
  }

  return prisma.review.create({
    data: {
      bookingId: payload.bookingId,
      customerId: userId,
      technicianId: booking.service.technicianId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });
};

const getServiceReviewsFromDB = async (serviceId: string) => {
  return prisma.review.findMany({
    where: {
      booking: {
        serviceId,
      },
    },

    include: {
      customer: {
        select: {
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getMyReviewsFromDB = async (userId: string) => {
  return prisma.review.findMany({
    where: {
      customerId: userId,
    },

    include: {
      booking: {
        include: {
          service: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const ReviewService = {
  createReviewIntoDB,
  getServiceReviewsFromDB,
  getMyReviewsFromDB,
};
