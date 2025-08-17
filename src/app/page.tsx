"use client";

import { useNEOData } from "@/lib/hooks/useNEOData";
import EventList from "@/components/events/EventList";
import EventFilters from "@/components/events/EventFilters";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";

export default function HomePage() {
  const {
    groupedNEOs,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    setFilters,
    filters,
  } = useNEOData();

  // Debug: Log filters whenever they change
  useEffect(() => {
    console.log("Current filters in HomePage:", filters);
    console.log("Grouped NEOs count:", Object.keys(groupedNEOs).length);
  }, [filters, groupedNEOs]);

  // Debug: Enhanced setFilters function
  const handleFiltersChange = (newFilters: any) => {
    console.log("Filter change requested:", newFilters);
    console.log("Previous filters:", filters);
    setFilters(newFilters);
  };

  return (
    <div className="flex justify-center w-full px-4 py-8">
      <div className="w-full max-w-7xl">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Near-Earth Objects
          </h1>
          <p className="text-lg text-muted-foreground">
            Track asteroids and comets approaching Earth
          </p>

          <div className="flex items-center gap-4">
            <Button onClick={refresh} disabled={loading} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            {/* Debug info */}
            <div className="text-sm text-gray-500">
              Filters: {filters.startDate || "no start"} to{" "}
              {filters.endDate || "no end"}| Hazardous:{" "}
              {filters.showHazardousOnly ? "Yes" : "No"}| Items:{" "}
              {Object.keys(groupedNEOs).length}
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <EventFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          <main className="lg:col-span-3">
            <EventList
              groupedNEOs={groupedNEOs}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              showHazardousOnly={filters.showHazardousOnly}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
