import { z } from "zod";

const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.uuid(),
    rating: z.number().min(1).max(5),
    comment: z
      .string()
      .min(1, "Comment is required")
      .max(200, "Comment must be less than 200 characters"),
  }),
});

export const ReviewValidation = {
  createReviewSchema,
};
