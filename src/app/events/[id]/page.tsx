"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NASAAPI } from "@/lib/api/nasa";
import { NEO } from "@/lib/types/neo";
import EventDetail from "@/components/events/EventDetail";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Lock, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EventDetailPage() {
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [neo, setNeo] = useState<NEO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNEO = async () => {
      // Only fetch data if user is authenticated
      if (!user) {
        setError("Authentication required to view event details");
        setLoading(false);
        return;
      }

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
  }, [params.id, user]);

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login prompt for unauthenticated users
  if (!user) {
    return (
      <div className="flex justify-center w-full px-4 py-8">
        <div className="w-full max-w-2xl">
          <Card className="text-center">
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <Rocket className="h-16 w-16 text-primary" />
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Authentication Required
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Sign in to view detailed information about this cosmic event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>This page requires authentication</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/auth/signup">Create Account</Link>
                </Button>
              </div>

              <Button asChild variant="ghost">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Events
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
