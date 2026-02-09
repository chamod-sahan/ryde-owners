"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, Car, CalendarCheck, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { VehicleTable } from "@/components/dashboard/VehicleTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { DashboardService, KPI, DashboardVehicle } from "@/services/dashboardService";
import { ProfileService } from "@/services/profileService";
import { UserResponse } from "@/types/api";

export default function DashboardPage() {
    const [kpis, setKpis] = useState<KPI[]>([]);
    const [vehicles, setVehicles] = useState<DashboardVehicle[]>([]);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [kpiData, vehicleData, bookingData, userData] = await Promise.all([
                    DashboardService.getKPIs(),
                    DashboardService.getTopVehicles(),
                    DashboardService.getRecentBookings(),
                    ProfileService.getProfile(),
                ]);

                setKpis(kpiData || []);
                setVehicles(vehicleData || []);
                setRecentBookings(bookingData || []);
                if (userData.success && userData.data) {
                    setUser(userData.data);
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const getIcon = (label: string) => {
        switch (label) {
            case "Total Earnings": return DollarSign;
            case "Active Rentals": return Car;
            case "Pending Bookings": return CalendarCheck;
            default: return TrendingUp;
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-slate-400">Loading Dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Welcome back, {user?.firstName || 'Owner'}. Here's what's happening today.</p>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi) => (
                    <StatCard
                        key={kpi.label}
                        label={kpi.label}
                        value={kpi.value}
                        trend={kpi.trend}
                        trendUp={kpi.trendUp}
                        icon={getIcon(kpi.label)}
                        color={kpi.color}
                    />
                ))}
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Charts (Placeholder for Recharts) */}
                <div className="lg:col-span-2 space-y-8">
                    <GlassCard className="p-4 sm:p-6 min-h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Revenue Analytics</h3>
                            <select className="bg-slate-800/50 border border-white/5 text-slate-300 text-sm rounded-lg px-3 py-1 outline-none">
                                <option>Last 30 Days</option>
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
                            <p className="text-slate-500">Revenue Chart loaded here (Recharts)</p>
                        </div>
                    </GlassCard>

                    <VehicleTable vehicles={vehicles} />
                </div>

                {/* Right Column: Recent Activity / Quick Actions */}
                <div className="space-y-8">
                    <GlassCard className="p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Bookings</h3>
                        <div className="space-y-4">
                            {recentBookings.length > 0 ? (
                                recentBookings.map((booking) => (
                                    <div key={booking.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                            <CalendarCheck className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-slate-200 truncate">{booking.car}</h4>
                                            <div className="flex items-center justify-between gap-2 mt-0.5">
                                                <p className="text-xs text-slate-500">{booking.time} • {booking.user}</p>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                                                    booking.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-slate-500 text-sm">No recent bookings</div>
                            )}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-slate-400 hover:text-white">View All Bookings</Button>
                    </GlassCard>

                    <GlassCard className="p-4 sm:p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/20">
                        <h3 className="text-lg font-semibold text-white mb-2">Pro Tips</h3>
                        <p className="text-sm text-slate-300 mb-4">
                            Vehicles with high-quality photos get 40% more bookings. Update your gallery today.
                        </p>
                        <Button variant="secondary" size="sm" className="w-full bg-white/10 hover:bg-white/20 border-0">
                            Update Photos
                        </Button>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
