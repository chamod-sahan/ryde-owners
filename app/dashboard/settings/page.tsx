"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Phone, Camera, Save, Trash2, Building, MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileService } from "@/services/profileService";
import { UserResponse } from "@/types/api";
import Image from "next/image";

export default function SettingsPage() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await ProfileService.getProfile();
            if (response.success) {
                setUser(response.data);
                setFirstName(response.data.firstName || "");
                setLastName(response.data.lastName || "");
                // Assuming phoneNumber might be in the first primary address or we'll add it later
                setPhoneNumber(response.data.addresses?.find(a => a.isPrimary)?.phoneNumber || "");
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
            setMessage({ type: 'error', text: "Failed to load profile data." });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage(null);
            const response = await ProfileService.updateProfile({
                firstName,
                lastName,
                phoneNumber
            });
            if (response.success) {
                setUser(response.data);
                setMessage({ type: 'success', text: "Profile updated successfully!" });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Failed to update profile." });
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: "Please upload an image file." });
            return;
        }

        try {
            setUploading(true);
            setMessage(null);
            const response = await ProfileService.uploadLogo(file);
            if (response.success) {
                await fetchProfile(); // Refresh to get the new logoUrl
                setMessage({ type: 'success', text: "Logo uploaded successfully!" });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Failed to upload logo." });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemoveLogo = async () => {
        if (!confirm("Are you sure you want to remove your logo?")) return;

        try {
            setUploading(true);
            const response = await ProfileService.deleteLogo();
            if (response.success) {
                await fetchProfile();
                setMessage({ type: 'success', text: "Logo removed." });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Failed to remove logo." });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="mt-2 text-slate-400">Manage your profile, branding, and account preferences.</p>
            </div>

            {message && (
                <div className={cn(
                    "flex items-center gap-3 rounded-xl p-4 text-sm font-medium animate-in zoom-in-95 duration-300",
                    message.type === 'success' ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20" : "bg-destructive/10 text-destructive ring-1 ring-destructive/20"
                )}>
                    {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    {message.text}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Branding Section */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="rounded-2xl border border-white/5 bg-[#0B0F19]/50 p-6 backdrop-blur-xl">
                        <h2 className="text-lg font-semibold text-white">Owner Branding</h2>
                        <p className="mt-1 text-xs text-slate-400">This logo will be displayed on your car listings and profile.</p>

                        <div className="mt-6 flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="h-32 w-32 overflow-hidden rounded-2xl bg-[#1a2133] ring-1 ring-white/10 transition-all group-hover:ring-primary/50">
                                    {user?.logoUrl ? (
                                        <Image
                                            src={user.logoUrl}
                                            alt="Owner Logo"
                                            width={128}
                                            height={128}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Building className="h-10 w-10 text-slate-600" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
                                    disabled={uploading}
                                >
                                    {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleLogoUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {user?.logoUrl && (
                                <button
                                    onClick={handleRemoveLogo}
                                    className="text-xs font-medium text-destructive transition-colors hover:text-destructive/80"
                                    disabled={uploading}
                                >
                                    Remove Logo
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats/Info */}
                    <div className="rounded-2xl border border-white/5 bg-[#0B0F19]/50 p-6 backdrop-blur-xl">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider opacity-50">Account Info</h3>
                        <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <CheckCircle className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Email Status</p>
                                    <p className="text-sm font-medium text-white">{user?.emailVerified ? "Verified" : "Pending"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Role</p>
                                    <p className="text-sm font-medium text-white">{user?.roles.join(', ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSaveProfile} className="rounded-2xl border border-white/5 bg-[#0B0F19]/50 p-8 backdrop-blur-xl transition-all hover:bg-[#0B0F19]/60">
                        <h2 className="text-xl font-bold text-white">General Information</h2>
                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">First Name</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full rounded-xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-white outline-none ring-1 ring-white/5 transition-all focus:bg-white/10 focus:ring-primary/50"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Last Name</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full rounded-xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-white outline-none ring-1 ring-white/5 transition-all focus:bg-white/10 focus:ring-primary/50"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-400">Email Address</label>
                                <div className="relative opacity-60">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="w-full rounded-xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-white cursor-not-allowed"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-slate-600 bg-white/5 px-2 py-1 rounded">Locked</span>
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-400">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full rounded-xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-white outline-none ring-1 ring-white/5 transition-all focus:bg-white/10 focus:ring-primary/50"
                                        placeholder="+94 77 123 4567"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </button>
                        </div>
                    </form>

                    {/* Addresses Section */}
                    <div className="rounded-2xl border border-white/5 bg-[#0B0F19]/50 p-8 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Business Locations</h2>
                            <button className="text-sm font-medium text-primary hover:underline">Add Location</button>
                        </div>
                        <div className="mt-6 space-y-4">
                            {user?.addresses && user.addresses.length > 0 ? (
                                user.addresses.map((address) => (
                                    <div key={address.id} className="flex items-start justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="flex gap-3">
                                            <div className="p-2 rounded-lg bg-white/5 text-slate-400">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-white">{address.businessName}</h4>
                                                <p className="text-sm text-slate-400">{address.streetAddress}, {address.city}</p>
                                                <div className="mt-2 flex gap-2">
                                                    {address.isPrimary && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-primary/20">Primary</span>}
                                                    <span className="text-[10px] bg-white/10 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{address.addressType}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-slate-500 hover:text-white transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-slate-500 italic text-sm">
                                    No business locations added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
