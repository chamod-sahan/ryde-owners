"use client";

import React, { useEffect, useState } from "react";
import { Shield, Info, Check, Save, Loader2, RefreshCw, Globe, Car, ChevronRight, DollarSign } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import insuranceService, { OwnerInsurance, InsuranceUpdateRequest, InsuranceTemplate } from "@/services/insuranceService";
import { VehicleService } from "@/services/vehicleService";
import { ProfileService } from "@/services/profileService";
import { cn } from "@/lib/utils";

export default function InsuranceManagementPage() {
    const [user, setUser] = useState<any>(null);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [insurances, setInsurances] = useState<OwnerInsurance[]>([]);
    const [templates, setTemplates] = useState<InsuranceTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [settingUp, setSettingUp] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    // Insurance type icons/images
    const getInsuranceIcon = (type: string) => {
        switch (type.toUpperCase()) {
            case 'BASIC':
                return '🛡️';
            case 'STANDARD':
                return '⭐';
            case 'PREMIUM':
                return '💎';
            default:
                return '📋';
        }
    };

    const loadInitialData = async () => {
        setLoading(true);
        try {
            // Step 1: Load profile first - this is required for everything else
            console.log("[Insurance] Step 1: Loading profile...");
            const profileRes = await ProfileService.getProfile() as any;
            console.log("[Insurance] Profile response:", profileRes);

            // Handle both formats: { success: true, data: {...} } or direct user object
            const userData = profileRes?.data || (profileRes?.id ? profileRes : null);

            if (!userData || !userData.id) {
                console.error("[Insurance] Profile failed or no data:", profileRes);
                alert("Failed to load user profile. Please login again.");
                setLoading(false);
                return;
            }

            console.log("[Insurance] User loaded:", userData.id);
            setUser(userData);

            // Step 2: Load insurance templates (BASIC, STANDARD, PREMIUM)
            console.log("[Insurance] Step 2: Loading insurance templates...");
            try {
                let templatesData = await insuranceService.getInsuranceTemplates();
                console.log("[Insurance] Templates loaded:", templatesData);

                if (!templatesData || templatesData.length === 0) {
                    console.warn("[Insurance] No templates found. Initializing from backend...");
                    try {
                        await insuranceService.initInsuranceTemplates();
                        templatesData = await insuranceService.getInsuranceTemplates();
                        console.log("[Insurance] Templates reloaded after init:", templatesData);
                    } catch (initError) {
                        console.error("[Insurance] Failed to initialize templates:", initError);
                    }
                }

                setTemplates(templatesData || []);

                if (!templatesData || templatesData.length === 0) {
                    console.warn("[Insurance] No templates found after initialization attempt.");
                    alert("Insurance templates not found. Please contact admin to initialize insurance types.");
                }
            } catch (err) {
                console.error("[Insurance] Failed to load templates:", err);
                alert("Failed to load insurance templates. Please ensure the backend is running.");
                setTemplates([]);
            }

            // Step 3: Load owner-level insurances (user's custom pricing)
            console.log("[Insurance] Step 3: Loading owner insurances for user:", userData.id);
            try {
                const ownerInsurancesData = await insuranceService.getOwnerInsurances(userData.id);
                console.log("[Insurance] Owner insurances loaded:", ownerInsurancesData);

                if (ownerInsurancesData && ownerInsurancesData.length > 0) {
                    console.log(`[Insurance] ✓ Found ${ownerInsurancesData.length} owner insurances`);
                    setInsurances(ownerInsurancesData);
                } else {
                    console.log("[Insurance] ✗ No owner insurances found - user needs to initialize");
                    setInsurances([]);
                }
            } catch (insError: any) {
                console.error("[Insurance] Failed to load owner insurances:", insError);
                // If 404, user hasn't set up yet - this is normal
                if (insError?.response?.status === 404 || insError?.status === 404) {
                    console.log("[Insurance] Owner insurances not found (404) - first time setup needed");
                    setInsurances([]);
                } else {
                    console.error("[Insurance] Unexpected error loading owner insurances:", insError);
                    setInsurances([]);
                }
            }

            // Step 4: Load vehicles (for display purposes)
            console.log("[Insurance] Step 4: Loading vehicles...");
            try {
                const response = await VehicleService.getMyVehicles() as any;
                const vehiclesData = response.data?.vehicles || response.vehicles || (Array.isArray(response) ? response : []);
                console.log(`[Insurance] Loaded ${vehiclesData.length} vehicles`);
                setVehicles(vehiclesData);
            } catch (vehError) {
                console.error("[Insurance] Failed to load vehicles:", vehError);
                setVehicles([]);
            }
        } catch (error) {
            console.error("[Insurance] Fatal error in loadInitialData:", error);
            alert("Failed to load insurance page. Please refresh and try again.");
        } finally {
            setLoading(false);
        }
    };

    const loadOwnerInsurances = async (ownerId: number) => {
        console.log("[Insurance] Loading owner insurances for:", ownerId);
        try {
            const data = await insuranceService.getOwnerInsurances(ownerId);
            console.log("[Insurance] Owner insurances:", data);
            setInsurances(data);
        } catch (error) {
            console.error("[Insurance] Failed to load owner insurances:", error);
            setInsurances([]);
        }
    };

    const handleSetupDefaults = async () => {
        if (!user?.id) {
            alert("User not loaded. Please refresh the page.");
            return;
        }

        console.log("===========================================");
        console.log("[Insurance] SETUP: Starting insurance setup for owner:", user.id);
        console.log("===========================================");

        setSettingUp(true);
        try {
            // Call setup endpoint
            console.log("[Insurance] SETUP: Calling setupOwnerDefaults...");
            const result = await insuranceService.setupOwnerDefaults(user.id);
            console.log("[Insurance] SETUP: Result received:", result);
            console.log("[Insurance] SETUP: Number of insurances created:", result?.length || 0);

            // Verify the result
            if (!result || result.length === 0) {
                console.error("[Insurance] SETUP: ✗ Setup returned empty array!");
                alert("Setup completed but no insurances were created. Please check:\n1. Backend is running\n2. Insurance templates exist\n3. Check browser console for errors");
                return;
            }

            // Display what was created
            console.log("[Insurance] SETUP: Created insurances:");
            result.forEach((ins: any) => {
                console.log(`  - ${ins.insuranceType}: USD ${ins.dailyPrice}/day`);
            });

            // Update state
            setInsurances(result);
            console.log("[Insurance] SETUP: ✓ State updated with insurances");

            // Success message
            alert(`✓ Success! ${result.length} insurance tiers initialized:\n${result.map((i: any) => `- ${i.insuranceType}: USD ${i.dailyPrice}/day`).join('\n')}`);

        } catch (error: any) {
            console.error("===========================================");
            console.error("[Insurance] SETUP: ✗ Error occurred:", error);
            console.error("===========================================");

            let errorMsg = 'Unknown error occurred';

            if (error?.response) {
                console.error("[Insurance] SETUP: Response error:", error.response);
                errorMsg = error.response?.data?.message || error.response?.statusText || 'Server error';
            } else if (error?.message) {
                errorMsg = error.message;
            }

            alert(`Failed to initialize insurance:\n${errorMsg}\n\nPlease check:\n1. Backend is running\n2. You are logged in as car owner\n3. Insurance templates are initialized`);
        } finally {
            setSettingUp(false);
            console.log("===========================================");
            console.log("[Insurance] SETUP: Completed");
            console.log("===========================================");
        }
    };

    const handleUpdatePrice = (id: number, field: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setInsurances(prev => prev.map(ins =>
            ins.id === id ? { ...ins, [field]: numValue } : ins
        ));
    };

    const handleSave = async (insurance: OwnerInsurance) => {
        setSavingId(insurance.id);
        try {
            const request: InsuranceUpdateRequest = {
                dailyPrice: insurance.dailyPrice,
                weeklyPrice: insurance.weeklyPrice,
                monthlyPrice: insurance.monthlyPrice,
                isActive: insurance.isActive
            };
            await insuranceService.updateOwnerInsurance(insurance.id, request);
            console.log("[Insurance] Saved insurance:", insurance.id);
        } catch (error) {
            console.error("[Insurance] Failed to save insurance:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setSavingId(null);
        }
    };

    const handleToggleActive = (id: number, isActive: boolean) => {
        setInsurances(prev => prev.map(ins =>
            ins.id === id ? { ...ins, isActive } : ins
        ));
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                Loading Insurance Management...
            </div>
        );
    }

    const hasAllTiers = insurances.some(i => i.insuranceType === 'BASIC') &&
        insurances.some(i => i.insuranceType === 'STANDARD') &&
        insurances.some(i => i.insuranceType === 'PREMIUM');

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Insurance Pricing</h1>
                    <p className="text-slate-400 mt-1">
                        Configure global insurance pricing for your entire fleet.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => user?.id && loadOwnerInsurances(user.id)}
                        className="rounded-xl border-white/5 bg-white/5 text-slate-400 hover:text-white"
                    >
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </Button>

                    {!hasAllTiers && (
                        <Button
                            onClick={handleSetupDefaults}
                            disabled={settingUp}
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl"
                        >
                            {settingUp ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                            Initialize Insurance Tiers
                        </Button>
                    )}
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex gap-4">
                <Globe className="h-6 w-6 text-primary shrink-0" />
                <div>
                    <h5 className="text-base font-semibold text-primary uppercase tracking-wider text-[11px]">Global Insurance Pricing</h5>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                        Set your insurance pricing once and it applies to <strong>all {vehicles.length} vehicles</strong> in your fleet.
                        Renters will see these options when booking any of your vehicles.
                    </p>
                </div>
            </div>

            {/* Insurance Tiers */}
            {insurances.length > 0 ? (
                <div className="space-y-6">
                    {[...insurances].sort((a, b) => {
                        const order = { 'BASIC': 0, 'STANDARD': 1, 'PREMIUM': 2 };
                        return (order[a.insuranceType] ?? 4) - (order[b.insuranceType] ?? 4);
                    }).map((ins) => (
                        <GlassCard key={ins.id} className="p-8 relative overflow-hidden group">
                            {/* Background Glow */}
                            <div className={cn(
                                "absolute -right-12 -top-12 h-40 w-40 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20",
                                ins.insuranceType === 'BASIC' ? "bg-emerald-500" :
                                    ins.insuranceType === 'STANDARD' ? "bg-blue-500" : "bg-purple-500"
                            )} />

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                                {/* Left: Info */}
                                <div className="lg:col-span-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="text-3xl">{getInsuranceIcon(ins.insuranceType)}</div>
                                        <div className="flex flex-col gap-1">
                                            <span className={cn(
                                                "text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider",
                                                ins.insuranceType === 'BASIC' ? "bg-emerald-500/20 text-emerald-400" :
                                                    ins.insuranceType === 'STANDARD' ? "bg-blue-500/20 text-blue-400" :
                                                        "bg-purple-500/20 text-purple-400"
                                            )}>
                                                {ins.insuranceType}
                                            </span>
                                            {ins.insuranceType === 'BASIC' && (
                                                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full border border-emerald-500/10 font-bold">
                                                    ALWAYS INCLUDED
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-bold text-white mb-2">{ins.insuranceName}</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{ins.insuranceDescription}</p>

                                    {/* Coverage Points */}
                                    {ins.coveragePoints && ins.coveragePoints.length > 0 && (
                                        <div className="space-y-2">
                                            <h5 className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                <ChevronRight className="h-3 w-3" />
                                                Coverage Includes
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {ins.coveragePoints.map((point, idx) => (
                                                    <div key={idx} className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                                                        <Check className="h-2.5 w-2.5 text-primary" />
                                                        <span className="text-[10px] text-slate-300 font-medium">{point.trim()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Pricing */}
                                <div className="lg:col-span-8 flex flex-col justify-between gap-6">
                                    {ins.insuranceType === 'BASIC' ? (
                                        <div className="flex items-center justify-center h-full py-8 px-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                            <div className="text-center">
                                                <Shield className="h-12 w-12 text-emerald-500/50 mx-auto mb-4" />
                                                <h3 className="text-white font-semibold text-lg">Free for All Renters</h3>
                                                <p className="text-slate-400 text-sm max-w-md mt-2">
                                                    Basic coverage is automatically included with every booking at no extra cost.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-3 gap-6">
                                                <PriceInput
                                                    label="Daily Price"
                                                    value={ins.dailyPrice}
                                                    onChange={(v) => handleUpdatePrice(ins.id, 'dailyPrice', v)}
                                                    currency="USD"
                                                />
                                                <PriceInput
                                                    label="Weekly Price"
                                                    value={ins.weeklyPrice}
                                                    onChange={(v) => handleUpdatePrice(ins.id, 'weeklyPrice', v)}
                                                    currency="USD"
                                                />
                                                <PriceInput
                                                    label="Monthly Price"
                                                    value={ins.monthlyPrice}
                                                    onChange={(v) => handleUpdatePrice(ins.id, 'monthlyPrice', v)}
                                                    currency="USD"
                                                />
                                            </div>

                                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                                <label className="flex items-center gap-3 cursor-pointer group/toggle">
                                                    <div className={cn(
                                                        "h-5 w-9 rounded-full relative transition-all duration-300",
                                                        ins.isActive ? "bg-primary" : "bg-white/10"
                                                    )}>
                                                        <div className={cn(
                                                            "absolute top-1 left-1 h-3 w-3 rounded-full bg-white transition-all duration-300",
                                                            ins.isActive ? "translate-x-4" : "translate-x-0"
                                                        )} />
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={ins.isActive}
                                                        onChange={(e) => handleToggleActive(ins.id, e.target.checked)}
                                                    />
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover/toggle:text-slate-200 transition-colors">
                                                        Visible to Renters
                                                    </span>
                                                </label>

                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSave(ins)}
                                                    disabled={savingId === ins.id}
                                                    className="h-10 px-6 rounded-xl bg-white/10 hover:bg-white hover:text-slate-900 border-0 transition-all font-bold text-xs"
                                                >
                                                    {savingId === ins.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    ) : (
                                                        <Save className="h-4 w-4 mr-2" />
                                                    )}
                                                    {savingId === ins.id ? 'Saving...' : 'Save Pricing'}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Templates Header */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex gap-4">
                        <Info className="h-6 w-6 text-amber-500 shrink-0" />
                        <div>
                            <h5 className="text-base font-semibold text-amber-400 uppercase tracking-wider text-[11px]">Setup Required</h5>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                                Below are the <strong>three insurance tiers</strong> available on the platform.
                                Click "Initialize My Pricing" to set up your custom rates for each tier.
                            </p>
                        </div>
                    </div>

                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...templates].sort((a, b) => {
                            const order: Record<string, number> = { 'BASIC': 0, 'STANDARD': 1, 'PREMIUM': 2 };
                            return (order[a.insuranceType] ?? 4) - (order[b.insuranceType] ?? 4);
                        }).map((template) => {
                            let coverageList: string[] = [];
                            try {
                                coverageList = template.coveragePoints
                                    ? JSON.parse(template.coveragePoints) as string[]
                                    : [];
                            } catch (e) {
                                console.error("[Insurance] Failed to parse coveragePoints:", e);
                            }

                            return (
                                <GlassCard key={template.id} className="p-6 relative overflow-hidden group">
                                    {/* Background Glow */}
                                    <div className={cn(
                                        "absolute -right-8 -top-8 h-24 w-24 rounded-full blur-[60px] opacity-10 transition-opacity group-hover:opacity-20",
                                        template.insuranceType === 'BASIC' ? "bg-emerald-500" :
                                            template.insuranceType === 'STANDARD' ? "bg-blue-500" : "bg-purple-500"
                                    )} />

                                    <div className="relative z-10">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-3xl">{getInsuranceIcon(template.insuranceType)}</div>
                                                <span className={cn(
                                                    "text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider",
                                                    template.insuranceType === 'BASIC' ? "bg-emerald-500/20 text-emerald-400" :
                                                        template.insuranceType === 'STANDARD' ? "bg-blue-500/20 text-blue-400" :
                                                            "bg-purple-500/20 text-purple-400"
                                                )}>
                                                    {template.insuranceType}
                                                </span>
                                            </div>
                                            {template.isDefault && (
                                                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                                                    INCLUDED
                                                </span>
                                            )}
                                        </div>

                                        {/* Name & Description */}
                                        <h4 className="text-lg font-bold text-white mb-2">{template.name}</h4>
                                        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{template.description}</p>

                                        {/* Price Range */}
                                        <div className="bg-white/5 rounded-xl p-4 mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="h-4 w-4 text-primary" />
                                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Suggested Price Range</span>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-white">
                                                    {template.dailyPrice === 0 ? 'FREE' : `${template.currency} ${template.dailyPrice.toLocaleString()}`}
                                                </span>
                                                {template.dailyPrice > 0 && (
                                                    <span className="text-xs text-slate-500">/day</span>
                                                )}
                                            </div>
                                            {template.dailyPrice > 0 && (
                                                <div className="flex gap-4 mt-2 text-[10px] text-slate-500">
                                                    <span>Weekly: {template.currency} {template.weeklyPrice.toLocaleString()}</span>
                                                    <span>Monthly: {template.currency} {template.monthlyPrice.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Coverage Points */}
                                        {coverageList.length > 0 && (
                                            <div className="space-y-1.5">
                                                {coverageList.slice(0, 3).map((point, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <Check className="h-3 w-3 text-primary shrink-0" />
                                                        <span className="text-[11px] text-slate-300">{point}</span>
                                                    </div>
                                                ))}
                                                {coverageList.length > 3 && (
                                                    <span className="text-[10px] text-slate-500 ml-5">+{coverageList.length - 3} more</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>

                    {/* Setup Button */}
                    <div className="flex justify-center pt-4">
                        <Button
                            onClick={handleSetupDefaults}
                            disabled={settingUp || !user?.id}
                            className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 h-14 px-10 rounded-2xl text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {settingUp ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <Shield className="h-5 w-5 mr-3" />}
                            {!user?.id ? 'Loading...' : 'Initialize My Pricing'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Fleet Info */}
            {vehicles.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Car className="h-5 w-5 text-primary" />
                        <h5 className="text-sm font-semibold text-white">Your Fleet ({vehicles.length} vehicles)</h5>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">
                        The insurance pricing above applies to all these vehicles:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {vehicles.slice(0, 10).map((v) => (
                            <div key={v.id} className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                <span className="text-xs text-slate-300 font-medium">{v.make} {v.model}</span>
                                <span className="text-[10px] text-slate-500 ml-2">{v.year}</span>
                            </div>
                        ))}
                        {vehicles.length > 10 && (
                            <div className="bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                                <span className="text-xs text-primary font-medium">+{vehicles.length - 10} more</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex gap-4">
                    <Info className="h-6 w-6 text-amber-500 shrink-0" />
                    <div>
                        <h5 className="text-[11px] font-black text-amber-500 uppercase tracking-widest">Pricing Tip</h5>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Setting competitive prices for <strong>Standard Protection</strong> can increase your booking value by 15-20%.
                        </p>
                    </div>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex gap-4">
                    <Shield className="h-6 w-6 text-primary shrink-0" />
                    <div>
                        <h5 className="text-[11px] font-black text-primary uppercase tracking-widest">Customer Trust</h5>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            <strong>Premium Full Cover</strong> gives renters peace of mind and often leads to better care of your vehicle.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PriceInput({ label, value, onChange, currency = 'USD', disabled }: { label: string, value: number, onChange: (v: string) => void, currency?: string, disabled?: boolean }) {
    return (
        <div className="space-y-2 flex-1 group">
            <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black px-1 group-hover:text-primary/70 transition-colors">{label}</span>
            <div className={cn(
                "relative transition-all",
                disabled && "opacity-50 grayscale pointer-events-none"
            )}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-slate-500 text-[10px] font-black tracking-tighter">{currency}</span>
                </div>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="w-full bg-slate-900/40 border border-white/5 group-hover:border-primary/30 rounded-2xl h-12 pl-12 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold shadow-inner"
                />
            </div>
        </div>
    );
}
