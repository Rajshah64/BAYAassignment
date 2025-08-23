import { Prisma } from "@prisma/client";
export type User = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
  };
}>;

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
