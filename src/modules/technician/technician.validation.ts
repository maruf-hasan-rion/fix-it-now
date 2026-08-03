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
    user: z
      .object({
        name: z.string().min(1).optional(),
        phone: z.string().optional(),
      })
      .optional(),

    bio: z.string().optional(),
    experience: z.number().min(0).optional(),
    hourlyRate: z.number().positive().optional(),
    location: z.string().optional(),
  }),
});

const updateAvailabilitySchema = z.object({
  body: z.object({
    availability: z.string().min(1),
    isAvailable: z.boolean().optional(),
  }),
});

export const TechnicianValidation = {
  createTechnicianSchema,
  updateTechnicianSchema,
  updateAvailabilitySchema,
};
