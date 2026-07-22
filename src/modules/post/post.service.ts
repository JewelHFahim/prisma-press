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

const getAllPostsFromDB = async () => {
  const result = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },

      commnets: true,
    },
  });

  return result;
};

const getSinglePostFromDB = async (postId: string) => {
  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      commnets: true,
    },
  });

  return result;
};

const getMyPostFromDB = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },

      commnets: true,

      _count: {
        select: {
          commnets: true,
        },
      },
    },
  });

  return result;
};
const updatePostIntoDB = async () => {};
const deletePostFromDB = async () => {};
const getPostStatsFromDB = async () => {};

export const postService = {
  createPostIntoDB,
  getPostStatsFromDB,
  getAllPostsFromDB,
  getMyPostFromDB,
  getSinglePostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
};
