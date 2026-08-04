import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
// import AppError from "../../errors/AppError";

const createCategory = async (payload: {
  name: string;
  description?: string;
}) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (existingCategory && !existingCategory.isDeleted) {
    throw new AppError(409, "Category already exists");
  }

  // If previously deleted category exists, restore it
  if (existingCategory?.isDeleted) {
    return prisma.category.update({
      where: {
        id: existingCategory.id,
      },
      data: {
        name: payload.name,
        description: payload.description ?? null,
        isDeleted: false,
      },
    });
  }

  return prisma.category.create({
    data: payload,
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      _count: {
        select: {
          services: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleCategory = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      _count: {
        select: {
          services: true,
        },
      },
    },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return category;
};

const updateCategory = async (
  id: string,
  payload: {
    name?: string;
    description?: string;
  },
) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  if (payload.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: payload.name,
        id: {
          not: id,
        },
        isDeleted: false,
      },
    });

    if (existingCategory) {
      throw new AppError(409, "Category name already exists");
    }
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      _count: {
        select: {
          services: true,
        },
      },
    },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  // Optional protection
  if (category._count.services > 0) {
    throw new AppError(
      400,
      "Cannot delete category because it has services",
    );
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};