import axios from "axios";
import ApiError from "../utils/ApiError.js";

const BASEURL =
  process.env.APP_ENV === "development"
    ? "http://localhost:3003"
    : process.env.APP_URL;
const ENDPOINT = "/ropie/clusterNewsFeed";
const timeout = 30_000;

export const triggerNewsFeedingAndClustering = async () => {
  console.log("triggered")
  try {
    const response = await axios.get(`${BASEURL}${ENDPOINT}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CRON_SECRET}`, //Optional however, when dealing with supabase Auth look up something
      },
      timeout,
    });

    return response?.status;
  } catch (error) {
    throw new ApiError(400, "Cron trigger request failed", {
      cause: error.message,
    });
  }
};
