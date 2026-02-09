"use client";

import React from "react";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TokenService } from "@/services/tokenService";

import { AuthService } from "@/services/authService";
import { ProfileService } from "@/services/profileService";
import { AuthResponse, UserResponse } from "@/types/api";
import Image from "next/image";
import { NotificationService, Notification } from "@/services/notificationService";
import { NotificationDropdown } from "./NotificationDropdown";

interface TopNavProps {
    onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
    const [user, setUser] = React.useState<UserResponse | null>(null);
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [unreadCount, setUnreadCount] = React.useState(0);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Try getting from local storage first for immediate display
                const storedUser = TokenService.getUser();
                if (storedUser) {
                    setUser(storedUser);
                }

                // Verify with API
                const response = await ProfileService.getProfile();
                if (response.success) {
                    setUser(response.data);
                    // Update storage (preserve existing persistence preference)
                    TokenService.setUser(response.data);
                }
            } catch (error) {
                console.warn("Unable to fetch latest profile (using cached data):", error);
            }
        };

        const fetchNotifications = async () => {
            const data = await NotificationService.getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        };

        fetchProfile();
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await NotificationService.markAsRead(id);
        const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
        setNotifications(updated);
        setUnreadCount(updated.filter(n => !n.read).length);
    };

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
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative rounded-xl text-slate-400 hover:bg-[#2A3447] hover:text-white"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-destructive ring-1 ring-[#0B0F19]" />
                        )}
                    </Button>

                    {showNotifications && (
                        <NotificationDropdown
                            notifications={notifications}
                            onMarkAsRead={handleMarkAsRead}
                            onClose={() => setShowNotifications(false)}
                        />
                    )}
                </div>

                <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-white/5">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-medium text-white">
                            {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                        </p>
                        <p className="text-xs text-slate-500">
                            {user && user.roles && user.roles.length > 0 ? user.roles[0].replace("ROLE_", "").replace("_", " ") : "Fleet Owner"}
                        </p>
                    </div>
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-primary to-blue-600 ring-2 ring-white/10">
                        {user?.logoUrl ? (
                            <Image
                                src={user.logoUrl}
                                alt="Profile"
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-white font-bold">
                                {user?.firstName?.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
