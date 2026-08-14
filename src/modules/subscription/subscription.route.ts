import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();

router.post(
  "/checkout",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  subscriptionController.createSubscriptionSession,
);

router.post("/webhook", subscriptionController.handleWebhook);

router.get(
  "/status",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  subscriptionController.handleGetSubscriptionStatus,
);

export const subscriptionRoutes = router;
