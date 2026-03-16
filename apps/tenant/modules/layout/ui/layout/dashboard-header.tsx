"use client";

import React from "react";
import { Bell, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { useUser, authClient } from "@workspace/auth/client";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
}) => {
  const router = useRouter();
  const user = useUser();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-20 bg-background/40 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-6 lg:px-8 py-[13px]">
        {/* Left: Title */}
        <div className="min-w-0 flex-1 pl-12 lg:pl-0">
          <div className="flex flex-col">
            <h1 className="font-display text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground font-medium mt-0.5 truncate flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:block relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search anything..."
              className="pl-11 pr-4 w-48 lg:w-72 bg-muted/30 border-border/40 focus:bg-muted/50 focus:border-primary/30 focus:ring-primary/10 transition-all rounded-xl h-11"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 h-5 select-none items-center gap-1 rounded border border-border/40 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 hidden lg:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-muted/50 rounded-xl h-11 w-11"
            >
              <Bell className="w-5 h-5 text-foreground/70" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-accent border-2 border-background rounded-full" />
            </Button>

            <div className="h-6 w-px bg-border/40 mx-1 hidden sm:block" />

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-11 p-1 pr-3 rounded-xl hover:bg-muted/50 transition-all flex items-center gap-3"
                >
                  <Avatar className="h-9 w-9 border border-border/40 rounded-lg overflow-hidden shadow-sm">
                    <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start leading-none gap-1">
                    <span className="text-xs font-bold text-foreground">
                      {user?.name || "Loading..."}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {user?.role || "Tenant User"}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-2 rounded-2xl border-border/50 shadow-medium backdrop-blur-xl"
              >
                <DropdownMenuLabel className="p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                <div className="p-1 space-y-1">
                  <DropdownMenuItem className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                    Notification Prefs
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-border/40" />
                <div className="p-1">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
