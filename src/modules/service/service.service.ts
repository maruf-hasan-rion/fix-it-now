import { prisma } from "../../lib/prisma";
import type { IService } from "./service.interface";

const createService = async (serviceData: IService, technicianId: string) => {
  const profile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId: technicianId,
    },
  });
  const category = await prisma.category.findUnique({
    where: {
      id: serviceData.categoryId,
    },
  });

  const service = await prisma.service.create({
    data: {
      title: serviceData.title,
      description: serviceData.description,
      price: serviceData.price,
      categoryId: serviceData.categoryId,
      technicianId: profile?.id as string,
    },
  });

  return service;
};

const getAllServices = async () => {
  const services = await prisma.service.findMany({
    include: {
      category: true,

      technician: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return services;
};

const getSingleService = async (serviceId: string) => {
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      category: true,

      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return service;
};

export const serviceService = {
  createService,
  getAllServices,
  getSingleService,
};
