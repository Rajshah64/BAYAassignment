import { nasaClient } from "./client";
import { NEOFeedResponse, NEO } from "@/lib/types/neo";

export class NASAAPI {
  static async getNEOFeed(
    startDate: string,
    endDate: string
  ): Promise<NEOFeedResponse> {
    try {
      // Validate date range before making API call
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();

      // NASA API restrictions:
      // - Cannot fetch dates more than 7 days in the past
      // - Cannot fetch dates more than 7 days in the future
      // - Maximum range is 7 days

      const daysDiff = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff > 7) {
        throw new Error("NASA API only allows 7-day ranges maximum");
      }

      const daysFromToday = Math.ceil(
        (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysFromToday < -7 || daysFromToday > 7) {
        throw new Error("NASA API only allows dates within 7 days of today");
      }

      const response = await nasaClient.get("/neo/rest/v1/feed", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      return response.data;
    } catch (error) {
      console.error("NASA API Error:", error);
      throw new Error("Failed to fetch NEO data");
    }
  }

  static async getNEODetails(neoId: string): Promise<NEO> {
    try {
      const response = await nasaClient.get(`/neo/rest/v1/neo/${neoId}`);
      return response.data;
    } catch (error) {
      console.error("NASA API Error:", error);
      throw new Error("Failed to fetch NEO details");
    }
  }

  static async getOrbitalData(neoId: string): Promise<unknown> {
    try {
      const response = await nasaClient.get(
        `/neo/rest/v1/neo/${neoId}/orbital`
      );
      return response.data;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        error.response.status === 404
      ) {
        console.log(`Orbital data not available for NEO ${neoId}`);
        return null;
      }
      console.error("NASA API Error:", error);
      throw new Error("Failed to fetch orbital data");
    }
  }
}

export const getDefaultDateRange = () => {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 6); // 7 days total (today + 6)

  return {
    startDate: today.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
};

export const getAvailableDateRange = () => {
  const today = new Date();
  const pastLimit = new Date();
  const futureLimit = new Date();

  pastLimit.setDate(today.getDate() - 7);
  futureLimit.setDate(today.getDate() + 7);

  return {
    pastLimit: pastLimit.toISOString().split("T")[0],
    futureLimit: futureLimit.toISOString().split("T")[0],
    today: today.toISOString().split("T")[0],
  };
};
