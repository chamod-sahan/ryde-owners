"use client";

import React, { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { VehicleTable } from "@/components/dashboard/VehicleTable";
import { DashboardService, DashboardVehicle } from "@/services/dashboardService";
import { Search, Filter, Plus } from "lucide-react";
import { AddVehicleModal } from "@/components/dashboard/AddVehicleModal";

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<DashboardVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredVehicles, setFilteredVehicles] = useState<DashboardVehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadVehicles();
    }, []);

    async function loadVehicles() {
        setLoading(true);
        const data = await DashboardService.getAllVehicles();
        setVehicles(data);
        setFilteredVehicles(data);
        setLoading(false);
    }

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = vehicles.filter(v =>
            v.name.toLowerCase().includes(lowerQuery) ||
            v.plate.toLowerCase().includes(lowerQuery)
        );
        // Maintain mock sort order or standard
        setFilteredVehicles(filtered);
    }, [searchQuery, vehicles]);

    const handleAddVehicle = async (data: { name: string; bodyType: string; year: number; subModel: string }) => {
        await DashboardService.addVehicle(data);
        // Refresh list
        const updated = await DashboardService.getAllVehicles();
        setVehicles(updated);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Vehicles</h1>
                    <p className="text-slate-400 mt-1">Manage your fleet, track earnings, and update status.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vehicle
                </Button>
            </div>

            <GlassCard className="p-4 sm:p-6">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name or plate..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 w-full rounded-xl bg-slate-800/50 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <Button variant="outline" className="text-slate-300 border-white/10 hover:bg-white/5 hover:text-white">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-slate-500">Loading fleet data...</div>
                ) : (
                    <VehicleTable vehicles={filteredVehicles} />
                )}
            </GlassCard>

            <AddVehicleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddVehicle}
            />
        </div>
    );
}
