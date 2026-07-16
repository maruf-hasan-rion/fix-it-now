import { Router } from "express";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { Role } from "../../../generated/prisma/enums";
import { TechnicianValidation } from "./technician.validation";
import { TechnicianController } from "./technician.controller";

const router = Router();

router.get("/", TechnicianController.getAllTechnicians);
// router.get("/:id", TechnicianController.getSingleTechnician);

// technician routes
router.post(
  "/profile",
  auth(Role.TECHNICIAN),
  validateRequest(TechnicianValidation.createTechnicianSchema),
  TechnicianController.createProfile,
);
router.patch(
  "/availability",
  auth(Role.TECHNICIAN),
  validateRequest(TechnicianValidation.updateAvailabilitySchema),
  TechnicianController.updateAvailability,
);

router.patch(
  "/profile",
  auth(Role.TECHNICIAN),
  validateRequest(TechnicianValidation.updateTechnicianSchema),
  TechnicianController.updateProfile,
);

router.get("/me", auth(Role.TECHNICIAN), TechnicianController.getMyProfile);

export const technicianRoutes = router;
