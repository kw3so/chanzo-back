import cron from "node-cron";
import ApiError from "../utils/ApiError.utils.js";
import { newsFeedingAndClustering } from "../services/feed.service.js";

cron.schedule("0 * * * *", () => newsFeedingAndClustering(), {
  scheduled: true,
  timezone: "Africa/Nairobi",
});
