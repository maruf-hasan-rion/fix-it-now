import { z } from "zod";

const createBookingSchema = z.object({
  body: z.object({
    serviceId: z.uuid(),
    bookingDate: z.coerce.date(),
    timeSlot: z.string().min(1, "Time slot is required"),
    address: z.string().min(5, "Address is required"),
    note: z.string().optional(),
    technicianId: z.uuid().optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "ACCEPTED",
      "DECLINED",
      "IN_PROGRESS",
      "COMPLETED",
    ]),
  }),
});

export const BookingValidation = {
  createBookingSchema,
  updateStatusSchema,
};