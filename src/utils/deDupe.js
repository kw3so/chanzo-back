import { prisma } from "../config/db.js";
import { findExistingGuids } from "../prismaRepos/article.repository.js";
import ApiError from "./ApiError.js";

export const deDupeArticle = async (articles) => {
  const uniqueByGuid = new Map();

  for (const article of articles) {
    if (!article.guid) continue;

    uniqueByGuid.set(article.guid, article);
  }
  const uniqueArticles = [...uniqueByGuid.values()];
  const uniqueGuids = uniqueArticles.map((article) => article.guid);

  let existingArticlesGuids;
  try {
    existingArticlesGuids = await findExistingGuids(uniqueGuids);
  } catch (e) {
    throw new ApiError(500, "Failed to findExistingGuids", {
      cause: e.message,
    });
  }

  const existingGuids = new Set(
    existingArticlesGuids.map((article) => article.guid),
  );

  return uniqueArticles.filter((article) => !existingGuids.has(article.guid));
};
