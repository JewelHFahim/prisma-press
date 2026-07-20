import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controllers";
import { jwtUtils } from "../../utils/jwtUtils";
import config from "../../config";
import { Role } from "../../../generated/prisma/client";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/register", userController.handleRegister);

router.get(
  "/me",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  userController.handleGetProfile,
);

router.put(
  "/my-profile",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  userController.handleUpdateMyProfile,
);

export const userRoutes = router;
