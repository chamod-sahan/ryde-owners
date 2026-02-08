import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Booking } from "@/services/dashboardService";

interface BookingTableProps {
    bookings: Booking[];
}

export function BookingTable({ bookings }: BookingTableProps) {
    return (
        <GlassCard className="p-4 sm:p-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/5 text-slate-400">
                            <th className="pb-4 font-medium pl-2 min-w-[150px]">Vehicle</th>
                            <th className="pb-4 font-medium">Customer</th>
                            <th className="pb-4 font-medium min-w-[180px]">Dates</th>
                            <th className="pb-4 font-medium">Status</th>
                            <th className="pb-4 font-medium text-right pr-2">Total Price</th>
                            <th className="pb-4 font-medium w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="group hover:bg-white/5 transition-colors">
                                <td className="py-4 pl-2 font-medium text-slate-200">
                                    {booking.vehicleName}
                                </td>
                                <td className="py-4 text-slate-300">{booking.customerName}</td>
                                <td className="py-4 text-slate-400 text-xs">
                                    {booking.startDate} - {booking.endDate}
                                </td>
                                <td className="py-4">
                                    <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                        booking.status === "Active" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                                        booking.status === "Completed" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                        booking.status === "Pending" && "bg-orange-500/10 text-orange-400 border-orange-500/20",
                                        booking.status === "Cancelled" && "bg-rose-500/10 text-rose-400 border-rose-500/20",
                                    )}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="py-4 text-right pr-2 font-medium text-white">{booking.totalPrice}</td>
                                <td className="py-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
