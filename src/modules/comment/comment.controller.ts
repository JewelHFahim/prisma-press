import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const handleCreateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const payload = req.body;

    const result = await commentService.createCommentIntoDB(
      authorId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created successfully",
      data: result,
    });
  },
);

const handleGetCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;

    const result = await commentService.getCommentByAuthorIdFromDB(
      authorId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Retrie author comments",
      data: result,
    });
  },
);

const handleGetCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;

    const result = await commentService.getCommentByCommentIdFromDB(
      commentId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment retrive successfully",
      data: result,
    });
  },
);

const handleUpdateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const authorId = req.user?.id as string;

    const result = await commentService.updateCommentIntoDB(
      commentId,
      authorId,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment updated successfully.",
      data: result,
    });
  },
);

const handleDeleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const authorId = req.user?.id as string;

    await commentService.deleteCommentFromDB(commentId, authorId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment deleted successfully.",
      data: null,
    });
  },
);

const handleModerateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;

    const result = await commentService.moderateCommentIntoDB(
      commentId,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment status updated successfully.",
      data: result,
    });
  },
);

export const commentController = {
  handleCreateComment,
  handleGetCommentByAuthorId,
  handleGetCommentByCommentId,
  handleUpdateComment,
  handleDeleteComment,
  handleModerateComment,
};
