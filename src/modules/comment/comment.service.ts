import { prisma } from "../../lib/prisma";
import {
  ICommentModeratePayload,
  ICommentUpdatePayload,
  ICreateCommentPayload,
} from "./comment.interface";

const createCommentIntoDB = async (
  authorId: string,
  payload: ICreateCommentPayload,
) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  const result = await prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
  });

  return result;
};

const getCommentByAuthorIdFromDB = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return result;
};

const getCommentByCommentIdFromDB = async (postId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      postId,
    },
  });

  return result;
};

const updateCommentIntoDB = async (
  commentId: string,
  authorId: string,
  payload: ICommentUpdatePayload,
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
    select: {
      id: true,
    },
  });

  if (!comment) {
    throw new Error("Your provided data not valid");
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data: payload,
  });

  return result;
};

const deleteCommentFromDB = async (commentId: string, authorId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId, authorId },
    select: {
      id: true,
    },
  });

  if (!comment) {
    throw new Error("Your provided data not valid");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  // return result;
};

const moderateCommentIntoDB = async (
  commentId: string,
  payload: ICommentModeratePayload,
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
    select: {
      id: true,
      status: true,
    },
  });

  if (comment.status === payload.status) {
    throw new Error(`YOur provide status ${payload.status} already up to date`);
  }

  const result = await prisma.comment.update({
    where: { id: commentId },
    data: payload,
  });

  return result;
};

export const commentService = {
  createCommentIntoDB,
  getCommentByAuthorIdFromDB,
  getCommentByCommentIdFromDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
  moderateCommentIntoDB,
};
