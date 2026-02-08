import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Transaction } from "@/services/dashboardService";
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionListProps {
    transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
    return (
        <GlassCard className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Payouts</h3>
            <div className="space-y-4">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                                tx.status === "Paid" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                            )}>
                                {tx.status === "Paid" ? <ArrowUpRight className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="font-medium text-slate-200">{tx.description}</p>
                                <p className="text-xs text-slate-500">{tx.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-medium text-white">{tx.amount}</p>
                            <span className={cn(
                                "text-xs font-medium",
                                tx.status === "Paid" ? "text-emerald-400" : "text-amber-400"
                            )}>
                                {tx.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
