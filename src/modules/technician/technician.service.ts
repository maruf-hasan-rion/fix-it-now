import { prisma } from "../../lib/prisma";
import type {
  ITechnicianProfile,
  IUpdateAvailability,
  IUpdateTechnicianProfile,
} from "./technician.interface";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";

const createProfileIntoDB = async (
  payload: ITechnicianProfile,
  userId: string,
) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (profile) {
    throw new Error("Profile already exists");
  }

  const technician = await prisma.technicianProfile.create({
    data: {
      ...payload,
      userId,
    },
  });
  return technician;
};
const getAvailabilityFromDB = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
    select: {
      isAvailable: true,
      availability: true,
    },
  });

  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }

  return technician;
};

const updateAvailabilityIntoDB = async (
  userId: string,
  payload: IUpdateAvailability,
) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technicianProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }

  const result = await prisma.technicianProfile.update({
    where: {
      userId,
    },
    data: {
      availability: payload.availability,
      ...(payload.isAvailable !== undefined && {
        isAvailable: payload.isAvailable,
      }),
    },
  });

  return result;
};

const updateProfileIntoDB = async (
  payload: IUpdateTechnicianProfile,
  userId: string
) => {
  const {
    user: { name, phone },
    bio,
    experience,
    hourlyRate,
    location,
  } = payload;

  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
      },
    });

    const technician = await tx.technicianProfile.update({
      where: { userId },
      data: {
        ...(bio !== undefined && { bio }),
        ...(experience !== undefined && { experience }),
        ...(hourlyRate !== undefined && { hourlyRate }),
        ...(location !== undefined && { location }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return technician;
  });
};
const getMyProfileFromDB = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return profile;
};

const getAllTechnicians = async () => {
  const technicians = await prisma.technicianProfile.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return technicians;
};
const getTechnicianOverviewIntoDB = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      service: {
        technicianId: technician.id,
      },
    },
    include: {
      payment: true,
      service: true,
    },
  });

  const pendingRequestsCount = bookings.filter(
    (b) => b.status === "REQUESTED"
  ).length;

  const upcomingJobsCount = bookings.filter((b) =>
    ["ACCEPTED", "PAID", "IN_PROGRESS"].includes(b.status)
  ).length;

  const completedJobsCount = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;

  const totalEarnings = bookings
    .filter((b) => ["PAID", "COMPLETED"].includes(b.status))
    .reduce((sum, booking) => {
      return sum + Number(booking.service.price);
    }, 0);

  return {
    totalEarnings,
    pendingRequestsCount,
    upcomingJobsCount,
    completedJobsCount,
  };
};

export const technicianService = {
  createProfileIntoDB,
  getAvailabilityFromDB,
  updateAvailabilityIntoDB,
  updateProfileIntoDB,
  getMyProfileFromDB,
  getAllTechnicians,
  getTechnicianOverviewIntoDB,
};
