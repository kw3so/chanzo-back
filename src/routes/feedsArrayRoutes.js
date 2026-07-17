import express from "express";
import { parseFeed } from "../utils/getFeedArray.js";
import { getFeedInArray } from "../controllers/getFeedInArrayController.js";
import { feedandCluster } from "../controllers/feedAndClusterController.js";
import {
  allClustered,
  getWeeksClusters,
} from "../controllers/allClusteredController.js";
import { cronAuth } from "../middleware/auth.js";
import {
  fetchFeedFormatted,
  runNewsFeedingAndClustering,
} from "../controllers/feed.controller.js";
import {
  getAllClustersWithArticles,
  getThisWeekClusters,
} from "../controllers/cluster.controller.js";
// import { fetchFeedAndClusterCron } from "../cron/fetchAndClusterCron.js";

const router = express.Router();

// router.get("/feedInArray", getFeedInArray);
router.get("/feedContent", fetchFeedFormatted);

// router.get("/feedAndCluster", feedandCluster);
router.get("/clusterNewsFeed", runNewsFeedingAndClustering);

// router.get("/cronFetchFeedAndCluster", cronAuth, fetchFeedAndClusterCron);

// router.get("/trigger", cronAuth, triggerNewsFeedingAndClustering);

// router.get("/allClustered", allClustered);
router.get("/allNewsClusters", getAllClustersWithArticles);

// router.get("/weeksClusters", getWeeksClusters);
router.get("/thisWeeksClusters", getThisWeekClusters);

export default router;
