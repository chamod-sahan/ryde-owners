"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, User } from "lucide-react";
import { AuthService } from "@/services/authService";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await AuthService.signup({
                firstName,
                lastName,
                email,
                password,
                role: "CAR_OWNER" // Hardcoded "CAR_OWNER" as per user instruction
            });

            if (response.success) {
                if (response.data.accessToken) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    router.push("/dashboard");
                } else {
                    // No token means email verification might be required, OR we just need to login manually.
                    // Try to auto-login
                    try {
                        const loginResponse = await AuthService.login({
                            email,
                            password
                        });

                        if (loginResponse.success && loginResponse.data.accessToken) {
                            localStorage.setItem('accessToken', loginResponse.data.accessToken);
                            localStorage.setItem('refreshToken', loginResponse.data.refreshToken);
                            localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
                            router.push("/dashboard");
                        } else {
                            // Login failed (maybe strict email verification), redirect to login page
                            router.push("/login?registered=true");
                        }
                    } catch (loginError) {
                        console.warn("Auto-login failed:", loginError);
                        router.push("/login?registered=true");
                    }
                }
            } else {
                alert(response.message || "Signup failed");
            }
        } catch (error: any) {
            alert(error.message || "An error occurred during signup");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B0F19] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] opacity-20" />
            </div>

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
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400">Join Ryde and start earning</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            name="firstName"
                            type="text"
                            placeholder="John"
                            icon={<User className="h-4 w-4" />}
                            required
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            type="text"
                            placeholder="Doe"
                            icon={<User className="h-4 w-4" />}
                            required
                        />
                    </div>
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
                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock className="h-4 w-4" />}
                        required
                    />

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-slate-400">Already have an account? </span>
                    <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                        Sign in
                    </Link>
                </div>
            </GlassCard>
        </main>
    );
}
