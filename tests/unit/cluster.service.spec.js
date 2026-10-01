import { beforeEach, describe, expect, vi, test } from "vitest";
import * as ClusterService from "../../src/services/cluster.service";
import ApiError from "../../src/utils/ApiError.utils";
import * as ClusterRepository from "../../src/repository/cluster.repository";

vi.mock("../../src/repository/cluster.repository.js", () => ({
  findAllClusterArticles: vi.fn(),
}));

describe("cluster.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllCluster", () => {
    test("makes a request for all cluster and returns status 200", async () => {
      ClusterRepository.findAllClusterArticles.mockResolvedValue({});

      const clusters = await ClusterService.getAllClusters();

      expect(clusters).toBeDefined();
      expect(clusters).toMatchObject({
        clusters: expect.anything(),
      });
    });

    test("Catch an error with the ApiError", async () => {
      ClusterRepository.findAllClusterArticles.mockRejectedValue({});

      const clusters = ClusterService.getAllClusters()

      await expect(clusters).rejects.toThrow(ApiError);

    });
  });

  describe("getWeeksCluster", ()=>{
    test("")
  })
});
