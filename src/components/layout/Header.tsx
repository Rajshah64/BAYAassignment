"use client";

import Link from "next/link";
import { Rocket, Menu, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  // Debug: Log user state changes
  useEffect(() => {
    console.log("Header: User state changed:", user?.email);
  }, [user]);

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-center w-full px-4">
        <div className="w-full max-w-7xl flex h-16 items-center">
          {/* Desktop Logo */}
          <div className="mr-6 hidden md:flex">
            <Link
              href="/"
              className="group flex items-center space-x-3 transition-all duration-200 hover:scale-105"
            >
              <div className="relative">
                <Rocket className="h-7 w-7 text-primary transition-colors group-hover:text-primary/80" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Cosmic Event Tracker
                </span>
                <span className="text-xs text-muted-foreground -mt-1">
                  Discover the Universe
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-accent/50 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-xl"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col space-y-6 mt-6">
                <Link
                  href="/"
                  className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative">
                    <Rocket className="h-6 w-6 text-primary" />
                    <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 opacity-60" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-base">
                      Cosmic Event Tracker
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Discover the Universe
                    </span>
                  </div>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Mobile Logo */}
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Link
              href="/"
              className="group flex items-center space-x-2 md:hidden transition-all duration-200"
            >
              <div className="relative">
                <Rocket className="h-6 w-6 text-primary" />
                <Sparkles className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 text-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-bold text-base bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                CET
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 px-3 hover:bg-accent/50 transition-all duration-200 group"
                    >
                      <Avatar className="h-7 w-7 mr-2">
                        <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                          {getInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">
                        {user.email}
                      </span>
                      <span className="sm:hidden text-sm font-medium">
                        Account
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-background/95 backdrop-blur-xl border border-border/50"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">Signed in as</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        console.log("Sign out button clicked");
                        try {
                          await signOut();
                          console.log("Sign out completed");
                        } catch (error) {
                          console.error("Sign out error:", error);
                        }
                      }}
                      className="text-sm hover:bg-accent/50 transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-accent/50 transition-all duration-200 font-medium"
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-primary hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
