import { prisma } from "../config/db.js";
import { getActiveClusterWindow } from "./activeClusterWindow.js";
import { similarityScore } from "../utils/similarityScore.js";

const getActiveClusters = () => {
  const { start, end } = getActiveClusterWindow();
  console.log(`cluster duration: ${start} - ${end}`);

  return prisma.cluster.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
};

export const assignCluster = async (articleTitle) => {
  const DICE_THRESHOLD = Number(process.env.DICE_THRESHOLD ?? 0.2);
  const activeClusters = await getActiveClusters();

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

  const newCluster = await prisma.cluster.create({
    data: {
      title: articleTitle,
    },
  });

  return newCluster.id;
};

