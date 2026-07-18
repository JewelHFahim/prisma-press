import { NextFunction, Request, RequestHandler, Response } from "express";
import { userServices } from "./user.services";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const handleRegister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userServices.storeUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registraiont success!",
      data: { user },
    });
  },
);

const handleGetProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const profile = await userServices.getMyProfileFromDB(
      req.user?.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile fetched successfully",
      data: { profile },
    });
  },
);

export const userController = {
  handleRegister,
  handleGetProfile,
};
