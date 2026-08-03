import { NextFunction, Request, Response } from "express";
import { subscriptionServices } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createSubscriptionSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  const result = await subscriptionServices.createSubscriptionSession(
    userId as string,
  );

  console.log("Result", result)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Checkout completed successfully",
    data: result,
  });
};

export const subscriptionController = {
  createSubscriptionSession,
};
