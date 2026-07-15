import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { PaymentValidation } from "./payment.validation";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create-payment-intent",
  auth(Role.CUSTOMER),
  validateRequest(PaymentValidation.createPaymentSchema),
  PaymentController.createPaymentIntent,
);
router.post(
  "/webhook",
  // express.raw({
  //   type: "application/json",
  // }),
  PaymentController.webhook,
);
// router.patch(
//   "/success/:id",
//   auth(Role.CUSTOMER),
//   PaymentController.paymentSuccess,
// );

router.get(
  "/my-payments",
  auth(Role.CUSTOMER),
  PaymentController.getMyPayments,
);

export const paymentRoutes = router;
