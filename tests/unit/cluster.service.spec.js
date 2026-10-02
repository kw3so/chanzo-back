import { beforeEach, describe, expect, vi, test } from "vitest";
import * as ClusterService from "../../src/services/cluster.service";
import ApiError from "../../src/utils/ApiError.utils";
import * as ClusterRepository from "../../src/repository/cluster.repository";
import { getActiveWeekWindow } from "../../src/utils/activeWeekWindow.utils";
import { similarityScore } from "../../src/utils/similarityScore.utils";

vi.mock("../../src/repository/cluster.repository.js", () => ({
  findAllClusterArticles: vi.fn(),
  findArticlesInActiveWindow: vi.fn(),
  findActiveClustersInWindow: vi.fn(),
  createCluster: vi.fn(),
}));
vi.mock("../../src/utils/activeWeekWindow.utils.js", () => ({
  getActiveWeekWindow: vi.fn(),
}));
vi.mock("../../src/utils/similarityScore.utils.js", () => ({
  similarityScore: vi.fn(),
}));

const ACTIVE_WINDOW = {
  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  end: new Date(Date.now()),
};

describe("cluster.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllCluster", () => {
    test("makes a request for all cluster and returns clusters", async () => {
      const clusters = [{ id: 1, id: 2 }];
      ClusterRepository.findAllClusterArticles.mockResolvedValue(clusters);

      const results = await ClusterService.getAllClusters();

      expect(results).toBeDefined();
      expect(results).toEqual({
        clustersCount: clusters.length,
        clusters,
      });
    });

    test("Catch an error with the ApiError", async () => {
      ClusterRepository.findAllClusterArticles.mockRejectedValue(
        new Error("db down"),
      );

      const clusters = ClusterService.getAllClusters();

      await expect(clusters).rejects.toThrow(ApiError);
      await expect(clusters).rejects.toMatchObject({
        statusCode: 500,
        message: "Failed to get all clusters",
      });
    });
  });

  describe("getWeeksCluster", () => {
    test("make request for this weeks cluster only", async () => {
      getActiveWeekWindow.mockReturnValue(ACTIVE_WINDOW);
      ClusterRepository.findArticlesInActiveWindow.mockResolvedValue({});

      const clusters = await ClusterService.getWeeksClusters();

      expect(clusters).toMatchObject({
        clusters: expect.anything(),
      });
    });
    test("catch the error with ApiError", async () => {
      ClusterRepository.findArticlesInActiveWindow.mockRejectedValue({});

      await expect(ClusterService.getWeeksClusters()).rejects.toThrow(ApiError);
    });
  });

  describe("assignArticleCluster", () => {
    test("success findActiveClustsInWindow, and assign an article to clusters", async () => {
      getActiveWeekWindow.mockReturnValue({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now()),
      });
      ClusterRepository.findActiveClustersInWindow.mockResolvedValue([]);
      ClusterRepository.createCluster.mockResolvedValue({
        id: "new-cluster-1",
      });

      const assignedCluster =
        await ClusterService.assignArticleToCluster("article-title"); //because we return an id

      expect(assignedCluster).toBe("new-cluster-1");
    });
    test("throws Api error when we can't find active cluster in window", async () => {
      getActiveWeekWindow.mockResolvedValue();
      ClusterRepository.findActiveClustersInWindow.mockRejectedValue({});

      const erroredClusters =
        ClusterService.assignArticleToCluster("article-title");

      await expect(erroredClusters).rejects.toThrow(ApiError);
      expect(ClusterRepository.createCluster).not.toHaveBeenCalled();
    });

    test("throw ApiError when createCluster fails", async () => {
      getActiveWeekWindow.mockResolvedValue({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now()),
      });
      ClusterRepository.findActiveClustersInWindow.mockResolvedValue([]);
      ClusterRepository.createCluster.mockRejectedValue({});

      const errorCreation =
        ClusterService.assignArticleToCluster("article-title");
      await expect(errorCreation).rejects.toThrow(ApiError);
    });
  });
});
