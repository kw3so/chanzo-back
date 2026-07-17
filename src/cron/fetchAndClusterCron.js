import cron from "node-cron";
import ApiError from "../utils/ApiError.js";
import { triggerNewsFeedingAndClustering } from "../services/cron.service.js";

let cronRunning = false;

export const fetchFeedAndClusterCron = async () => {
  if (cronRunning) {
    throw new ApiError(409, "previous cron is still running ");
    return;
  }

  cronRunning = true;
  try {
    const status = await triggerNewsFeedingAndClustering();
    return status;
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
