import { Router } from "express";
import { authController } from "./auth.controller";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

router.post("/refresh-token", authController.refreshToken);

router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),

  authController.getMyProfile,
);

export const authRoutes = router;
