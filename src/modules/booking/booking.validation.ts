import { z } from "zod";

const createBookingSchema = z.object({
  body: z.object({
    serviceId: z.uuid(),
    bookingDate: z.coerce.date(),
    address: z.string().min(5),
    note: z.string().optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["ACCEPTED", "DECLINED", "IN_PROGRESS", "COMPLETED"]),
  }),
});

export const BookingValidation = {
  createBookingSchema,
  updateStatusSchema,
};
