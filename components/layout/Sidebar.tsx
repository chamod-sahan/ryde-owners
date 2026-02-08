"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Car, Calendar, BarChart3, Settings, LogOut } from "lucide-react";
import { AuthService } from "@/services/authService";
import { ProfileService } from "@/services/profileService";
import { UserResponse } from "@/types/api";
import Image from "next/image";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Vehicles", href: "/dashboard/vehicles", icon: Car },
    { label: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { label: "Earnings", href: "/dashboard/earnings", icon: BarChart3 },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = React.useState<UserResponse | null>(null);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                const response = await ProfileService.getProfile();
                if (response.success) {
                    setUser(response.data);
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
            } catch (error) {
                console.warn("Unable to fetch latest profile for sidebar:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("Logout failed", error);
            // Continue with client-side cleanup anyway
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            router.push("/login");
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity md:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside className={cn(
                "fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/5 bg-[#0B0F19]/95 backdrop-blur-xl transition-transform duration-300 md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-full flex-col p-6">
                    {/* Logo Area */}
                    <div className="mb-10 flex items-center gap-3 px-2">
                        {user?.logoUrl ? (
                            <div className="h-10 w-10 overflow-hidden rounded-lg ring-1 ring-white/10">
                                <Image
                                    src={user.logoUrl}
                                    alt="Owner Logo"
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="h-8 w-8 rounded-lg bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        )}
                        <span className="text-xl font-bold tracking-tight text-white">Ryde<span className="text-primary">.Owner</span></span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(59,130,246,0.1)] ring-1 ring-primary/20"
                                            : "text-slate-400 hover:bg-[#2A3447]/50 hover:text-white"
                                    )}
                                    onClick={() => {
                                        if (window.innerWidth < 768) onClose();
                                    }}
                                >
                                    <Icon className={cn("h-5 w-5", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "text-slate-500 group-hover:text-white")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="mt-auto space-y-2 border-t border-white/5 pt-6">
                        <Link
                            href="/dashboard/settings"
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-[#2A3447]/50 hover:text-white",
                                pathname === "/dashboard/settings" ? "text-primary" : "text-slate-400"
                            )}
                        >
                            <Settings className="h-5 w-5 text-slate-500 group-hover:text-white" />
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
