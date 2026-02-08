"use client";

import React, { useEffect, useState } from "react";
import { EarningsChart } from "@/components/dashboard/EarningsChart";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { DashboardService, EarningStat, Transaction, KPI } from "@/services/dashboardService";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, Wallet, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function EarningsPage() {
    const [earningsData, setEarningsData] = useState<EarningStat[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [kpis, setKpis] = useState<KPI[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const [history, txs, kpiData] = await Promise.all([
                DashboardService.getEarningsHistory(),
                DashboardService.getTransactions(),
                DashboardService.getKPIs()
            ]);
            setEarningsData(history);
            setTransactions(txs);
            setKpis(kpiData); // Re-using KPIs for this example, but normally would fetch earnings specific stats
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return <div className="py-12 text-center text-slate-500">Loading earnings data...</div>;
    }

    // Derived mock data for top cards
    const totalBalance = "$2,450.00";
    const nextPayout = "Nov 01, 2025";

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Earnings</h1>
                    <p className="text-slate-400 mt-1">Track your income and payout history.</p>
                </div>
                <Button>
                    Payout Settings
                </Button>
            </div>

            {/* Earnings Specific Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Available Balance"
                    value={totalBalance}
                    icon={Wallet}
                    color="green"
                />
                <StatCard
                    label="Total Earnings (YTD)"
                    value={kpis[0]?.value || "$0"}
                    trend={kpis[0]?.trend}
                    trendUp={true}
                    icon={DollarSign}
                    color="blue"
                />
                <StatCard
                    label="Next Payout Date"
                    value={nextPayout}
                    icon={CreditCard}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <EarningsChart data={earningsData} />
                </div>
                <div>
                    <TransactionList transactions={transactions} />
                </div>
            </div>
        </div>
    );
}
