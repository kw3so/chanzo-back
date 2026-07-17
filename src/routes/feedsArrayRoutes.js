import express from "express";

import {
  fetchFeedFormatted,
  runNewsFeedingAndClustering,
} from "../controllers/feed.controller.js";
import {
  getAllClustersWithArticles,
  getThisWeekClusters,
} from "../controllers/cluster.controller.js";

const router = express.Router();

router.get("/feedContent", fetchFeedFormatted);

router.get("/clusterNewsFeed", runNewsFeedingAndClustering);

router.get("/allNewsClusters", getAllClustersWithArticles);

router.get("/thisWeeksClusters", getThisWeekClusters);

export default router;
