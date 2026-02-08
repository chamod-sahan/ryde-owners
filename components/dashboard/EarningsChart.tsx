"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { THEME } from "@/lib/constants/theme";
import { EarningStat } from "@/services/dashboardService";

interface EarningsChartProps {
    data: EarningStat[];
}

export function EarningsChart({ data }: EarningsChartProps) {
    return (
        <GlassCard className="p-6 h-[400px]">
            <h3 className="text-lg font-semibold text-white mb-6">Revenue Overview</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={THEME.colors.text.muted} opacity={0.1} vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke={THEME.colors.text.secondary}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke={THEME.colors.text.secondary}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: THEME.colors.card,
                                borderColor: "rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                                color: THEME.colors.text.primary,
                            }}
                            cursor={{ fill: "rgba(255,255,255,0.05)" }}
                        />
                        <Bar
                            dataKey="amount"
                            fill={THEME.colors.primary}
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
