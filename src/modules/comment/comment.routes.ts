import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import auth from "../../middlewares/auth";
import { commentController } from "./comment.controller";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.handleCreateComment,
);

router.get("/author/:authorId", commentController.handleGetCommentByAuthorId);

router.get("/:commentId", commentController.handleGetCommentByCommentId);

router.put(
  "/:commentId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.handleUpdateComment,
);

router.delete(
  "/:commentId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.handleDeleteComment,
);

router.patch(
  "/:commentId/moderate",
  auth(Role.ADMIN),
  commentController.handleModerateComment,
);

export const commentRoutes = router;
