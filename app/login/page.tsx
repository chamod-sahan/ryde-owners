"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock } from "lucide-react";
import { AuthService } from "@/services/authService";
import { TokenService } from "@/services/tokenService";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const rememberMe = formData.get("rememberMe") === "on";

        try {
            const response = await AuthService.login({
                email,
                password
            });

            if (response.success) {
                if (response.data.accessToken) {
                    TokenService.setTokens(
                        response.data.accessToken,
                        response.data.refreshToken,
                        rememberMe
                    );
                    TokenService.setUser(response.data.user, rememberMe);
                }
                router.push("/dashboard");
            } else {
                alert(response.message || "Login failed");
            }
        } catch (error: any) {
            alert(error.message || "An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B0F19] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] opacity-20" />
            </div>

            <GlassCard className="w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to manage your fleet</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        icon={<Mail className="h-4 w-4" />}
                        required
                        name="email"
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock className="h-4 w-4" />}
                        required
                        name="password"
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    className="peer h-4 w-4 rounded border-slate-700 bg-slate-800 text-primary focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer appearance-none checked:bg-primary checked:border-primary"
                                />
                                <svg
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>



                <div className="mt-6 text-center text-sm">
                    <span className="text-slate-400">Don't have an account? </span>
                    <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                        Sign up
                    </Link>
                </div>
            </GlassCard>
        </main>
    );
}
