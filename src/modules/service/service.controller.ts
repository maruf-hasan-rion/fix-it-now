import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { serviceService } from "./service.service";

const createService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.user?.id;

    const result = await serviceService.createService(
      req.body,
      technicianId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Service created successfully",
      data: result,
    });
  },
);

const getAllServices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await serviceService.getAllServices(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Services retrieved successfully",
      data: result,
    });
  },
);

const getSingleService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceId = req.params.id;

    if (!serviceId) {
      throw new Error("Service Id Required In Params");
    }
    const result = await serviceService.getSingleService(serviceId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service retrieved successfully",
      data: result,
    });
  },
);

export const ServiceController = {
  createService,
  getAllServices,
  getSingleService,
};
