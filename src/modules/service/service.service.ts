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

const getAllServices = async (query: Record<string, any>) => {
  const {
    searchTerm,
    categoryId,
    location,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    page = 1,
    limit = 10,
  } = query;

  const whereCondition: any = {};

  if (searchTerm) {
    whereCondition.title = {
      contains: searchTerm,
      mode: "insensitive",
    };
  }

  if (categoryId) {
    whereCondition.categoryId = categoryId;
  }

  if (location) {
    whereCondition.technician = {
      location: {
        contains: location,
        mode: "insensitive",
      },
    };
  }

  if (minPrice || maxPrice) {
    whereCondition.price = {};
    if (minPrice) {
      whereCondition.price.gte = Number(minPrice);
    }
    if (maxPrice) {
      whereCondition.price.lte = Number(maxPrice);
    }
  }

  const services = await prisma.service.findMany({
    where: whereCondition,

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
    orderBy: sortBy
      ? {
          [sortBy]: sortOrder || "asc",
        }
      : {
          createdAt: "desc",
        },

    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  const total = await prisma.service.count({
    where: whereCondition,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },

    data: services,
  };
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
