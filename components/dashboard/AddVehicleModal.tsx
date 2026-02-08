"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { X, Check, Fuel, Settings, Users, Car, Armchair, Search, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { VehicleService } from "@/services/vehicleService";
import { VehicleSearchResponse } from "@/types/api";

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: () => Promise<void>;
}

// Autocomplete Input Component
function AutocompleteInput({
    label,
    value,
    onChange,
    options,
    loading,
    disabled,
    placeholder,
    required,
    onSelect
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { id: number; name: string }[];
    loading?: boolean;
    disabled?: boolean;
    placeholder?: string;
    required?: boolean;
    onSelect?: (option: { id: number; name: string }) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            const filtered = options.filter(opt =>
                opt.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    }, [value, options]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-2" ref={containerRef}>
            <label className="text-sm font-medium text-slate-300">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={loading ? "Loading..." : placeholder}
                    disabled={disabled || loading}
                    required={required}
                    className={cn(
                        "w-full h-11 rounded-xl bg-slate-800/50 px-4 pr-10 text-sm text-white outline-none",
                        "ring-1 ring-white/5 focus:ring-primary/50 transition-all",
                        "placeholder:text-slate-500",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                    )}
                </div>

                {/* Dropdown */}
                {isOpen && filteredOptions.length > 0 && (
                    <div className="absolute z-50 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-xl bg-slate-900 border border-white/10 shadow-xl">
                        {filteredOptions.slice(0, 50).map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                    onChange(option.name);
                                    onSelect?.(option);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-2.5 text-sm text-white hover:bg-primary/20 transition-colors",
                                    value === option.name && "bg-primary/10 text-primary"
                                )}
                            >
                                {option.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export function AddVehicleModal({ isOpen, onClose, onAdd }: AddVehicleModalProps) {
    // Form states
    const [make, setMake] = useState("");
    const [makeId, setMakeId] = useState<number | null>(null);
    const [model, setModel] = useState("");
    const [modelId, setModelId] = useState<number | null>(null);
    const [year, setYear] = useState<number | null>(null);
    const [yearInput, setYearInput] = useState("");
    const [bodyType, setBodyType] = useState("");
    const [bodyTypeId, setBodyTypeId] = useState<number | null>(null);
    const [dailyPrice, setDailyPrice] = useState<number>(50);
    const [weeklyPrice, setWeeklyPrice] = useState<number>(300);
    const [monthlyPrice, setMonthlyPrice] = useState<number>(1000);
    const [location, setLocation] = useState("Colombo");
    const [description, setDescription] = useState("Newly added vehicle");
    const [availableFrom, setAvailableFrom] = useState<string>("");
    const [availableUntil, setAvailableUntil] = useState<string>("");
    const [deliveryFee, setDeliveryFee] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    // Search result state
    const [searchResult, setSearchResult] = useState<VehicleSearchResponse | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Manual input states (when vehicle not found)
    const [fuelType, setFuelType] = useState("");
    const [fuelTypeId, setFuelTypeId] = useState<number | null>(null);
    const [transmission, setTransmission] = useState("");
    const [transmissionId, setTransmissionId] = useState<number | null>(null);
    const [driveType, setDriveType] = useState("");
    const [driveTypeId, setDriveTypeId] = useState<number | null>(null);
    const [seats, setSeats] = useState<number>(5);
    const [doors, setDoors] = useState<number>(4);

    // Data states
    const [makes, setMakes] = useState<{ id: number; name: string }[]>([]);
    const [makesLoading, setMakesLoading] = useState(true);
    const [models, setModels] = useState<{ id: number; name: string }[]>([]);
    const [modelsLoading, setModelsLoading] = useState(false);
    const [bodyTypes, setBodyTypes] = useState<{ id: number; name: string; code: string }[]>([]);
    const [bodyTypesLoading, setBodyTypesLoading] = useState(true);
    const [fuelTypes, setFuelTypes] = useState<{ id: number; name: string }[]>([]);
    const [transmissions, setTransmissions] = useState<{ id: number; name: string }[]>([]);
    const [driveTypes, setDriveTypes] = useState<{ id: number; name: string }[]>([]);

    // Generate years
    const currentYear = new Date().getFullYear() + 1;
    const years = Array.from({ length: currentYear - 2009 }, (_, i) => ({ id: currentYear - i, name: String(currentYear - i) }));

    // Fetch initial data
    useEffect(() => {
        async function fetchInitialData() {
            if (!isOpen) return;

            setMakesLoading(true);
            setBodyTypesLoading(true);
            try {
                // Fetch all initial data from backend APIs
                const [makesData, bodyTypesData, fuelTypesData, transmissionsData, driveTypesData] = await Promise.all([
                    VehicleService.getMakes(),
                    VehicleService.getBodyTypes(),
                    VehicleService.getFuelTypes(),
                    VehicleService.getTransmissions(),
                    VehicleService.getDriveTypes()
                ]);

                console.log("✅ Fetched initial data:", {
                    makes: makesData.length,
                    bodyTypes: bodyTypesData.length,
                    fuelTypes: fuelTypesData.length,
                    transmissions: transmissionsData.length,
                    driveTypes: driveTypesData.length
                });

                setMakes(makesData);
                setBodyTypes(bodyTypesData);
                setFuelTypes(fuelTypesData);
                setTransmissions(transmissionsData);
                setDriveTypes(driveTypesData);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setMakesLoading(false);
                setBodyTypesLoading(false);
            }
        }
        fetchInitialData();
    }, [isOpen]);

    // Fetch models when make changes
    useEffect(() => {
        async function fetchModels() {
            if (!make || !makeId) {
                setModels([]);
                return;
            }
            setModelsLoading(true);
            try {
                console.log(`🚗 Fetching models for ${make} (id: ${makeId})`);
                const data = await VehicleService.getModels(make, makeId);
                // Deduplicate models by name - Backend will resolve correct year-specific ID
                const uniqueModels = Array.from(new Map(data.map(m => [m.name, m])).values());
                setModels(uniqueModels);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            } finally {
                setModelsLoading(false);
            }
        }

        // Reset dependent fields
        setModel("");
        setModelId(null);
        setYear(null);
        setYearInput("");
        setSearchResult(null);

        fetchModels();
    }, [make, makeId]);

    // Search for vehicle specs when make, model, and year are all selected
    const searchVehicleSpecs = useCallback(async () => {
        if (!makeId || !modelId || !year) return;

        setIsSearching(true);
        setSearchResult(null);

        try {
            console.log("🔍 Searching vehicle specs:", { makeId, modelId, year });
            const result = await VehicleService.searchSpecs(makeId, modelId, year);
            console.log("📋 Search result:", result);
            setSearchResult(result);

            // If vehicle found, auto-populate technical specs
            if (result.available) {
                if (result.transmissionId) {
                    setTransmissionId(result.transmissionId);
                    setTransmission(result.transmissionName || "");
                }
                if (result.fuelTypeId) {
                    setFuelTypeId(result.fuelTypeId);
                    setFuelType(result.fuelTypeName || "");
                }
                if (result.driveTypeId) {
                    setDriveTypeId(result.driveTypeId);
                    setDriveType(result.driveTypeName || "");
                }
                setSeats(result.seats || 5);
                setDoors(result.doors || 4);
            } else {
                // If NOT found, clear manual inputs to let user choose
                setTransmissionId(null);
                setTransmission("");
                setFuelTypeId(null);
                setFuelType("");
                setDriveTypeId(null);
                setDriveType("");
            }
        } catch (error) {
            console.error("Failed to search vehicle specs:", error);
            // On error, let user input specs manually
            setSearchResult({ available: false, message: "Could not fetch specs. Please enter manually." } as any);
        } finally {
            setIsSearching(false);
        }
    }, [makeId, modelId, year]);

    // Trigger search when all three are selected
    useEffect(() => {
        if (makeId && modelId && year) {
            searchVehicleSpecs();
        }
    }, [makeId, modelId, year, searchVehicleSpecs]);

    // Reset form
    const resetForm = () => {
        setMake("");
        setMakeId(null);
        setModel("");
        setModelId(null);
        setYear(null);
        setYearInput("");
        setBodyType("");
        setBodyTypeId(null);
        setSearchResult(null);
        setFuelType("");
        setFuelTypeId(null);
        setTransmission("");
        setTransmissionId(null);
        setDriveType("");
        setDriveTypeId(null);
        setSeats(5);
        setDoors(4);
        setDailyPrice(50);
        setWeeklyPrice(300);
        setMonthlyPrice(1000);
        setLocation("Colombo");
        setDescription("Newly added vehicle");
        setAvailableFrom("");
        setAvailableUntil("");
        setDeliveryFee(0);
    };

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Basic validation
        if (!makeId || !modelId || !year || !bodyTypeId) {
            console.warn("Validation failed: Missing required fields");
            return;
        }

        // If vehicle NOT found, we need the manual inputs
        if (!searchResult?.available && (!fuelTypeId || !transmissionId || !driveTypeId)) {
            console.warn("Validation failed: Missing manual specs for new vehicle");
            return;
        }

        setLoading(true);

        try {
            // Prepare registration request
            const request = {
                vehicleId: searchResult?.vehicleId,
                makeId,
                modelId,
                year,
                fuelTypeId: fuelTypeId || 0,
                transmissionId: transmissionId || 0,
                driveTypeId: driveTypeId || 0,
                seats,
                doors,
                // userId is now handled by backend
                bodyTypeId,
                location,
                pricePerDay: dailyPrice,
                pricePerWeek: weeklyPrice,
                pricePerMonth: monthlyPrice,
                description,
                availableFrom: availableFrom || undefined,
                availableUntil: availableUntil || undefined,
                deliveryFee: deliveryFee
            };

            console.log("🚀 Submitting simplified registration:", request);
            const response = await VehicleService.registerVehicleSimplified(request);

            if (response.success) {
                console.log("✅ Vehicle registered successfully");
                // Notify parent to refresh list
                const name = `${year} ${make} ${model}`.trim();
                await onAdd();
                resetForm();
                onClose();
            } else {
                throw new Error(response.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error in submit:", error);
            alert("Failed to add vehicle. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const vehicleFound = searchResult?.available === true;
    const vehicleNotFound = searchResult?.available === false;

    // Use derived state for muted fields
    const isMuted = vehicleFound && !isSearching;

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
                    {/* Search Section */}
                    <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Search className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-slate-300">Search Vehicle</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Make Input */}
                            <AutocompleteInput
                                label="Make"
                                value={make}
                                onChange={(val) => {
                                    setMake(val);
                                    const found = makes.find(m => m.name.toLowerCase() === val.toLowerCase());
                                    setMakeId(found?.id || null);
                                }}
                                options={makes}
                                loading={makesLoading}
                                placeholder="Type..."
                                required
                                onSelect={(opt) => {
                                    setMake(opt.name);
                                    setMakeId(opt.id);
                                }}
                            />

                            {/* Model Input */}
                            <AutocompleteInput
                                label="Model"
                                value={model}
                                onChange={(val) => {
                                    setModel(val);
                                    const found = models.find(m => m.name.toLowerCase() === val.toLowerCase());
                                    setModelId(found?.id || null);
                                }}
                                options={models}
                                loading={modelsLoading}
                                disabled={!make}
                                placeholder={!make ? "Select make" : "Type..."}
                                required
                                onSelect={(opt) => {
                                    setModel(opt.name);
                                    setModelId(opt.id);
                                }}
                            />

                            {/* Year Input */}
                            <AutocompleteInput
                                label="Year"
                                value={yearInput}
                                onChange={(val) => {
                                    setYearInput(val);
                                    const numVal = parseInt(val);
                                    if (!isNaN(numVal) && numVal >= 1900 && numVal <= currentYear) {
                                        setYear(numVal);
                                    } else {
                                        setYear(null);
                                    }
                                }}
                                options={years}
                                disabled={!model}
                                placeholder={!model ? "Select model" : "Year..."}
                                required
                                onSelect={(opt) => {
                                    setYearInput(opt.name);
                                    setYear(opt.id);
                                }}
                            />

                            {/* Inline Add Button */}
                            <div className="flex items-end pb-0.5">
                                <Button
                                    type="submit"
                                    disabled={loading || isSearching || !searchResult || !bodyTypeId}
                                    className="w-full h-11 bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Car className="w-4 h-4 mr-2" />
                                            Add
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Search Status */}
                    {isSearching && (
                        <div className="flex items-center justify-center gap-2 py-4 text-slate-400">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Searching vehicle database...</span>
                        </div>
                    )}

                    {/* Technical Specifications Section (Enabled/Disabled based on search) */}
                    {(make && model && yearInput) && !isSearching && (
                        <div className={cn(
                            "rounded-xl border p-4 transition-all duration-300",
                            isMuted ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"
                        )}>
                            <div className="flex items-center gap-2 mb-4">
                                {isMuted ? (
                                    <>
                                        <Check className="w-5 h-5 text-emerald-400" />
                                        <span className="text-emerald-400 font-semibold">Vehicle Specs Found</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-5 h-5 text-amber-400" />
                                        <span className="text-amber-400 font-semibold">Manual Specification Entry</span>
                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Fuel Type */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Fuel Type</label>
                                    <select
                                        value={fuelTypeId || ""}
                                        onChange={(e) => {
                                            const id = Number(e.target.value);
                                            setFuelTypeId(id);
                                            setFuelType(fuelTypes.find(f => f.id === id)?.name || "");
                                        }}
                                        disabled={isMuted}
                                        className={cn(
                                            "w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all cursor-pointer",
                                            isMuted && "opacity-60 cursor-not-allowed bg-slate-900/50"
                                        )}
                                        required
                                    >
                                        <option value="" disabled>Select</option>
                                        {fuelTypes.map((f) => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Transmission */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Transmission</label>
                                    <select
                                        value={transmissionId || ""}
                                        onChange={(e) => {
                                            const id = Number(e.target.value);
                                            setTransmissionId(id);
                                            setTransmission(transmissions.find(t => t.id === id)?.name || "");
                                        }}
                                        disabled={isMuted}
                                        className={cn(
                                            "w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all cursor-pointer",
                                            isMuted && "opacity-60 cursor-not-allowed bg-slate-900/50"
                                        )}
                                        required
                                    >
                                        <option value="" disabled>Select</option>
                                        {transmissions.map((t) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Drive Type */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Drive Type</label>
                                    <select
                                        value={driveTypeId || ""}
                                        onChange={(e) => {
                                            const id = Number(e.target.value);
                                            setDriveTypeId(id);
                                            setDriveType(driveTypes.find(d => d.id === id)?.name || "");
                                        }}
                                        disabled={isMuted}
                                        className={cn(
                                            "w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all cursor-pointer",
                                            isMuted && "opacity-60 cursor-not-allowed bg-slate-900/50"
                                        )}
                                        required
                                    >
                                        <option value="" disabled>Select</option>
                                        {driveTypes.map((d) => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Seats */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Seats</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={seats}
                                        onChange={(e) => setSeats(Number(e.target.value))}
                                        disabled={isMuted}
                                        className={cn(
                                            "w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all",
                                            isMuted && "opacity-60 cursor-not-allowed bg-slate-900/50"
                                        )}
                                        required
                                    />
                                </div>

                                {/* Doors */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Doors</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={doors}
                                        onChange={(e) => setDoors(Number(e.target.value))}
                                        disabled={isMuted}
                                        className={cn(
                                            "w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all",
                                            isMuted && "opacity-60 cursor-not-allowed bg-slate-900/50"
                                        )}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Body Type & Pricing - Show as soon as vehicle is selected */}
                    {(make && model && yearInput) && !isSearching && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Body Type</label>
                                <select
                                    value={bodyType}
                                    onChange={(e) => {
                                        const selected = bodyTypes.find(bt => bt.name === e.target.value);
                                        setBodyType(e.target.value);
                                        setBodyTypeId(selected?.id || null);
                                    }}
                                    className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all cursor-pointer"
                                    required
                                    disabled={bodyTypesLoading}
                                >
                                    <option value="" disabled>
                                        {bodyTypesLoading ? "Loading..." : "Select type"}
                                    </option>
                                    {bodyTypes.map((bt) => (
                                        <option key={bt.id} value={bt.name}>{bt.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Daily Price ($)</label>
                                <input
                                    type="number"
                                    value={dailyPrice}
                                    onChange={(e) => setDailyPrice(Number(e.target.value))}
                                    className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Weekly Price ($)</label>
                                <input
                                    type="number"
                                    value={weeklyPrice}
                                    onChange={(e) => setWeeklyPrice(Number(e.target.value))}
                                    className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Monthly Price ($)</label>
                                <input
                                    type="number"
                                    value={monthlyPrice}
                                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                                    className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Available From</label>
                                <input
                                    type="date"
                                    value={availableFrom}
                                    onChange={(e) => setAvailableFrom(e.target.value)}
                                    className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Available Until</label>
                                <input
                                    type="date"
                                    value={availableUntil}
                                    onChange={(e) => setAvailableUntil(e.target.value)}
                                    min={availableFrom}
                                    className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Delivery Fee ($)</label>
                                <input
                                    type="number"
                                    value={deliveryFee}
                                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                                    className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all font-mono"
                                    placeholder="Static delivery charge"
                                />
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-3">
                                <label className="text-sm font-medium text-slate-300">Location / Pick-up Point</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full h-11 rounded-xl bg-slate-800/50 px-4 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all"
                                    placeholder="e.g. Colombo, Airport, etc."
                                    required
                                />
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-3">
                                <label className="text-sm font-medium text-slate-300">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-11 rounded-xl bg-slate-800/50 px-4 py-2 text-sm text-white outline-none ring-1 ring-white/5 focus:ring-primary/50 transition-all resize-none"
                                    placeholder="Brief description of the vehicle"
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="flex-1 border-white/10 hover:bg-white/5 text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || isSearching || !bodyTypeId || !makeId || !modelId || !year}
                            className="flex-1"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Register Vehicle
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}
