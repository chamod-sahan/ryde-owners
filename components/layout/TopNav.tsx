"use client";

import React from "react";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";

import { AuthService } from "@/services/authService";
import { AuthResponse } from "@/types/api";

interface TopNavProps {
    onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
    const [user, setUser] = React.useState<AuthResponse["user"] | null>(null);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Try getting from local storage first for immediate display
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                // Verify with API
                const response = await AuthService.getProfile();
                if (response.success) {
                    setUser(response.data.user);
                    // Update local storage
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }
            } catch (error) {
                // Backend might be having connectivity issues with the Auth Provider (502 Bad Gateway)
                // Fallback to stored user data is already handled by initial state
                console.warn("Unable to fetch latest profile (using cached data):", error);
            }
        };

        fetchProfile();
    }, []);
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-[#0B0F19]/80 px-4 md:px-8 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-slate-400 hover:text-white"
                    onClick={onMenuClick}
                >
                    <Menu className="h-6 w-6" />
                </Button>

                {/* Search / Breadcrumb Placeholder */}
                <div className="hidden sm:flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-10 w-40 lg:w-64 rounded-xl bg-[#151C2C] pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" size="icon" className="relative rounded-xl text-slate-400 hover:bg-[#2A3447] hover:text-white">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-destructive ring-1 ring-[#0B0F19]" />
                </Button>

                <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-white/5">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-medium text-white">
                            {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                        </p>
                        <p className="text-xs text-slate-500">
                            {user && user.roles && user.roles.length > 0 ? user.roles[0].replace("ROLE_", "").replace("_", " ") : "Fleet Owner"}
                        </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 ring-2 ring-white/10" />
                </div>
            </div>
        </header>
    );
}
