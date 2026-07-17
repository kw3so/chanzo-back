import {
  fetchFeedItems,
  newsFeedingAndClustering,
} from "../services/feed.service.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const runNewsFeedingAndClustering = asyncHandler(async (req, res) => {
  const data = await newsFeedingAndClustering();
  return res.status(200).json({ data });
  
});

export const fetchFeedFormatted = asyncHandler(async (req, res) => {
  const data = await fetchFeedItems();
  return res.status(200).json({ data });
});
