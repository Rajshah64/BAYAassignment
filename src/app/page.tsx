"use client";

import { useNEOData } from "@/lib/hooks/useNEOData";
import EventList from "@/components/events/EventList";
import EventFilters from "@/components/events/EventFilters";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Lock, Rocket, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();

  const {
    groupedNEOs,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    setFilters,
    filters,
  } = useNEOData({ requireAuth: true, isAuthenticated: !!user });

  // Debug: Log filters whenever they change
  useEffect(() => {
    console.log("Current filters in HomePage:", filters);
    console.log("Grouped NEOs count:", Object.keys(groupedNEOs).length);
  }, [filters, groupedNEOs]);

  // Debug: Enhanced setFilters function
  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    console.log("Filter change requested:", newFilters);
    console.log("Previous filters:", filters);
    setFilters(newFilters);
  };

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
                Welcome to Cosmic Event Tracker
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Track asteroids and comets approaching Earth with real-time NASA
                data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Sign in to access comet tracking features</span>
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

              <div className="text-sm text-muted-foreground">
                Get access to:
                <ul className="mt-2 space-y-1 text-left max-w-md mx-auto">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Real-time asteroid and comet data from NASA
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Advanced filtering and search capabilities
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Detailed information about near-Earth objects
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Hazardous asteroid tracking
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show the main content for authenticated users
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
