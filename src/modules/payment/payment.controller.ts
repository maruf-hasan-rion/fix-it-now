import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import httpStatus from "http-status";

const createPaymentIntent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await PaymentService.createPaymentIntentIntoDB(
      req.body.bookingId,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment intent created successfully",
      data: result,
    });
  },
);

const webhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log("Webhook hit");
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    await PaymentService.handleWebhook(event, signature);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Webhook triggered successfully",
      data: null,
    });
  },
);

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await PaymentService.getMyPayments(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result,
    });
  },
);
export const PaymentController = {
  createPaymentIntent,
  //   paymentSuccess,
  getMyPayments,
  webhook,
};
