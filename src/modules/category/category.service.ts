import { prisma } from "../../lib/prisma";
import type { ICategory } from "./category.interface";

const createCategory = async (categoryData: ICategory) => {
  const { name, description } = categoryData;
  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const result = await prisma.category.create({
    data: {
      name,
      description: description ?? null,
    },
  });
  return result;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return categories;
};

export const categoryService = {
  createCategory,
  getAllCategories,
};
