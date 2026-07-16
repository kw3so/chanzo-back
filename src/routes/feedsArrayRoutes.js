import express from "express";
import { parseFeed } from "../utils/getFeedArray.js";
import { getFeedInArray } from "../controllers/getFeedInArrayController.js";
import { feedandCluster } from "../controllers/feedAndClusterController.js";
import {
  allClustered,
  getWeeksClusters,
} from "../controllers/allClusteredController.js";
import { cronAuth } from "../middleware/auth.js";
import { fetchFeedFormatted } from "../controllers/feed.controller.js";

const router = express.Router();

router.get("/feedInArray", getFeedInArray);
router.get("/feedContent", fetchFeedFormatted)

router.get("/feedAndCluster", feedandCluster);

router.get("/cronFeedAndCluster", cronAuth, feedandCluster);

router.get("/allClustered", allClustered);

router.get("/weeksClusters", getWeeksClusters);

export default router;
