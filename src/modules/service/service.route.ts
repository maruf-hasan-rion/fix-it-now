import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { ServiceValidation } from "./service.validation";
import { ServiceController } from "./service.controller";

const router = Router();

router.get("/", ServiceController.getAllServices);
router.get("/:id", ServiceController.getSingleService);

// technician routes
router.post(
  "/",
  auth(Role.TECHNICIAN),
  validateRequest(ServiceValidation.createServiceSchema),
  ServiceController.createService,
);

export const serviceRoutes = router;
