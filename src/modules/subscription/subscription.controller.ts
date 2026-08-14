import { NextFunction, Request, Response } from "express";
import { subscriptionServices } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";

const createSubscriptionSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await subscriptionServices.createSubscriptionSession(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Checkout completed successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as Buffer;
    const signature = req.headers["stripe-signature"];

    await subscriptionServices.webhook(payload, signature as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Webhook triggured successfully",
      data: null,
    });
  },
);

const handleGetSubscriptionStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await subscriptionServices.getSubscriptionStatus(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Subscription status retrive successfully",
      data: result,
    });
  },
);

export const subscriptionController = {
  createSubscriptionSession,
  handleWebhook,
  handleGetSubscriptionStatus
};
