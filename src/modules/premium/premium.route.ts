import { NextFunction, Request, Response, Router } from "express";
import { premiumController } from "./premium.controller";
import auth from "../../middlewares/auth";
import { Role, SubscriptionStatus } from "../../../generated/prisma/client";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { subscriptionGuard } from "../../middlewares/premiumGuard";

const router = Router();

router.get(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  subscriptionGuard(),
  premiumController.handletGetPremiumContent,
);

export const premiumRoutes = router;
