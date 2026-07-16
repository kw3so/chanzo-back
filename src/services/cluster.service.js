import {
  createCluster,
  findActiveClustersInWindow,
  findAllClusterArticles,
  findArticlesInActiveWindow,
} from "../prismaRepos/cluster.repository.js";
import { getActiveClusterWindow } from "../utils/activeClusterWindow.js";

import ApiError from "../utils/ApiError";
import { similarityScore } from "../utils/similarityScore.js";

// const toClusterView = (cluster) => ({
//   title: cluster.title,
//   id: cluster.id,
//   createdAt: cluster.createdAt,
//   updatedAt: cluster.updatedAt,
//   articleCount: cluster.articles.length,
//   articles: cluster.articles,
// });

const { start, end } = getActiveClusterWindow();

export const getAllClusters = async () => {
  try {
    const clusters = await findAllClusterArticles();
    return clusters;
  } catch (e) {
    throw new ApiError(500, "Failed to get all clusters", {
      cause: e.message,
    });
  }
};

export const getThisWeeksCluster = async () => {
  console.log(`Cluster duration: ${start} - ${end}`);

  try {
    const weeksCluster = await findArticlesInActiveWindow(start, end);
    return weeksCluster;
  } catch (e) {
    throw new ApiError(500, "Failed to get this week's clusters", {
      cause: e.message,
    });
  }
};

export const assignArticleToCluster = async (articleTitle) => {
  const DICE_THRESHOLD = Number(process.env.DICE_THRESHOLD ?? 0.2);

  let activeClusters;
  try {
    activeClusters = await findActiveClustersInWindow(start, end);
  } catch (e) {
    throw new ApiError(500, "Failed to findActiveClustersInWindow", {
      cause: e.message,
    });
  }

  let bestMatch = null;
  let comparisonScore = 0;

  for (const cluster of activeClusters) {
    const comparison = similarityScore(articleTitle, cluster.title);
    if (comparison > comparisonScore) {
      bestMatch = cluster;
      comparisonScore = comparison;
    }
  }

  if (comparisonScore >= DICE_THRESHOLD && bestMatch) {
    return bestMatch.id;
  }

  try {
    const newCluster = await createCluster(articleTitle);
    return newCluster.id;
  } catch (e) {
    throw new ApiError(500, "Failed to createCluster", {
      cause: e.message,
    });
  }
};
