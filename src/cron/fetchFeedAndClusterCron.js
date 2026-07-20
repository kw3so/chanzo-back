import cron from "node-cron";
import ApiError from "../utils/ApiError.utils.js";
import { newsFeedingAndClustering } from "../services/feed.service.js";

cron.schedule(
  "0 * * * *",
  async () => {
    try {
      await newsFeedingAndClustering();
    } catch (e) {
      console.error("Scheduled ingestion failed", e);
    }
  },
  {
    scheduled: true,
    timezone: "Africa/Nairobi",
  },
);
