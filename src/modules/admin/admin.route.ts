import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/users", auth(Role.ADMIN), AdminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), AdminController.updateUserStatus);
router.get("/bookings", auth(Role.ADMIN), AdminController.getAllBookings);

export const adminRoutes = router;
