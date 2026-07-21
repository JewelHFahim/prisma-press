import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.handleCreatePost,
);

router.get("/", postController.handleGetAllPosts);

router.get("/stats", auth(Role.ADMIN), postController.handleGetPostStats);

router.get(
  "/my-psot",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.handleGetMyPosts,
);

router.get("/:postId", postController.handleGetSignlePost);

router.patch(
  "/:postId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.handleUpdatePost,
);

router.delete(
  "/:postId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.handleDeletePost,
);

export const postRoutes = router;
