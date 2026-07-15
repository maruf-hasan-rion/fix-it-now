import { z } from "zod";

const createPaymentSchema = z.object({
  body: z.object({
    bookingId: z.uuid(),
  }),
});

export const PaymentValidation = {
  createPaymentSchema,
};
