import {
  fetchFeedItems,
  newsFeedingAndClustering,
} from "../services/feed.service";
import asyncHandler from "../utils/asyncHandler";

export const runNewsFeedingAndClustering = asyncHandler(async (req, res) => {
  const data = await newsFeedingAndClustering();
  return res.status(200).json({ data });
});

const fetchFeedArrayFormatted = asyncHandler(async (req, res) => {
  const data = await fetchFeedItems();
  return res.status(200).json({ data });
});
