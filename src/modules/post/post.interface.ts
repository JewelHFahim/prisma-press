import { PostsStatus } from "../../../generated/prisma/enums";

export interface ICreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured: boolean;
  status: PostsStatus;
  tag: string[];
}

export interface IUpdatePayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostsStatus;
  tag?: string[];
}
