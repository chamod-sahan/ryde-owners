"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, FileText, Shield, AlertCircle, Scale, DollarSign, Calendar, Car, Ban, Info, Gavel } from "lucide-react";

export default function TermsAndConditionsPage() {
    return (
        <main className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] opacity-20" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard">
                        <Button variant="outline" className="mb-6 border-white/10 hover:bg-white/5 text-slate-300">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Terms & Conditions</h1>
                            <p className="text-slate-400 mt-1">Car Owner Agreement</p>
                        </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                        Last Updated: <span className="text-primary">February 9, 2026</span>
                    </p>
                </div>

                {/* Important Notice */}
                <GlassCard className="p-6 mb-8 border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-amber-400 mb-2">Important Notice</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Please read these Terms & Conditions carefully before listing your vehicle on our platform.
                                By registering as a Car Owner, you acknowledge that you have read, understood, and agree to be bound by these terms.
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* Terms Sections */}
                <div className="space-y-6">
                    {/* 1. Acceptance of Terms */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
                            </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                            By registering as a Car Owner on this platform, you agree to comply with and be legally bound by these Terms & Conditions.
                            If you do not agree, you must not list your vehicle on the platform.
                        </p>
                    </GlassCard>

                    {/* 2. Eligibility of Car Owners */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <Shield className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">2. Eligibility of Car Owners</h2>
                            </div>
                        </div>
                        <p className="text-slate-300 mb-3">To list a vehicle, the car owner must:</p>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Be at least 18 years old</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Be the legal owner or have legal authority to rent the vehicle</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Provide valid NIC/Passport</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Provide accurate bank/payment details</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Ensure all submitted information is true and up to date</span>
                            </li>
                        </ul>
                    </GlassCard>

                    {/* 3. Vehicle Requirements */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Car className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">3. Vehicle Requirements</h2>
                            </div>
                        </div>
                        <p className="text-slate-300 mb-3">The car owner agrees that:</p>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>The vehicle is roadworthy and in good condition</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>The vehicle has valid registration, revenue license, and insurance</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Insurance covers commercial/rental use (if required by law)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Vehicle details, photos, and documents uploaded are accurate</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>The vehicle is clean and safe at the time of handover</span>
                            </li>
                        </ul>
                        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <p className="text-amber-400 text-sm">
                                ⚠️ The platform reserves the right to reject or remove any vehicle that does not meet quality or safety standards.
                            </p>
                        </div>
                    </GlassCard>

                    {/* 4. Insurance & Liability */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                <Shield className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">4. Insurance & Liability</h2>
                            </div>
                        </div>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>The car owner is responsible for maintaining valid insurance at all times</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>The platform does not provide insurance coverage unless explicitly stated</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Any damage, theft, fines, or legal issues must be handled according to the insurance policy and rental agreement</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>The platform is not responsible for accidents, damages, or losses unless caused by platform negligence</span>
                            </li>
                        </ul>
                    </GlassCard>

                    {/* 5. Pricing & Earnings */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                <DollarSign className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">5. Pricing & Earnings</h2>
                            </div>
                        </div>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Car owners set their own rental prices (unless otherwise specified)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>The platform may charge a service fee or commission, which will be clearly disclosed</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Payments will be processed through the platform and transferred to the car owner according to the payout schedule</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Taxes, levies, or government charges are the responsibility of the car owner</span>
                            </li>
                        </ul>
                    </GlassCard>

                    {/* 6. Vehicle Availability & Cancellations */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                <Calendar className="h-5 w-5 text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">6. Vehicle Availability & Cancellations</h2>
                            </div>
                        </div>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Owners must keep availability calendars accurate</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Repeated cancellations may result in penalties, reduced visibility, or account suspension</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Emergency cancellations must be reported immediately</span>
                            </li>
                        </ul>
                    </GlassCard>

                    {/* 7. Handover & Return Responsibilities */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                                <Info className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">7. Handover & Return Responsibilities</h2>
                            </div>
                        </div>
                        <p className="text-slate-300 mb-3">The car owner must:</p>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Verify renter identity at handover</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Document vehicle condition before and after rental</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Provide clear instructions for vehicle usage</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Ensure fuel level and accessories are documented</span>
                            </li>
                        </ul>
                    </GlassCard>

                    {/* 8. Prohibited Activities */}
                    <GlassCard className="p-6 border-red-500/20 bg-red-500/5">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                <Ban className="h-5 w-5 text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">8. Prohibited Activities</h2>
                            </div>
                        </div>
                        <p className="text-slate-300 mb-3">Car owners must NOT:</p>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">✕</span>
                                <span>Provide false documents or information</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">✕</span>
                                <span>Rent stolen or illegally modified vehicles</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">✕</span>
                                <span>Bypass the platform for payments or communication</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">✕</span>
                                <span>Engage in harassment, discrimination, or illegal activity</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">✕</span>
                                <span>Use the platform for money laundering or fraud</span>
                            </li>
                        </ul>
                    </GlassCard>

                    {/* 9. Platform Rights */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                                <Shield className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">9. Platform Rights</h2>
                            </div>
                        </div>
                        <p className="text-slate-300 mb-3">The platform reserves the right to:</p>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Suspend or terminate accounts for violations</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Remove listings without prior notice</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Modify platform fees and policies</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Verify documents and conduct audits</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Cooperate with law enforcement when required</span>
                            </li>
                        </ul>
                    </GlassCard>

                    {/* 10. Limitation of Liability */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                                <AlertCircle className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">10. Limitation of Liability</h2>
                            </div>
                        </div>
                        <p className="text-slate-300 mb-3">
                            The platform acts only as a technology service provider. It is not a party to rental agreements between owners and renters.
                        </p>
                        <p className="text-slate-300 mb-2">The platform shall not be liable for:</p>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Loss of income</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Vehicle damage or theft</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Personal injury</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Legal disputes between users</span>
                            </li>
                        </ul>
                    </GlassCard>

                    {/* 11. Indemnification */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0">
                                <Scale className="h-5 w-5 text-pink-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">11. Indemnification</h2>
                            </div>
                        </div>
                        <p className="text-slate-300 mb-3">The car owner agrees to indemnify and hold harmless the platform from:</p>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Claims, damages, fines, or legal actions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Violations of laws or third-party rights</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Breach of these Terms & Conditions</span>
                            </li>
                        </ul>
                    </GlassCard>

                    {/* 12. Termination */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-slate-500/10 flex items-center justify-center shrink-0">
                                <Info className="h-5 w-5 text-slate-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">12. Termination</h2>
                            </div>
                        </div>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Car owners may deactivate their account at any time</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Outstanding payments, disputes, or obligations must be resolved before full closure</span>
                            </li>
                        </ul>
                    </GlassCard>

                    {/* 13. Governing Law */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                                <Gavel className="h-5 w-5 text-teal-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">13. Governing Law</h2>
                            </div>
                        </div>
                        <p className="text-slate-300">
                            These Terms & Conditions are governed by the laws of <span className="text-primary font-semibold">Sri Lanka</span>.
                        </p>
                    </GlassCard>

                    {/* 14. Changes to Terms */}
                    <GlassCard className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">14. Changes to Terms</h2>
                            </div>
                        </div>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>The platform may update these Terms at any time</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>Continued use of the app constitutes acceptance of the updated Terms</span>
                            </li>
                        </ul>
                    </GlassCard>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <GlassCard className="p-6">
                        <p className="text-slate-400 text-sm mb-4">
                            By using this platform, you acknowledge that you have read and understood these Terms & Conditions.
                        </p>
                        <Link href="/dashboard">
                            <Button className="bg-primary hover:bg-primary/90">
                                I Accept the Terms & Conditions
                            </Button>
                        </Link>
                    </GlassCard>
                </div>

                {/* Contact Info */}
                <div className="mt-6 text-center text-slate-500 text-sm">
                    <p>For questions or concerns, please contact us at <a href="mailto:support@ryde.lk" className="text-primary hover:underline">support@ryde.lk</a></p>
                </div>
            </div>
        </main>
    );
}
