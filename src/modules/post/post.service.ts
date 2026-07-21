import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPostIntoDB = async (
  payload: ICreatePostPayload,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getPostStatsFromDB = async () => {};
const getAllPostsFromDB = async () => {};
const getMyPostFromDB = async () => {};
const getSinglePostFromDB = async () => {};
const updatePostIntoDB = async () => {};
const deletePostFromDB = async () => {};

export const postService = {
  createPostIntoDB,
  getPostStatsFromDB,
  getAllPostsFromDB,
  getMyPostFromDB,
  getSinglePostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
};
