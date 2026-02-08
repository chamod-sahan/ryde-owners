import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    color?: "blue" | "green" | "purple" | "orange";
}

export function StatCard({ label, value, trend, trendUp, icon: Icon, color = "blue" }: StatCardProps) {
    const colors = {
        blue: "text-blue-500 bg-blue-500/10",
        green: "text-emerald-500 bg-emerald-500/10",
        purple: "text-purple-500 bg-purple-500/10",
        orange: "text-amber-500 bg-amber-500/10",
    };

    return (
        <GlassCard className="p-4 sm:p-6 relative overflow-hidden group" hoverEffect>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-400">{label}</p>
                    <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">{value}</h3>
                </div>
                <div className={cn("p-3 rounded-xl", colors[color])}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={cn(
                        "font-medium px-2 py-0.5 rounded-full text-xs",
                        trendUp
                            ? "text-emerald-400 bg-emerald-400/10"
                            : "text-rose-400 bg-rose-400/10"
                    )}>
                        {trendUp ? "+" : ""}{trend}
                    </span>
                    <span className="text-slate-500 ml-2">from last month</span>
                </div>
            )}

            {/* Background Glow Effect */}
            <div className={cn(
                "absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-30",
                color === "blue" && "bg-blue-500",
                color === "green" && "bg-emerald-500",
                color === "purple" && "bg-purple-500",
                color === "orange" && "bg-amber-500"
            )} />
        </GlassCard>
    );
}
