import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    role: z.enum(["CUSTOMER", "TECHNICIAN"]),
  }),
});

export const authValidation = {
  createUserSchema,
};
