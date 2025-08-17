"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NASAAPI } from "@/lib/api/nasa";
import { NEO } from "@/lib/types/neo";
import EventDetail from "@/components/events/EventDetail";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EventDetailPage() {
  const params = useParams();
  const [neo, setNeo] = useState<NEO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNEO = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to get basic NEO data
        const neoData = await NASAAPI.getNEODetails(params.id as string);

        // Try to fetch orbital data, but don't fail if it's not available
        try {
          const orbitalData = await NASAAPI.getOrbitalData(params.id as string);
          if (
            orbitalData &&
            typeof orbitalData === "object" &&
            orbitalData !== null &&
            "orbital_data" in orbitalData
          ) {
            neoData.orbital_data = (
              orbitalData as {
                orbital_data: import("@/lib/types/neo").OrbitalData;
              }
            ).orbital_data;
          }
        } catch (orbitalError) {
          console.log("Orbital data not available for this NEO:", params.id);
          // Continue without orbital data - it's optional
        }

        setNeo(neoData);
      } catch (err) {
        console.error("Error fetching NEO:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch NEO details";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNEO();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center w-full px-4 py-8">
        <div className="w-full max-w-7xl">
          <LoadingSpinner fullScreen />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center w-full px-4 py-8">
        <div className="w-full max-w-7xl">
          <div className="space-y-4">
            <Button asChild variant="outline">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Link>
            </Button>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (!neo) {
    return (
      <div className="flex justify-center w-full px-4 py-8">
        <div className="w-full max-w-7xl">
          <div className="space-y-4">
            <Button asChild variant="outline">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Link>
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>NEO not found</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full px-4 py-8">
      <div className="w-full max-w-7xl">
        <div className="space-y-6">
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
          </Button>

          <EventDetail neo={neo} />
        </div>
      </div>
    </div>
  );
}
