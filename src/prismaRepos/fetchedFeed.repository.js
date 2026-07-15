import { prisma } from "../config/db.js";

export const createFetchRecord = async ({ feedCount }) => {
  return prisma.fetchedFeed.create({
    data: {
      feedCount,
    },
  });
};
