import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidation } from "./admin.validation";

const router = Router();

router.get("/users", auth(Role.ADMIN), AdminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), AdminController.updateUserStatus);
router.get("/bookings", auth(Role.ADMIN), AdminController.getAllBookings);
router.get("/stats", auth(Role.ADMIN), AdminController.getDashboardStats);
router.patch(
  "/users/:userId/status",
  auth(Role.ADMIN),
  validateRequest(AdminValidation.updateUserStatusSchema),
  AdminController.updateUserStatus,
);

export const adminRoutes = router;
