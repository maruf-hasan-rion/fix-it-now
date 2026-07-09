import { prisma } from "../../lib/prisma";
import type {
  ITechnicianProfile,
  IUpdateTechnicianProfile,
} from "./technician.interface";

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
const updateProfileIntoDB = async (
  payload: IUpdateTechnicianProfile,
  userId: string,
) => {
  const technician = await prisma.technicianProfile.update({
    where: {
      userId,
    },
    data: payload,
  });
  return technician;
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

export const technicianService = {
  createProfileIntoDB,
  updateProfileIntoDB,
  getMyProfileFromDB,
  getAllTechnicians,
};
