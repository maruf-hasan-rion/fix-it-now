import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { technicianService } from "./technician.service";

const createProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const technician = await technicianService.createProfileIntoDB(
      payload,
      userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Technician profile created successfully",
      data: { technician },
    });
  },
);
const getAvailability = catchAsync(async (req, res) => {
     const userId = req.user?.id as string;
  const result = await technicianService.getAvailabilityFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Availability retrieved successfully",
    data: result,
  });
});

const updateAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const result = await technicianService.updateAvailabilityIntoDB(
      userId,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Availability updated successfully",
      data: result,
    });
  },
);

const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const technician = await technicianService.updateProfileIntoDB(
      payload,
      userId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Technician profile updated successfully",
      data:  technician,
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const profile = await technicianService.getMyProfileFromDB(
      req.user?.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile fetched successfully",
      data: profile ,
    });
  },
);
const getAllTechnicians = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await technicianService.getAllTechnicians();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technicians retrieved successfully",
      data: result,
    });
  },
);
const getTechnicianOverview = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const result = await technicianService.getTechnicianOverviewIntoDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician overview retrieved successfully",
    data: result,
  });
});
export const TechnicianController = {
  createProfile,
  getAvailability,
  updateAvailability,
  updateProfile,
  getMyProfile,
  getAllTechnicians,
  getTechnicianOverview
};
