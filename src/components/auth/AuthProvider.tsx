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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        toast.success("Welcome back!");
      } else if (event === "SIGNED_OUT") {
        toast.info("Signed out successfully");
      }

      setState((prev) => ({
        ...prev,
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || null,
              createdAt: new Date(session.user.created_at || ""),
              updatedAt: new Date(session.user.updated_at || ""),
            }
          : null,
        loading: false,
      }));
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
    await supabase.auth.signOut();
  };

  const refreshUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setState((prev) => ({
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
    }));
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
