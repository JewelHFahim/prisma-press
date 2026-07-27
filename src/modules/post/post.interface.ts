import { PostsStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

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

export interface IPostQuery extends PostWhereInput {
  searchTerm?: string;
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
}
