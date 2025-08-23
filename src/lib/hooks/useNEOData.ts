"use client";

import { useState, useEffect, useCallback } from "react";
import {
  NASAAPI,
  getDefaultDateRange,
  getAvailableDateRange,
} from "@/lib/api/nasa";
import { NEO, NEOFeedResponse, FilterOptions } from "@/lib/types/neo";
import { toast } from "sonner";

interface UseNEODataReturn {
  neos: NEO[];
  groupedNEOs: { [date: string]: NEO[] };
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setFilters: (filters: Partial<FilterOptions>) => void;
  filters: FilterOptions;
  availableDateRange: { pastLimit: string; futureLimit: string; today: string };
}

export function useNEOData(): UseNEODataReturn {
  const [neos, setNeos] = useState<NEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentEndDate, setCurrentEndDate] = useState<string>("");

  const [filters, setFiltersState] = useState<FilterOptions>({
    showHazardousOnly: false,
    sortBy: "date",
    sortOrder: "asc",
    ...getDefaultDateRange(),
  });

  const availableDateRange = getAvailableDateRange();

  const fetchNEOs = useCallback(
    async (startDate: string, endDate: string, append = false) => {
      try {
        setLoading(true);
        setError(null);

        const response = await NASAAPI.getNEOFeed(startDate, endDate);
        const newNEOs = Object.values(response.near_earth_objects).flat();

        if (append) {
          setNeos((prev) => [...prev, ...newNEOs]);
        } else {
          setNeos(newNEOs);
        }

        setCurrentEndDate(endDate);

        // Check if we can load more based on NASA API limits
        const nextPossibleDate = new Date(endDate);
        nextPossibleDate.setDate(nextPossibleDate.getDate() + 1);

        const canLoadMore =
          nextPossibleDate <= new Date(availableDateRange.futureLimit);
        setHasMore(canLoadMore && newNEOs.length > 0);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch NEO data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [availableDateRange.futureLimit]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    // Get the current end date from filters or currentEndDate
    const lastEndDate = filters.endDate || currentEndDate;

    if (!lastEndDate) {
      console.error("No end date available for load more");
      return;
    }

    // Calculate next date range (3 days from current end)
    const nextStartDate = new Date(lastEndDate);
    nextStartDate.setDate(nextStartDate.getDate() + 1);

    const nextEndDate = new Date(nextStartDate);
    nextEndDate.setDate(nextEndDate.getDate() + 2); // 3 days total

    const nextStartDateStr = nextStartDate.toISOString().split("T")[0];
    const nextEndDateStr = nextEndDate.toISOString().split("T")[0];

    console.log(
      `Loading more data from ${nextStartDateStr} to ${nextEndDateStr}`
    );

    // Check if we're hitting practical limits (but NASA API should handle any 7-day period)
    if (nextEndDate > new Date(availableDateRange.futureLimit)) {
      setHasMore(false);
      toast.info("Reached practical date limit");
      return;
    }

    await fetchNEOs(nextStartDateStr, nextEndDateStr, true);

    // Update the filters to reflect the new end date for subsequent load more calls
    setFiltersState((prev) => ({
      ...prev,
      endDate: nextEndDateStr,
    }));
  }, [
    currentEndDate,
    filters.endDate,
    loading,
    hasMore,
    fetchNEOs,
    availableDateRange.futureLimit,
  ]);

  const refresh = useCallback(async () => {
    const { startDate, endDate } = getDefaultDateRange();
    await fetchNEOs(startDate, endDate, false);
  }, [fetchNEOs]);

  const setFilters = useCallback(
    (newFilters: Partial<FilterOptions>) => {
      setFiltersState((prev) => {
        const updatedFilters = { ...prev, ...newFilters };

        // When date range changes, fetch new data from NASA API
        if (newFilters.startDate || newFilters.endDate) {
          const startDate = newFilters.startDate || updatedFilters.startDate;
          const endDate = newFilters.endDate || updatedFilters.endDate;

          if (startDate && endDate) {
            console.log("Date range changed, fetching new data:", {
              startDate,
              endDate,
            });

            // Validate 7-day limit before making API call
            const start = new Date(startDate);
            const end = new Date(endDate);
            const daysDiff = Math.ceil(
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysDiff <= 7) {
              // Fetch new data for the selected date range
              fetchNEOs(startDate, endDate, false);
              // Reset hasMore when new date range is selected
              setHasMore(true);
            } else {
              setError("Date range cannot exceed 7 days (NASA API limitation)");
              toast.error("Please select a date range of 7 days or less");
              return prev; // Don't update filters if invalid
            }
          }
        }

        return updatedFilters;
      });
    },
    [fetchNEOs]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Helper function to check if a date is within the filter range
  const isDateInRange = (dateString: string): boolean => {
    if (!filters.startDate && !filters.endDate) {
      return true;
    }

    const date = new Date(dateString);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    if (startDate && !endDate) {
      return date.toDateString() === startDate.toDateString();
    }

    if (startDate && endDate) {
      return date >= startDate && date <= endDate;
    }

    if (!startDate && endDate) {
      return date <= endDate;
    }

    return true;
  };

  // Group NEOs by date first
  const groupedNEOs = neos.reduce((acc, neo) => {
    const approachDate = neo.close_approach_data[0]?.close_approach_date;
    if (approachDate) {
      if (!acc[approachDate]) {
        acc[approachDate] = [];
      }
      acc[approachDate].push(neo);
    }
    return acc;
  }, {} as { [date: string]: NEO[] });

  // Apply all filters and sorting
  const filteredAndSortedNEOs = Object.entries(groupedNEOs).reduce(
    (acc, [date, dateNEOs]) => {
      if (!isDateInRange(date)) {
        return acc;
      }

      let filtered = dateNEOs;

      if (filters.showHazardousOnly) {
        filtered = filtered.filter(
          (neo) => neo.is_potentially_hazardous_asteroid
        );
      }

      if (filters.sortBy === "size") {
        filtered.sort((a, b) => {
          const aSize =
            (a.estimated_diameter.kilometers.estimated_diameter_min +
              a.estimated_diameter.kilometers.estimated_diameter_max) /
            2;
          const bSize =
            (b.estimated_diameter.kilometers.estimated_diameter_min +
              b.estimated_diameter.kilometers.estimated_diameter_max) /
            2;
          return filters.sortOrder === "asc" ? aSize - bSize : bSize - aSize;
        });
      } else if (filters.sortBy === "distance") {
        filtered.sort((a, b) => {
          const aDistance = parseFloat(
            a.close_approach_data[0]?.miss_distance?.kilometers || "0"
          );
          const bDistance = parseFloat(
            b.close_approach_data[0]?.miss_distance?.kilometers || "0"
          );
          return filters.sortOrder === "asc"
            ? aDistance - bDistance
            : bDistance - aDistance;
        });
      }

      if (filtered.length > 0) {
        acc[date] = filtered;
      }

      return acc;
    },
    {} as { [date: string]: NEO[] }
  );

  const sortedGroupedNEOs = Object.keys(filteredAndSortedNEOs)
    .sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return filters.sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    })
    .reduce((acc, date) => {
      acc[date] = filteredAndSortedNEOs[date];
      return acc;
    }, {} as { [date: string]: NEO[] });

  return {
    neos,
    groupedNEOs: sortedGroupedNEOs,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    setFilters,
    filters,
    availableDateRange,
  };
}
