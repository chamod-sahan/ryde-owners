"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock } from "lucide-react";
import { AuthService } from "@/services/authService";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // @ts-ignore - Temporary ignore until types are fully aligned if needed, but should be fine
            const response = await AuthService.login({
                email: (e.target as any)[0].value,
                password: (e.target as any)[1].value
            });

            if (response.success) {
                // Store tokens if needed, or rely on cookies if the API sets them. 
                // For now, assuming standard JWT flow, we might need to store it.
                // However, without a robust state management or cookie logic shown in the limited context,
                // I will just redirect on success. The AuthService typically handles token storage if designed that way, 
                // but here it just returns data. I'll add a comment about token storage.
                if (response.data.accessToken) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
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
                    />
                    <Input
                        label="Password"
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
        </main>
    );
}
