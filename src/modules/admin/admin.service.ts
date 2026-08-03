import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { BookingStatus, PaymentStatus, UserStatus } from "../../../generated/prisma/enums";

const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      technicianProfile: true,
    },
  });
};

const updateUserStatusIntoDB = async (
  userId: string,
  status: UserStatus,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      service: {
        select: {
          title: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getDashboardStatsFromDB = async () => {
  const [
    totalUsers,
    totalCustomers,
    totalTechnicians,
    totalServices,
    totalBookings,
    totalCategories,
    totalReviews,
    pendingBookings,
    completedBookings,
    totalRevenue,
    pendingPayments,
    completedPayments,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    prisma.user.count({
      where: {
        role: "TECHNICIAN",
      },
    }),

    prisma.service.count(),

    prisma.booking.count(),

    prisma.category.count(),

    prisma.review.count(),

    prisma.booking.count({
      where: {
        status: BookingStatus.REQUESTED,
      },
    }),

    prisma.booking.count({
      where: {
        status: BookingStatus.COMPLETED,
      },
    }),

    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: PaymentStatus.SUCCESS,
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus.PENDING,
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus.SUCCESS,
      },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      customers: totalCustomers,
      technicians: totalTechnicians,
    },

    services: totalServices,

    categories: totalCategories,

    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      completed: completedBookings,
    },

    payments: {
      pending: pendingPayments,
      completed: completedPayments,
      totalRevenue: totalRevenue._sum.amount ?? 0,
    },

    reviews: totalReviews,
  };
};

export const AdminService = {
  getAllUsers,
  updateUserStatusIntoDB,
  getAllBookings,
  getDashboardStatsFromDB,
};
