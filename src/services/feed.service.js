// getRawFeeds
//getFeedInArray-Show it is alive
//runFeedingandClustering

import {
  createArticle,
  createManyArticlesWithClusters,
} from "../prismaRepos/article.repository";
import ApiError from "../utils/ApiError";
import { deDupeArticle } from "../utils/deDupe";
import { parseFeed } from "../utils/getFeedArray";
import { assignArticleToCluster } from "./cluster.service";
import { createFetchRecord } from "../prismaRepos/fetchedFeed.repository";

const getRawFeedsUrls = () => {
  const urls = process.env.RAW_FEEDS?.split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  if (!urls || urls.length === 0) {
    throw new ApiError(400, "now RAW_FEEDS urls provided");
  }

  return urls;
};

export const fetchAllFeedItems = async () => {
  const urls = getRawFeedsUrls();

  const feedResults = await Promise.allSettled(
    urls.map((url) => parseFeed(url)), //Map returns an array
  );
  const successItems = feedResults
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value);

  const failedItemsCount = feedResults.filter(
    (result) => result.status === "rejected",
  ).length;

  if (successItems.length === 0) {
    throw new ApiError(
      502,
      "No items could be fetched from any configured feed",
      {
        feedsAttempted: urls.length,
      },
    );
  }

  return {
    itemsCount: successItems.length,
    items: successItems,
    failedFeedContent: failedItemsCount,
  };
};

export const runNewsFeedingAndClustering = async () => {
  const { items, failedFeedContent } = await fetchAllFeedItems();
  const nonDuplicatedItems = await deDupeArticle(items);

  const createdArticles = [];
  for (const article of nonDuplicatedItems) {
    const clusterId = await assignArticleToCluster(article.title);
    try {
      const createdArticle = await createArticle({ ...article, clusterId });
      createdArticles.push(createdArticle);
    } catch (e) {
      throw new ApiError(500, "Failed to createArticle", {
        cause: e.message,
      });
    }
  }

  try {
    await createFetchRecord(createdArticles.length);
  } catch (e) {
    throw new ApiError(500, "Failed to logFetchedFeed", {
      cause: e.message,
    });
  }
};
