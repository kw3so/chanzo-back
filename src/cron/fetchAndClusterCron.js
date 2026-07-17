import cron from "node-cron";
import ApiError from "../utils/ApiError.js";
import { newsFeedingAndClustering } from "../services/feed.service.js";

let cronRunning = false;

const fetchFeedAndClusterCron = async () => {
  if (cronRunning) {
    throw new ApiError(409, "previous cron is still running ");
    return;
  }

  cronRunning = true;
  try {
    await newsFeedingAndClustering();
  } catch (e) {
    throw new ApiError(400, "Cron fetch request failed", {
      cause: e.message,
    });
  } finally {
    cronRunning = false;
  }
};

cron.schedule("0 * * * *", fetchFeedAndClusterCron, {
  scheduled: true,
  timezone: "Africa/Nairobi",
});
