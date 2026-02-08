"use client";

import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { X, Check, Loader2, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { VehicleService } from "@/services/vehicleService";
import { DashboardVehicle } from "@/services/dashboardService";

interface EditVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: DashboardVehicle | null;
    onUpdate: () => Promise<void>;
}

export function EditVehicleModal({ isOpen, onClose, vehicle, onUpdate }: EditVehicleModalProps) {
    const [dailyPrice, setDailyPrice] = useState<number>(0);
    const [weeklyPrice, setWeeklyPrice] = useState<number>(0);
    const [monthlyPrice, setMonthlyPrice] = useState<number>(0);
    const [hourlyPrice, setHourlyPrice] = useState<number>(0);
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [deliveryFee, setDeliveryFee] = useState<number>(0);
    const [status, setStatus] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [availableFrom, setAvailableFrom] = useState("");
    const [availableUntil, setAvailableUntil] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (vehicle && isOpen) {
            setDailyPrice(vehicle.dailyRentalPrice || 0);
            setWeeklyPrice(vehicle.weeklyRentalPrice || 0);
            setMonthlyPrice(vehicle.monthlyRentalPrice || 0);
            setHourlyPrice(vehicle.hourlyRentalPrice || 0);
            setLocation(vehicle.location || "Colombo");
            setDescription(vehicle.description || "");
            setDeliveryFee(vehicle.deliveryFee || 0);
            setStatus(vehicle.availabilityStatus || "AVAILABLE");
            setIsActive(vehicle.isActive ?? true);
            setAvailableFrom(vehicle.availableFrom || "");
            setAvailableUntil(vehicle.availableUntil || "");
        }
    }, [vehicle, isOpen]);

    if (!isOpen || !vehicle) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const currentVehicle = vehicle!; // Guaranteed non-null by the return below
        setLoading(true);

        try {
            await VehicleService.updateOwnerVehicle(Number(currentVehicle.id), {
                dailyRentalPrice: dailyPrice,
                weeklyRentalPrice: weeklyPrice,
                monthlyRentalPrice: monthlyPrice,
                hourlyRentalPrice: hourlyPrice,
                location,
                description,
                deliveryFee,
                availabilityStatus: status,
                isActive,
                availableFrom: availableFrom || undefined,
                availableUntil: availableUntil || undefined
            });

            await onUpdate();
            onClose();
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update vehicle.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <GlassCard className="w-full max-w-lg p-6 relative overflow-visible">
                <button onClick={onClose} className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors z-10">
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold text-white mb-6">Edit {vehicle.name}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Daily Price ($)</label>
                            <input
                                type="number"
                                value={dailyPrice}
                                onChange={(e) => setDailyPrice(Number(e.target.value))}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Weekly Price ($)</label>
                            <input
                                type="number"
                                value={weeklyPrice}
                                onChange={(e) => setWeeklyPrice(Number(e.target.value))}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Monthly Price ($)</label>
                            <input
                                type="number"
                                value={monthlyPrice}
                                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Hourly Price ($)</label>
                            <input
                                type="number"
                                value={hourlyPrice}
                                onChange={(e) => setHourlyPrice(Number(e.target.value))}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Location / Pick-up Point</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full h-11 rounded-xl bg-slate-800/50 pl-10 pr-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50"
                                placeholder="e.g. Colombo, Airport, etc."
                            />
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Availability Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50"
                            >
                                <option value="AVAILABLE" className="bg-slate-900">Available</option>
                                <option value="UNAVAILABLE" className="bg-slate-900">Unavailable</option>
                                <option value="MAINTENANCE" className="bg-slate-900">Maintenance</option>
                                <option value="BOOKED" className="bg-slate-900">Booked</option>
                            </select>
                        </div>
                        <div className="space-y-2 flex flex-col justify-end pb-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-5 h-5 rounded-lg bg-slate-800 border-none outline-none accent-primary"
                                />
                                <span className="text-sm font-medium text-slate-300">Active (Visibile to customers)</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Available From</label>
                            <input
                                type="date"
                                value={availableFrom}
                                onChange={(e) => setAvailableFrom(e.target.value)}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Available Until</label>
                            <input
                                type="date"
                                value={availableUntil}
                                onChange={(e) => setAvailableUntil(e.target.value)}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Delivery Fee ($)</label>
                        <input
                            type="number"
                            value={deliveryFee}
                            onChange={(e) => setDeliveryFee(Number(e.target.value))}
                            className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-24 rounded-xl bg-slate-800/50 p-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 resize-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}
