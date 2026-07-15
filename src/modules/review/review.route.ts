import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const router = Router();

router.get("/service/:serviceId", ReviewController.getServiceReviews);

// Customer only route
router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.createReview,
);

router.get("/my-reviews", auth(Role.CUSTOMER), ReviewController.getMyReviews);

export const reviewRoutes = router;
