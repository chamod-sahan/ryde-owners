"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, CheckCircle } from "lucide-react";
import { AuthService } from "@/services/authService";
import { TokenService } from "@/services/tokenService";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const rememberMe = formData.get("rememberMe") === "on";

        if (!email || !password) {
            console.error("Missing credentials in form submission");
            alert("Please fill in all fields");
            setLoading(false);
            return;
        }

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
        <GlassCard className="w-full max-w-md p-8 relative z-10">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 overflow-hidden rounded-xl">
                        <img
                            src="/RYDE_V2-1.png"
                            alt="RYDE Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-slate-400">Sign in to manage your fleet</p>
            </div>

            {registered && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium text-emerald-500">Registration successful!</p>
                        <p className="text-emerald-500/80 mt-1">Please check your email to verify your account before logging in.</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    icon={<Mail className="h-4 w-4" />}
                    required
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="h-4 w-4" />}
                    required
                />

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
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B0F19] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] opacity-20" />
            </div>

            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </main >
    );
}
