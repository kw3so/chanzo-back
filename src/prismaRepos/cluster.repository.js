import { prisma } from "../config/db.js";

export const createCluster = async (title) => {
  return prisma.cluster.create({
    data: {
      title,
    },
  });
};

export const findActiveClustersInWindow = async ({ start, end }) => {
  return prisma.cluster.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
};

export const findArticlesInActiveWindow = async ({ start, end }) => {
  return prisma.cluster.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    include: {
      articles: true,
    },
  });
};

export const findAllClusterArticles = async () => {
  return prisma.cluster.findMany({
    include: {
      articles: true,
    },
    // orderBy: {
    //   articles: {
    //     _count: "desc",
    //   },
    // },
  });
};
