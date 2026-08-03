import { UserStatus } from "../../../generated/prisma/enums";
import { z } from "zod";

const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum(UserStatus),
  }),
});

export const AdminValidation = {
  updateUserStatusSchema,
};