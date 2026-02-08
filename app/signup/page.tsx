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

        const form = e.target as HTMLFormElement;
        // Elements index depends on the DOM order. 
        // 0: First Name, 1: Last Name, 2: Email, 3: Password, 4: Confirm
        const firstName = (form.elements[0] as HTMLInputElement).value;
        const lastName = (form.elements[1] as HTMLInputElement).value;
        const email = (form.elements[2] as HTMLInputElement).value;
        const password = (form.elements[3] as HTMLInputElement).value;
        const confirmPassword = (form.elements[4] as HTMLInputElement).value;

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
                }
                router.push("/dashboard");
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
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400">Join Ryde and start earning</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            type="text"
                            placeholder="John"
                            icon={<User className="h-4 w-4" />}
                            required
                        />
                        <Input
                            label="Last Name"
                            type="text"
                            placeholder="Doe"
                            icon={<User className="h-4 w-4" />}
                            required
                        />
                    </div>
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
                    <Input
                        label="Confirm Password"
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
