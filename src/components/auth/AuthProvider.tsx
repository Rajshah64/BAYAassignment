"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthContextType, AuthState } from "@/lib/types/auth";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const supabase = createClient();

  useEffect(() => {
    // Check initial auth state
    const checkInitialAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        console.log("Initial auth check:", user?.email);

        if (user) {
          setState((prev) => {
            // Only update if the user state actually changed
            if (prev.user?.id !== user.id) {
              return {
                ...prev,
                user: {
                  id: user.id,
                  email: user.email || "",
                  name: user.user_metadata?.name || null,
                  createdAt: new Date(user.created_at || ""),
                  updatedAt: new Date(user.updated_at || ""),
                },
                loading: false,
              };
            }
            return { ...prev, loading: false };
          });
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Initial auth check error:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    checkInitialAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

      if (event === "SIGNED_IN") {
        // Don't show toast here as it will be shown in the signIn function
        const newUser = session?.user
          ? {
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || null,
              createdAt: new Date(session.user.created_at || ""),
              updatedAt: new Date(session.user.updated_at || ""),
            }
          : null;

        setState((prev) => {
          // Only update if the user state actually changed
          if (prev.user?.id !== newUser?.id) {
            return {
              ...prev,
              user: newUser,
              loading: false,
            };
          }
          return prev;
        });
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out, clearing state");
        toast.info("Signed out successfully");
        setState((prev) => {
          // Only update if the user state actually changed
          if (prev.user !== null) {
            return {
              ...prev,
              user: null,
              loading: false,
            };
          }
          return prev;
        });
      } else if (event === "TOKEN_REFRESHED") {
        // Handle token refresh if needed
        console.log("Token refreshed");
      } else {
        // Handle other events
        console.log("Other auth event:", event);
        const newUser = session?.user
          ? {
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || null,
              createdAt: new Date(session.user.created_at || ""),
              updatedAt: new Date(session.user.updated_at || ""),
            }
          : null;

        setState((prev) => {
          // Only update if the user state actually changed
          if (prev.user?.id !== newUser?.id) {
            return {
              ...prev,
              user: newUser,
              loading: false,
            };
          }
          return prev;
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      toast.success("Signed in successfully!");

      // Redirect to dashboard after successful sign in
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign in failed";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      toast.error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;

      toast.success(
        "Account created! Please check your email for verification."
      );

      // Redirect to dashboard after successful sign up
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign up failed";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      toast.error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      console.log("Starting sign out process...");
      setState((prev) => ({ ...prev, loading: true }));

      // First, clear the local state immediately
      setState((prev) => ({
        ...prev,
        user: null,
        loading: false,
        error: null,
      }));

      // Clear any local storage or cookies that might contain auth data
      if (typeof window !== "undefined") {
        try {
          // Debug: Log what's in localStorage before clearing
          console.log("LocalStorage before clearing:", {
            keys: Array.from({ length: localStorage.length }, (_, i) =>
              localStorage.key(i)
            ),
            supabaseKeys: Array.from(
              { length: localStorage.length },
              (_, i) => {
                const key = localStorage.key(i);
                return key && (key.includes("supabase") || key.includes("auth"))
                  ? key
                  : null;
              }
            ).filter(Boolean),
          });

          // Clear any auth-related items from localStorage
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes("supabase") || key.includes("auth"))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((key) => localStorage.removeItem(key));

          // Clear any auth-related cookies
          const cookiesBefore = document.cookie;
          console.log("Cookies before clearing:", cookiesBefore);

          document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.split("=");
            if (
              name.trim() &&
              (name.includes("supabase") || name.includes("auth"))
            ) {
              document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }
          });

          console.log("LocalStorage after clearing:", {
            keys: Array.from({ length: localStorage.length }, (_, i) =>
              localStorage.key(i)
            ),
          });
          console.log("Cookies after clearing:", document.cookie);
          console.log("Cleared local storage and cookies");
        } catch (storageError) {
          console.log("Error clearing storage:", storageError);
        }
      }

      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase sign out error:", error);
        // Even if Supabase fails, we've already cleared local state
        toast.error(
          "Sign out completed but there was an issue with the server"
        );
        return;
      }

      console.log("Sign out successful");
      // Don't show toast here as it will be shown by the auth state change listener

      // Force clear any remaining session data
      try {
        await supabase.auth.refreshSession();
      } catch (refreshError) {
        console.log("Session refresh after sign out:", refreshError);
      }

      // Double-check that the user is actually signed out
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          console.warn(
            "User still exists after sign out, forcing state update"
          );
          setState((prev) => ({
            ...prev,
            user: null,
            loading: false,
          }));
        } else {
          console.log("User successfully signed out");
        }
      } catch (checkError) {
        console.log("Error checking user after sign out:", checkError);
      }
    } catch (error) {
      console.error("Sign out process error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Sign out failed";

      // Ensure local state is cleared even on error
      setState((prev) => ({
        ...prev,
        user: null,
        loading: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    }
  };

  const refreshUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setState((prev) => {
      // Only update if the user state actually changed
      if (prev.user?.id !== user?.id) {
        return {
          ...prev,
          user: user
            ? {
                id: user.id,
                email: user.email || "",
                name: user.user_metadata?.name || null,
                createdAt: new Date(user.created_at || ""),
                updatedAt: new Date(user.updated_at || ""),
              }
            : null,
        };
      }
      return prev;
    });
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
