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

const handleUpdateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id as string;

    console.log("user: ", req.user);

    console.log("id: ", id);

    const payload = req.body;

    const updatedUser = await userServices.updateMyProfileInDB(id, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile updated successfully",
      data: {
        updatedUser,
      },
    });
  },
);

export const userController = {
  handleRegister,
  handleGetProfile,
  handleUpdateMyProfile,
};
