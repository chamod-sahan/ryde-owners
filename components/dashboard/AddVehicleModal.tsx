"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { X, Check, Fuel, Settings, Gauge, Users, Car, Armchair } from "lucide-react";
import { cn } from "@/lib/utils";
import { VehicleService } from "@/services/vehicleService";

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { name: string; bodyType: string; year: number; subModel: string }) => Promise<void>;
}

export function AddVehicleModal({ isOpen, onClose, onAdd }: AddVehicleModalProps) {
    const [make, setMake] = useState("");
    const [makeId, setMakeId] = useState<number | null>(null);
    const [model, setModel] = useState("");
    const [year, setYear] = useState<number | null>(null);
    const [subModel, setSubModel] = useState("");
    const [bodyType, setBodyType] = useState("");
    const [bodyTypeId, setBodyTypeId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [subModelId, setSubModelId] = useState<number | string | null>(null);
    const [trimData, setTrimData] = useState<any>(null);

    // Data states
    const [makes, setMakes] = useState<{ id: number; name: string }[]>([]);
    const [makesLoading, setMakesLoading] = useState(true);
    const [models, setModels] = useState<{ id: number; name: string }[]>([]);
    const [modelsLoading, setModelsLoading] = useState(false);
    const [subModels, setSubModels] = useState<{ id: number | string; name: string }[]>([]);
    const [subModelsLoading, setSubModelsLoading] = useState(false);
    const [bodyTypes, setBodyTypes] = useState<{ id: number; name: string; code: string }[]>([]);
    const [bodyTypesLoading, setBodyTypesLoading] = useState(true);

    // Generate recent years (e.g. current year + 1 back to 2010)
    const currentYear = new Date().getFullYear() + 1;
    const years = Array.from({ length: currentYear - 2009 }, (_, i) => currentYear - i);

    // Fetch makes and body types when modal opens
    useEffect(() => {
        async function fetchInitialData() {
            setMakesLoading(true);
            setBodyTypesLoading(true);
            try {
                const [makesData, bodyTypesData] = await Promise.all([
                    VehicleService.getMakes(),
                    VehicleService.getBodyTypes()
                ]);
                setMakes(makesData);
                setBodyTypes(bodyTypesData);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setMakesLoading(false);
                setBodyTypesLoading(false);
            }
        }
        if (isOpen) {
            fetchInitialData();
        }
    }, [isOpen]);

    // Fetch models when make is selected
    useEffect(() => {
        async function fetchModels() {
            if (!make) {
                setModels([]);
                return;
            }
            setModelsLoading(true);
            try {
                const data = await VehicleService.getModels(make);
                setModels(data);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            } finally {
                setModelsLoading(false);
            }
        }

        // Reset dependent fields
        setModel("");
        setYear(null);
        setSubModel("");
        setSubModels([]);

        fetchModels();
    }, [make]);

    // Fetch submodels when make, model, and year are selected
    useEffect(() => {
        async function fetchSubModels() {
            if (!make || !model || !year) {
                setSubModels([]);
                return;
            }
            setSubModelsLoading(true);
            try {
                const data = await VehicleService.getSubModels(make, model, year);
                setSubModels(data);
            } catch (error) {
                console.error("Failed to fetch submodels:", error);
            } finally {
                setSubModelsLoading(false);
            }
        }

        // Reset submodel when dependencies change
        setSubModel("");

        fetchSubModels();
    }, [make, model, year]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!make || !model || !year) return;

        setLoading(true);

        try {
            // 1. Fetch Trim Details if subModel is selected
            if (subModel && !trimData) {
                console.log("🔍 Fetching trim details for:", { make, model, year, subModel });
                const details = await VehicleService.getTrimDetails({
                    make,
                    model,
                    year: year || 0,
                    submodel: subModel
                });
                setTrimData(details);
                setLoading(false);
                return; // Stop here to show the data as requested
            }

            // Fallback if no subModel selected or just proceed
            const name = `${year} ${make} ${model} ${subModel ? subModel : ''}`.trim();
            await onAdd({ name, bodyType, year: year || 0, subModel });

            // Reset form
            setMake("");
            setMakeId(null);
            setModel("");
            setYear(null);
            setSubModel("");
            setSubModelId(null);
            setBodyType("");
            setBodyTypeId(null);
            setTrimData(null); // Clear previous data
            onClose();
        } catch (error) {
            console.error("Error in submit:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <GlassCard className="w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors z-10"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold text-white mb-6">Add New Vehicle</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* API Response UI Display */}
                    {trimData && (
                        <div className="bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                            {/* Header */}
                            <div className="bg-primary/10 p-4 border-b border-white/10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Vehicle Specification</h3>
                                    <p className="text-white font-bold text-lg">
                                        {trimData.year_model_start || year} {trimData.make_model_trim_make_display || make} {trimData.make_model_trim_model_display || model} {trimData.make_model_trim_trim_display || subModel}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setTrimData(null)}
                                    className="text-slate-400 hover:text-white hover:bg-white/10 h-8 px-2"
                                >
                                    Change
                                </Button>
                            </div>

                            {/* Specs Grid */}
                            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Engine */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
                                        <Settings className="w-3 h-3" /> Engine
                                    </div>
                                    <p className="text-white text-sm font-medium">
                                        {trimData.make_model_trim_engine_type || "N/A"}
                                        {trimData.make_model_trim_engine_num_cyl ? ` (${trimData.make_model_trim_engine_num_cyl} Cyl)` : ""}
                                    </p>
                                </div>

                                {/* Transmission */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
                                        <Settings className="w-3 h-3" /> Transmission
                                    </div>
                                    <p className="text-white text-sm font-medium capitalize">
                                        {trimData.make_model_trim_transmission_type?.toLowerCase() || "Automatic"}
                                    </p>
                                </div>

                                {/* Drivetrain */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
                                        <Car className="w-3 h-3" /> Drivetrain
                                    </div>
                                    <p className="text-white text-sm font-medium">
                                        {trimData.make_model_trim_drive_type || "N/A"}
                                    </p>
                                </div>

                                {/* MPG */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
                                        <Fuel className="w-3 h-3" /> Est. MPG
                                    </div>
                                    <p className="text-white text-sm font-medium">
                                        {trimData.make_model_trim_city_mpg_fuel1 || "?"} City / {trimData.make_model_trim_hwy_mpg_fuel1 || "?"} Hwy
                                    </p>
                                </div>

                                {/* Seats/Doors */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
                                        <Users className="w-3 h-3" /> Seats & Doors
                                    </div>
                                    <p className="text-white text-sm font-medium">
                                        {trimData.make_model_trim_body_num_doors || "?"} Doors, {trimData.make_model_trim_body_num_seats || "?"} Seats
                                    </p>
                                </div>

                                {/* Body Class */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
                                        <Armchair className="w-3 h-3" /> Class
                                    </div>
                                    <p className="text-white text-sm font-medium truncate" title={trimData.make_model_trim_body_type}>
                                        {trimData.make_model_trim_body_type || bodyType || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Confirmation Action */}
                            <div className="p-4 bg-white/5 border-t border-white/10">
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        setLoading(true);
                                        const name = `${year} ${make} ${model} ${subModel ? subModel : ''}`.trim();
                                        await onAdd({ name, bodyType, year: year || 0, subModel });
                                        setLoading(false);
                                        setTrimData(null);
                                        onClose();
                                    }}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-10 shadow-lg shadow-primary/20"
                                >
                                    <Check className="w-4 h-4 mr-2" /> Confirm & Add Vehicle
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Vehicle Make</label>
                            <select
                                value={make}
                                onChange={(e) => {
                                    const selectedMake = makes.find(m => m.name === e.target.value);
                                    console.log("Selected make:", e.target.value, "makeId:", selectedMake?.id);
                                    setMake(e.target.value);
                                    setMakeId(selectedMake?.id || null);
                                    setModel(""); // Reset model when make changes
                                }}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all cursor-pointer"
                                required
                                disabled={makesLoading}
                            >
                                <option value="" disabled>
                                    {makesLoading ? "Loading makes..." : "Select a make"}
                                </option>
                                {makes.map((makeItem) => (
                                    <option key={makeItem.id} value={makeItem.name}>
                                        {makeItem.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Vehicle Model</label>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                disabled={!make || modelsLoading}
                            >
                                <option value="" disabled>
                                    {!make ? "Select a make first" : modelsLoading ? "Loading models..." : "Select a model"}
                                </option>
                                {models.map((modelItem) => (
                                    <option key={modelItem.id} value={modelItem.name}>
                                        {modelItem.name}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Year</label>
                            <select
                                value={year || ""}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all cursor-pointer"
                                required
                                disabled={!model}
                            >
                                <option value="" disabled>Select Year</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Sub Model <span className="text-slate-500 font-normal">(Optional)</span></label>
                            <select
                                value={subModel}
                                onChange={(e) => {
                                    const selected = subModels.find(sm => sm.name === e.target.value);
                                    setSubModel(e.target.value);
                                    setSubModelId(selected?.id || null);
                                    // Reset trim data when submodel changes to force re-fetch
                                    setTrimData(null);
                                }}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all cursor-pointer"
                                disabled={!year || subModelsLoading}
                            >
                                <option value="" disabled>
                                    {!year ? "Select year first" : subModelsLoading ? "Loading..." : "Select sub model"}
                                </option>
                                <option value="">None</option>
                                {subModels.map((sm) => (
                                    <option key={sm.name} value={sm.name}>{sm.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Body Type</label>
                            <select
                                value={bodyType}
                                onChange={(e) => {
                                    const selectedBodyType = bodyTypes.find(bt => bt.name === e.target.value);
                                    console.log("Selected body type:", e.target.value, "bodyTypeId:", selectedBodyType?.id);
                                    setBodyType(e.target.value);
                                    setBodyTypeId(selectedBodyType?.id || null);
                                }}
                                className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all cursor-pointer"
                                required
                                disabled={bodyTypesLoading}
                            >
                                <option value="" disabled>
                                    {bodyTypesLoading ? "Loading body types..." : "Select a body type"}
                                </option>
                                {bodyTypes.map((bodyTypeItem) => (
                                    <option key={bodyTypeItem.id} value={bodyTypeItem.name}>
                                        {bodyTypeItem.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-white/10 hover:bg-white/5 text-slate-300">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? "Adding..." : "Add Vehicle"}
                        </Button>
                    </div>
                </form>
            </GlassCard>
        </div >
    );
}
