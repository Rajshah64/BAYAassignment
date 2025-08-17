"use client";

import { NEO } from "@/lib/types/neo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ExternalLink,
  Calendar,
  Ruler,
  Navigation,
  Zap,
  Globe,
  Info,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface EventDetailProps {
  neo: NEO;
}

export default function EventDetail({ neo }: EventDetailProps) {
  const approachData = neo.close_approach_data[0];
  const approachDate = approachData?.close_approach_date;
  const missDistance = approachData?.miss_distance;
  const velocity = approachData?.relative_velocity;

  const avgDiameter =
    (neo.estimated_diameter.kilometers.estimated_diameter_min +
      neo.estimated_diameter.kilometers.estimated_diameter_max) /
    2;

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, "EEEE, MMMM d, yyyy 'at' HH:mm 'UTC'");
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{neo.name}</h1>
            <p className="text-muted-foreground">
              NEO Reference ID: {neo.neo_reference_id}
            </p>
          </div>
          <div className="flex gap-2">
            {neo.is_potentially_hazardous_asteroid && (
              <Badge variant="destructive" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Potentially Hazardous
              </Badge>
            )}
            {neo.is_sentry_object && (
              <Badge variant="secondary" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Sentry Object
              </Badge>
            )}
          </div>
        </div>

        <Button asChild variant="outline">
          <a
            href={neo.nasa_jpl_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View on NASA JPL
          </a>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Absolute Magnitude</div>
                <div className="font-medium">{neo.absolute_magnitude_h}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Estimated Diameter</div>
                <div className="font-medium">{avgDiameter.toFixed(2)} km</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Diameter Range
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Min</div>
                  <div className="font-medium">
                    {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
                      2
                    )}{" "}
                    km
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Max</div>
                  <div className="font-medium">
                    {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
                      2
                    )}{" "}
                    km
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Close Approach Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Close Approach Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {approachDate ? formatDate(approachDate) : "Unknown"}
                </span>
              </div>

              {missDistance && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Miss Distance
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Astronomical</div>
                      <div className="font-medium">
                        {missDistance.astronomical} AU
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Lunar</div>
                      <div className="font-medium">{missDistance.lunar} LD</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Kilometers</div>
                      <div className="font-medium">
                        {parseFloat(missDistance.kilometers).toLocaleString()}{" "}
                        km
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Miles</div>
                      <div className="font-medium">
                        {parseFloat(missDistance.miles).toLocaleString()} mi
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {velocity && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Relative Velocity
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">km/s</div>
                      <div className="font-medium">
                        {velocity.kilometers_per_second} km/s
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">km/h</div>
                      <div className="font-medium">
                        {velocity.kilometers_per_hour} km/h
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm">
                <div className="text-muted-foreground">Orbiting Body</div>
                <div className="font-medium">
                  {approachData?.orbiting_body || "Unknown"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orbital Data (if available) */}
      {neo.orbital_data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Orbital Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Orbit ID</div>
                <div className="font-medium">{neo.orbital_data.orbit_id}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Orbit Class</div>
                <div className="font-medium">
                  {neo.orbital_data.orbit_class.orbit_class_type}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  First Observation
                </div>
                <div className="font-medium">
                  {format(
                    parseISO(neo.orbital_data.first_observation_date),
                    "MMM d, yyyy"
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Last Observation
                </div>
                <div className="font-medium">
                  {format(
                    parseISO(neo.orbital_data.last_observation_date),
                    "MMM d, yyyy"
                  )}
                </div>
              </div>
            </div>

            {neo.orbital_data.orbit_class.orbit_class_description && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="text-sm">
                  {neo.orbital_data.orbit_class.orbit_class_description}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
