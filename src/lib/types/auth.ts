import { Prisma } from "@prisma/client";

// In Prisma v6, we can directly use the User type or create a custom interface
export type User = {
  id: string;
  email: string;
  name: string | null;
};

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
