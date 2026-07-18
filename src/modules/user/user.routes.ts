import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controllers";
import { jwtUtils } from "../../utils/jwtUtils";
import config from "../../config";
import { Role } from "../../../generated/prisma/client";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

const router = Router();

router.post("/register", userController.handleRegister);

router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );

    if (typeof verifiedToken === "string") {
      throw new Error(verifiedToken);
    }

    const { id, name, email, role } = verifiedToken;

    const requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER];

    if (!requiredRoles.includes(role)) {
      return res.send({
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "Forbidden! You don't have permisson to access this resource",
      });
    }

    req.user = {
      id,
      name,
      email,
      role,
    };

    next();
  },
  userController.handleGetProfile,
);

export const userRoutes = router;
