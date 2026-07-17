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

export const userController = {
  handleRegister,
};
