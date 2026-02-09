"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Package, Save, Loader2, Info } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ProfileService } from "@/services/profileService";
import { extraEquipmentService, ExtraEquipmentTemplate, OwnerExtraEquipment } from "@/services/extraEquipmentService";
import { cn } from "@/lib/utils";

interface DraftEquipment {
    basePrice: number;
    fullPrice: number;
    isAvailable: boolean;
    notes: string;
}

export default function EquipmentManagementPage() {
    const [user, setUser] = useState<any>(null);
    const [templates, setTemplates] = useState<ExtraEquipmentTemplate[]>([]);
    const [ownerEquipments, setOwnerEquipments] = useState<OwnerExtraEquipment[]>([]);
    const [drafts, setDrafts] = useState<Record<number, DraftEquipment>>({});
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    useEffect(() => {
        loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ownerByEquipmentId = useMemo(() => {
        const map = new Map<number, OwnerExtraEquipment>();
        ownerEquipments.forEach((item) => map.set(item.extraEquipmentId, item));
        return map;
    }, [ownerEquipments]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const profileRes = await ProfileService.getProfile() as any;
            const userData = profileRes?.data || (profileRes?.id ? profileRes : null);

            if (!userData?.id) {
                alert("Failed to load user profile. Please login again.");
                setLoading(false);
                return;
            }

            setUser(userData);

            const equipmentTemplates = await extraEquipmentService.getCommonEquipments();
            setTemplates(equipmentTemplates || []);

            const ownerData = await extraEquipmentService.getOwnerEquipments(userData.id);
            setOwnerEquipments(ownerData || []);

            const nextDrafts: Record<number, DraftEquipment> = {};
            equipmentTemplates.forEach((template) => {
                const ownerItem = ownerData?.find((item) => item.extraEquipmentId === template.id);
                nextDrafts[template.id] = {
                    basePrice: ownerItem?.basePrice ?? 0,
                    fullPrice: ownerItem?.fullPrice ?? ownerItem?.basePrice ?? 0,
                    isAvailable: ownerItem?.isAvailable ?? false,
                    notes: ownerItem?.notes ?? "",
                };
            });
            setDrafts(nextDrafts);
        } catch (error) {
            console.error("[Equipment] Failed to load data:", error);
            alert("Failed to load equipment management data. Please refresh and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDraftChange = (equipmentId: number, field: keyof DraftEquipment, value: string | boolean) => {
        setDrafts((prev) => {
            const current = prev[equipmentId] || { basePrice: 0, fullPrice: 0, isAvailable: false, notes: "" };
            return {
                ...prev,
                [equipmentId]: {
                    ...current,
                    [field]: typeof value === "string" ? (field === "notes" ? value : parseFloat(value) || 0) : value,
                },
            };
        });
    };

    const upsertOwnerEquipment = (updated: OwnerExtraEquipment) => {
        setOwnerEquipments((prev) => {
            const index = prev.findIndex((item) => item.id === updated.id);
            if (index >= 0) {
                const next = [...prev];
                next[index] = updated;
                return next;
            }

            const existingByEquipment = prev.findIndex((item) => item.extraEquipmentId === updated.extraEquipmentId);
            if (existingByEquipment >= 0) {
                const next = [...prev];
                next[existingByEquipment] = updated;
                return next;
            }

            return [...prev, updated];
        });
    };

    const handleToggle = async (template: ExtraEquipmentTemplate) => {
        const draft = drafts[template.id];
        if (!draft) return;

        const ownerItem = ownerByEquipmentId.get(template.id);
        const nextAvailability = !draft.isAvailable;

        setTogglingId(template.id);
        try {
            let updated: OwnerExtraEquipment | null = null;

            if (nextAvailability) {
                if (ownerItem) {
                    updated = await extraEquipmentService.updateOwnerEquipment(ownerItem.id, {
                        basePrice: draft.basePrice,
                        fullPrice: draft.fullPrice,
                        isAvailable: true,
                        notes: draft.notes,
                    });
                } else {
                    updated = await extraEquipmentService.createOwnerEquipment(user.id, {
                        extraEquipmentId: template.id,
                        basePrice: draft.basePrice,
                        fullPrice: draft.fullPrice,
                        isAvailable: true,
                        notes: draft.notes,
                    });
                }
            } else if (ownerItem) {
                updated = await extraEquipmentService.updateAvailability(ownerItem.id, false);
            }

            if (updated) {
                upsertOwnerEquipment(updated);
                setDrafts((prev) => ({
                    ...prev,
                    [template.id]: {
                        ...prev[template.id],
                        basePrice: updated.basePrice,
                        fullPrice: updated.fullPrice,
                        isAvailable: updated.isAvailable,
                        notes: updated.notes || "",
                    },
                }));
            } else {
                setDrafts((prev) => ({
                    ...prev,
                    [template.id]: {
                        ...prev[template.id],
                        isAvailable: nextAvailability,
                    },
                }));
            }
        } catch (error) {
            console.error("[Equipment] Toggle failed:", error);
            alert("Failed to update equipment availability. Please try again.");
        } finally {
            setTogglingId(null);
        }
    };

    const handleSave = async (template: ExtraEquipmentTemplate) => {
        const draft = drafts[template.id];
        if (!draft) return;

        const ownerItem = ownerByEquipmentId.get(template.id);
        if (!ownerItem) {
            alert("Enable this equipment first to save pricing.");
            return;
        }

        setSavingId(template.id);
        try {
            const updated = await extraEquipmentService.updateOwnerEquipment(ownerItem.id, {
                basePrice: draft.basePrice,
                fullPrice: draft.fullPrice,
                isAvailable: draft.isAvailable,
                notes: draft.notes,
            });

            upsertOwnerEquipment(updated);
            setDrafts((prev) => ({
                ...prev,
                [template.id]: {
                    ...prev[template.id],
                    basePrice: updated.basePrice,
                    fullPrice: updated.fullPrice,
                    isAvailable: updated.isAvailable,
                    notes: updated.notes || "",
                },
            }));
        } catch (error) {
            console.error("[Equipment] Save failed:", error);
            alert("Failed to save pricing. Please try again.");
        } finally {
            setSavingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                Loading Equipment Management...
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Extra Equipment Pricing</h1>
                    <p className="text-slate-400 mt-1">
                        Set global pricing for optional add-ons across your fleet.
                    </p>
                </div>
            </div>

            {templates.length === 0 ? (
                <GlassCard className="p-8">
                    <div className="flex items-start gap-4">
                        <Info className="h-6 w-6 text-amber-400 mt-1" />
                        <div>
                            <h3 className="text-white font-semibold">No equipment templates available</h3>
                            <p className="text-slate-400 text-sm mt-2">
                                Ask an admin to create extra equipment templates before setting prices.
                            </p>
                        </div>
                    </div>
                </GlassCard>
            ) : (
                <div className="space-y-6">
                    {templates.map((template) => {
                        const draft = drafts[template.id] || {
                            basePrice: 0,
                            fullPrice: 0,
                            isAvailable: false,
                            notes: "",
                        };
                        const enabled = draft.isAvailable;
                        const ownerItem = ownerByEquipmentId.get(template.id);

                        return (
                            <GlassCard key={template.id} className="p-6">
                                <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center",
                                                enabled ? "bg-primary/20 text-primary" : "bg-white/5 text-slate-400"
                                            )}>
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{template.equipmentName}</h3>
                                                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                                                    {template.category}
                                                </p>
                                            </div>
                                        </div>
                                        {template.description && (
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                {template.description}
                                            </p>
                                        )}
                                        <div className="text-xs text-slate-500">
                                            Commission: <span className="text-slate-300 font-semibold">{template.commissionPercentage}%</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <PriceInput
                                                label="Base Price"
                                                value={draft.basePrice}
                                                onChange={(v) => handleDraftChange(template.id, "basePrice", v)}
                                                disabled={togglingId === template.id}
                                            />
                                            <PriceInput
                                                label="Full Price"
                                                value={draft.fullPrice}
                                                onChange={(v) => handleDraftChange(template.id, "fullPrice", v)}
                                                disabled={togglingId === template.id}
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/5 pt-4">
                                            <label className="flex items-center gap-3 cursor-pointer group/toggle">
                                                <div className={cn(
                                                    "h-5 w-9 rounded-full relative transition-all duration-300",
                                                    draft.isAvailable ? "bg-primary" : "bg-white/10"
                                                )}>
                                                    <div className={cn(
                                                        "absolute top-1 left-1 h-3 w-3 rounded-full bg-white transition-all duration-300",
                                                        draft.isAvailable ? "translate-x-4" : "translate-x-0"
                                                    )} />
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={draft.isAvailable}
                                                    onChange={() => handleToggle(template)}
                                                    disabled={togglingId === template.id}
                                                />
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover/toggle:text-slate-200 transition-colors">
                                                    {draft.isAvailable ? "Enabled" : "Disabled"}
                                                </span>
                                            </label>

                                            <Button
                                                size="sm"
                                                onClick={() => handleSave(template)}
                                                disabled={savingId === template.id || !ownerItem}
                                                className="h-10 px-6 rounded-xl bg-white/10 hover:bg-white hover:text-slate-900 border-0 transition-all font-bold text-xs"
                                            >
                                                {savingId === template.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <Save className="h-4 w-4 mr-2" />
                                                )}
                                                {savingId === template.id ? "Saving..." : "Save Pricing"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function PriceInput({ label, value, onChange, disabled }: { label: string; value: number; onChange: (v: string) => void; disabled?: boolean }) {
    return (
        <div className="space-y-2 flex-1 group">
            <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black px-1 group-hover:text-primary/70 transition-colors">{label}</span>
            <div className={cn(
                "relative transition-all",
                disabled && "opacity-50 grayscale pointer-events-none"
            )}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-slate-500 text-[10px] font-black tracking-tighter">USD</span>
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
