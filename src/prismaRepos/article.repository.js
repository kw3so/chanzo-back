import { prisma } from "../config/db.js";

export const findExistingGuids = async (guids) => {
  if (!Array.isArray(guids) || guids.length === 0) return [];

  return prisma.article.findMany({
    where: {
      guid: {
        in: guids,
      },
    },
    select: {
      guid: true,
    },
  });
};

export const createArticle = async (data) => {
  return prisma.article.create({
    data,
  });
};

export const createManyArticlesWithClusters = async (items) => {
  const createdArticles = [];

  for (const item of items) {
    const createdArticle = await createArticle(item);
    createdArticles.push(createdArticle);
  }

  return createdArticles.length;
};
