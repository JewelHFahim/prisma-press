import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const handleCreatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;

    const payload = req.body;

    const result = await postService.createPostIntoDB(payload, id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully",
      data: {
        result,
      },
    });
  },
);

const handleGetPostStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const handleGetAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const handleGetMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const handleGetSignlePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const handleUpdatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const handleDeletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const postController = {
  handleCreatePost,
  handleGetPostStats,
  handleGetAllPosts,
  handleGetMyPosts,
  handleGetSignlePost,
  handleUpdatePost,
  handleDeletePost,
};
