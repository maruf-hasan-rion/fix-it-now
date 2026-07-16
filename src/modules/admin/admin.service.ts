import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";

const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      technicianProfile: true,
    },
  });
};

const updateUserStatus = async (userId: string, isBlocked: boolean) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isBlocked,
    },
  });
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

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
};
