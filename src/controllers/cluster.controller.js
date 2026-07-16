import { getAllClusters } from "../services/cluster.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllClustersWithArticles = asyncHandler(async (req, res) => {
  const data = await getAllClusters();
  return res.status(200).json({ data });
});

export const getThisWeekClusters = asyncHandler(async (req, res) => {
  const data = await getThisWeekClusters();
  return res.status(200).json({ data });
});
