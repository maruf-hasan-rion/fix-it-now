import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ReviewService } from "./review.service";
import httpStatus from "http-status";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await ReviewService.createReviewIntoDB(
      req.body,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review submitted successfully",
      data: result,
    });
  },
);

const getServiceReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ReviewService.getServiceReviewsFromDB(
      req.params.serviceId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service reviews retrieved successfully",
      data: result,
    });
  },
);

const getMyReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await ReviewService.getMyReviewsFromDB(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My reviews retrieved successfully",
      data: result,
    });
  },
);

export const ReviewController = {
  createReview,
  getServiceReviews,
  getMyReviews,
};
