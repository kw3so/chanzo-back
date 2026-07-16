import Parser from "rss-parser";
import ApiError from "./ApiError.js";

const parser = new Parser({
  timeout: 10_000,
});

//Standardize so we push an array of valid items
const normalizedFeedItem = (item, feedMeta) => {
  const guid = (item.guid || item.link).trim();
  const pubDate = item.pubDate
    ? new Date(item.pubDate)
    : new Date(item.isoDate);
  const link = item.link.trim();
  const title = item.title.trim();
  const sourceName = feedMeta.title.trim();
  const sourceUrl = feedMeta.link.trim();
  return {
    guid,
    pubDate,
    link,
    title,
    sourceName,
    sourceUrl,
  };
};

export const parseFeed = async (feedUrl) => {
  let feed;
  try {
    feed = await parser.parseURL(feedUrl);
  } catch (error) {
    throw new ApiError(500, "Failed to parseURL", { cause: error.message });
    return [];
  }

  const parsedFeedItems = [];

  for (const item of feed.items) {
    parsedFeedItems.push(normalizedFeedItem(item, feed));
  }

  return parsedFeedItems;
};
