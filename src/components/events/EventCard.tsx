"use client";

import { memo } from "react";
import { NEO } from "@/lib/types/neo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink, Calendar, Ruler } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface EventCardProps {
  neo: NEO;
}

function EventCard({ neo }: EventCardProps) {
  const approachData = neo.close_approach_data[0];
  const approachDate = approachData?.close_approach_date;
  const missDistance = approachData?.miss_distance.kilometers;

  const avgDiameter =
    (neo.estimated_diameter.kilometers.estimated_diameter_min +
      neo.estimated_diameter.kilometers.estimated_diameter_max) /
    2;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-left">
            {neo.name}
          </CardTitle>
          <div className="flex gap-2">
            {neo.is_potentially_hazardous_asteroid && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Hazardous
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center gap-1">
              <Ruler className="h-3 w-3" />
              {avgDiameter.toFixed(2)} km
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{approachDate ? formatDate(approachDate) : "Unknown"}</span>
          </div>

          {missDistance && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Miss Distance</div>
              <div className="font-medium">
                {parseFloat(missDistance).toLocaleString()} km
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/events/${neo.id}`}>View Details</Link>
          </Button>

          <Button asChild size="sm" variant="outline">
            <a
              href={neo.nasa_jpl_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              JPL
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(EventCard);
