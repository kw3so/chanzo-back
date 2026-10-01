import {
  createCluster,
  findActiveClustersInWindow,
  findAllClusterArticles,
  findArticlesInActiveWindow,
} from "../repository/cluster.repository.js";

import { getActiveWeekWindow } from "../utils/activeWeekWindow.utils.js";
import { similarityScore } from "../utils/similarityScore.utils.js";

import ApiError from "../utils/ApiError.utils.js";

export const getAllClusters = async () => {
  try {
    const clusters = await findAllClusterArticles();
    return { clustersCount: clusters.length, clusters };
  } catch (e) {
    throw new ApiError(500, "Failed to get all clusters", {
      cause: e.message,
    });
  }
};

export const getWeeksClusters = async () => {
  const { start, end } = getActiveWeekWindow();
  console.log(`Cluster duration: ${start} - ${end}`);

  try {
    const clusters = await findArticlesInActiveWindow(start, end);
    return { clustersCount: clusters.length, clusters };
  } catch (e) {
    throw new ApiError(500, "Failed to get this week's clusters", {
      cause: e.message,
    });
  }
};

export const assignArticleToCluster = async (articleTitle) => {
  const { start, end } = getActiveWeekWindow();
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
