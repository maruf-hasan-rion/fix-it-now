import { z } from "zod";

const createServiceSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.number().positive(),
    categoryId: z.uuid(),
  }),
});

export const ServiceValidation = {
  createServiceSchema,
};
