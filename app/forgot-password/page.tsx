"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthService } from "@/services/authService";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = formData.get("email") as string;

        try {
            // We always show success message to prevent email enumeration
            // unless there's a network error or unrelated server issue
            await AuthService.resetPassword({ email });
            setSubmitted(true);
        } catch (error: any) {
            console.error("Forgot password error:", error);
            // Optionally check for specific error types, but generally show generic error or success
            toast.error("Unable to process request. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B0F19] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] opacity-20" />
            </div>

            <GlassCard className="w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                    <p className="text-slate-400">
                        {submitted
                            ? "Check your email for reset instructions"
                            : "Enter your email to receive reset instructions"
                        }
                    </p>
                </div>

                {submitted ? (
                    <div className="text-center space-y-6">
                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm">
                            If an account exists for that email, we have sent a password reset link. Please check your inbox and spam folder.
                        </div>
                        <Link href="/login">
                            <Button variant="outline" className="w-full">
                                Return to Login
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            icon={<Mail className="h-4 w-4" />}
                            required
                            name="email"
                        />

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? "Sending Link..." : "Send Reset Link"}
                        </Button>

                        <div className="text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </GlassCard>
        </main>
    );
}
