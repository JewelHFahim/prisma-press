import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IPostQuery } from "../post/post.interface";

const getPremiumContent = async (query: IPostQuery) => {
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
    isPremium: true,
  });

  const posts = await prisma.post.findMany({
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
    data: posts,

    meta: {
      page: page,
      limit: limit,
      total: totalPostCount,
      totalPage: Math.ceil(totalPostCount / limit),
    },
  };
};

export const premiumServices = {
  getPremiumContent,
};
