"use client";

import { useAuth } from "./AuthProvider";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { redirect } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({
  children,
  requireAuth = false,
}: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (requireAuth && !user) {
    redirect("/auth/login");
  }

  if (!requireAuth && user) {
    redirect("/");
  }

  return <>{children}</>;
}
