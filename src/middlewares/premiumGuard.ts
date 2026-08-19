import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../lib/prisma";
import { SubscriptionStatus } from "../../generated/prisma/client";

export const subscriptionGuard = ()=>{
    return  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const subscribe = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscribe) {
      throw new Error("Please, subscribe to get acceess of Premium Contents");
    }

    if (subscribe.status !== SubscriptionStatus.ACTIVE) {
      throw new Error(
        "Please, subscribe again to get acceess of Premium Contents",
      );
    }

    next();
  })
}