import { CommentStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePayload } from "./post.interface";

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
  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  // throw new Error("Fake error");

  const result = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      commnets: {
        where: {
          status: CommentStatus.APPROVED,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          commnets: true,
        },
      },
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

const updatePostIntoDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
  payload: IUpdatePayload,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post!");
  }

  const result = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: payload,

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

const deletePostFromDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post!");
  }

  await prisma.post.delete({
    where: {
      id: post.id,
    },
  });
};

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
