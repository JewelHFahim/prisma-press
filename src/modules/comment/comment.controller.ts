import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const handleCreateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const handleGetCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const handleGetCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const handleUpdateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const handleDeleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const handleModerateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const commentController = {
  handleCreateComment,
  handleGetCommentByAuthorId,
  handleGetCommentByCommentId,
  handleUpdateComment,
  handleDeleteComment,
  handleModerateComment,
};
