import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { BookingController } from "./booking.controller";
import { BookingValidation } from "./booking.validation";

const router = Router();

// customer only route
router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(BookingValidation.createBookingSchema),
  BookingController.createBooking,
);

router.get(
  "/my-bookings",
  auth(Role.CUSTOMER),
  BookingController.getMyBookings,
);

router.patch(
  "/:id/cancel",
  auth(Role.CUSTOMER),
  BookingController.cancelBooking,
);

// technician only route
router.get(
  "/technician",
  auth(Role.TECHNICIAN),
  BookingController.getTechnicianBookings,
);

router.patch(
  "/:id/status",
  auth(Role.TECHNICIAN),
  validateRequest(BookingValidation.updateStatusSchema),
  BookingController.updateStatus,
);

// admin, customer, and technician route
router.get(
  "/:id",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  BookingController.getSingleBooking,
);
export const bookingRoutes = router;
