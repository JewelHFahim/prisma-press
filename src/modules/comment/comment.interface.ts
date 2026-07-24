import { CommentStatus } from "../../../generated/prisma/client";

export interface ICreateCommentPayload {
  authorId: string;
  postId: string;
  content: string;
}

export interface ICommentUpdatePayload {
  content?: string;
  status?: CommentStatus;
}

export interface ICommentModeratePayload {
  status?: CommentStatus;
}
