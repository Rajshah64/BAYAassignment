"use client";

import { NEO } from "@/lib/types/neo";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Calendar, AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";

interface EventListProps {
  groupedNEOs: { [date: string]: NEO[] };
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  showHazardousOnly: boolean;
}

function EventListSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((day) => (
        <div key={day} className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((card) => (
              <div key={card} className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EventList({
  groupedNEOs,
  loading,
  hasMore,
  onLoadMore,
  showHazardousOnly,
}: EventListProps) {
  const dates = Object.keys(groupedNEOs).sort();

  if (loading && dates.length === 0) {
    return <EventListSkeleton />;
  }

  if (dates.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No events found</h3>
        <p className="text-muted-foreground">
          {showHazardousOnly
            ? "No hazardous asteroids in this date range."
            : "No near-Earth objects in this date range."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {dates.map((date) => {
        const neos = groupedNEOs[date];
        const hazardousCount = neos.filter(
          (neo) => neo.is_potentially_hazardous_asteroid
        ).length;

        return (
          <div key={date} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {format(parseISO(date), "EEEE, MMMM d, yyyy")}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{neos.length} objects</span>
                {hazardousCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {hazardousCount} hazardous
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {neos.map((neo, index) => (
                <EventCard key={`${neo.id}-${date}-${index}`} neo={neo} />
              ))}
            </div>
          </div>
        );
      })}

      {hasMore && (
        <div className="text-center pt-8">
          <Button onClick={onLoadMore} disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Events"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
