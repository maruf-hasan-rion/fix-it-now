import { z } from "zod";

const createTechnicianSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
    experience: z.number().min(0),
    hourlyRate: z.number().positive(),
    location: z.string(),
  }),
});

const updateTechnicianSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
    experience: z.number().min(0),
    hourlyRate: z.number().positive(),
    location: z.string(),
  }),
});

export const TechnicianValidation = {
  createTechnicianSchema,
  updateTechnicianSchema,
};
