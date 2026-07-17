import {
  getAllClusters,
  getWeeksClusters,
} from "../services/cluster.service.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const getAllClustersWithArticles = asyncHandler(async (req, res) => {
  const data = await getAllClusters();
  return res.status(200).json({ data });
});

export const getThisWeekClusters = asyncHandler(async (req, res) => {
  const data = await getWeeksClusters();
  return res.status(200).json({ data });
});
