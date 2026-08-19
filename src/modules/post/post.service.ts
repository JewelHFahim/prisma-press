import { CommentStatus, PostsStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatePayload,
} from "./post.interface";

const createPostIntoDB = async (
  payload: ICreatePostPayload,
  userId: string,
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    },
  });

  if (payload.isPremium && user.subscription?.status !== "ACTIVE") {
    throw new Error(
      "You cant create a Premium content. You are not a Premium Member!",
    );
  }

  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPostsFromDB = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 2;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const tags =
    typeof query.tags === "string" ? JSON.parse(query.tags) : query.tags;

  const andConditions: PostWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andConditions.push({ title: query.title });
  }

  if (query.content) {
    andConditions.push({ content: query.content });
  }

  if (query.authorId) {
    andConditions.push({
      authorId: query.authorId,
    });
  }

  if (query.isFeatured) {
    andConditions.push({
      isFeatured: Boolean(query.isFeatured),
    });
  }

  if (Array.isArray(tags) && tags.length) {
    andConditions.push({
      tags: {
        hasSome: tags,
      },
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }

  andConditions.push({
    isPremium: false,
  });

  const result = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip: skip,

    //sorting
    orderBy: {
      [sortBy]: sortOrder,
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

  const totalPostCount = await prisma.post.count({
    where: { AND: andConditions },
  });

  return {
    data: result,
    meta: {
      page: page,
      limit: limit,
      total: totalPostCount,
      totalPage: Math.ceil(totalPostCount / limit),
    },
  };
};

const getSinglePostFromDB = async (postId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
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

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
        isPremium: false,
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

    return post;
  });

  return transactionResult;
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

const getPostStatsFromDB = async () => {
  const trasactionResult = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalResectComments,
      totalViewsAgg,
    ] = await Promise.all([
      await tx.post.count(),

      await tx.post.count({
        where: {
          status: PostsStatus.PUBLISHED,
        },
      }),

      await tx.post.count({
        where: {
          status: PostsStatus.DARFT,
        },
      }),

      await tx.post.count({
        where: {
          status: PostsStatus.ARCHIVE,
        },
      }),

      await tx.comment.count(),

      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),

      await tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),

      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalResectComments,
      totalPostViews: totalViewsAgg._sum.views,
    };
  });

  return trasactionResult;
};

export const postService = {
  createPostIntoDB,
  getPostStatsFromDB,
  getAllPostsFromDB,
  getMyPostFromDB,
  getSinglePostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
};
