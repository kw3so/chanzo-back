// getRawFeeds
//getFeedInArray-Show it is alive
//runFeedingandClustering

import { createArticle } from "../prismaRepos/article.repository.js";
import ApiError from "../utils/ApiError.js";
import { deDupeArticle } from "../utils/deDupe.js";
import { parseFeed } from "../utils/getFeedArray.js";
import { assignArticleToCluster } from "./cluster.service.js";
import { createFetchRecord } from "../prismaRepos/fetchedFeed.repository.js";

const getRawFeedsUrls = () => {
  const urls = process.env.RAW_FEEDS?.split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  if (!urls || urls.length === 0) {
    throw new ApiError(400, "now RAW_FEEDS urls provided");
  }

  return urls;
};

export const fetchFeedItems = async () => {
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
    feedCount: urls.length,
    failedFeedContent: failedItemsCount,
    itemsCount: successItems.length,
    items: successItems,
  };
};

export const newsFeedingAndClustering = async () => {
  const { items, failedFeedContent } = await fetchFeedItems();
  const nonDuplicatedItems = await deDupeArticle(items);

  const createdArticles = [];
  for (const article of nonDuplicatedItems) {
    const clusterId = await assignArticleToCluster(article.title);
    console.log({...article}, clusterId)
    
    try {
      const createdArticle = await createArticle({ ...article , clusterId});
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

  return {
    fetchedItems: items.count,
    ClusteredItems: createdArticles.length,
  };
};
