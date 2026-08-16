

import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { premiumServices } from "./premium.service";

const handletGetPremiumContent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await premiumServices.getPremiumContent();
    console.log("result", result)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Premium content retrive successfully",
      data: result,
    });
  },
);

export const premiumController = {
  handletGetPremiumContent,
};
