import { prisma } from "../config/db.js";
import { assignCluster } from "../utils/clusterEngine.js";
import { deDupeArticle } from "../utils/deDupe.js";
import { parseFeed } from "../utils/getFeedArray.js";

const getRawFeeds = () => {
  return process.env.RAW_FEEDS?.split(",")
    .map((url) => url.trim())
    .filter(Boolean); 
};

const feedandCluster = async (req, res) => {
  //Get the feed
  try {
    const rawFeeds = getRawFeeds();
    if (!rawFeeds || rawFeeds === 0) {
       return res.status(404).json({
        status: "failed",
        error: "no raw feeds zimepaka",
      });
    }
    const feedResults = await Promise.allSettled(
      rawFeeds.map((rawFeed) => parseFeed(rawFeed)),
    );

    const allItems = feedResults
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value);

    const failedFeedContent = feedResults.filter(
      (result) => result.status === "rejected",
    ).length;

    if (allItems.length === 0) {
      return res.status(404).json({
        message: "Hanaku content kwa hizo Feedmstiri",
        data: {
          failedFeedContent,
        },
      });
    }

    // Cheki deduped content
    const nonDups = await deDupeArticle(allItems);

    //Ziingie moja moja juu an article itacreate a new cluster
    const createdArticles = [];
    for (const article of nonDups) {
      const clusterId = await assignCluster(article.title);

      const createArticle = await prisma.article.create({
        data: {
          ...article,
          clusterId: clusterId,
        },
      });
      createdArticles.push(createArticle);
    }
    await prisma.fetchedFeed.create({
      data: {
        feedCount: nonDups.length,
      },
    });

    //Shughulika na return res
    return res.status(200).json({
      status: "success",
      data: {
        fetched: allItems.length,
        inserted: createdArticles.length,
      },
    });
  } catch (e) {
    return res.status(500).json({
      message: "Hapo kwa feed, cluster hadi kwa DB",
    });
  }
};

export { feedandCluster };
