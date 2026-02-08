import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { MoreHorizontal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardVehicle } from "@/services/dashboardService";

interface VehicleTableProps {
    vehicles: DashboardVehicle[];
    onEdit?: (vehicle: DashboardVehicle) => void;
}

export function VehicleTable({ vehicles, onEdit }: VehicleTableProps) {
    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Your Fleet</h3>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/5 text-slate-400">
                            <th className="pb-4 font-medium pl-2 min-w-[200px]">Vehicle</th>
                            <th className="pb-4 font-medium">Status</th>
                            <th className="pb-4 font-medium">Trips</th>
                            <th className="pb-4 font-medium">Rating</th>
                            <th className="pb-4 font-medium text-right pr-2">Earnings</th>
                            <th className="pb-4 font-medium w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="group hover:bg-white/5 transition-colors">
                                <td className="py-4 pl-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-16 rounded-lg bg-slate-800/50 border border-white/5 shrink-0" />
                                        <div>
                                            <p className="font-medium text-slate-200 group-hover:text-primary transition-colors">{vehicle.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-xs text-slate-500">{vehicle.bodyType}</p>
                                                <span className="text-xs text-slate-600">•</span>
                                                <p className="text-xs text-slate-500">{vehicle.transmission}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                        vehicle.status === "Active" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                        vehicle.status === "Rented" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                                        vehicle.status === "Maintenance" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                                    )}>
                                        {vehicle.status}
                                    </span>
                                </td>
                                <td className="py-4 text-slate-300">{vehicle.trips}</td>
                                <td className="py-4">
                                    <div className="flex items-center gap-1 text-slate-300">
                                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                        {vehicle.rating}
                                    </div>
                                </td>
                                <td className="py-4 text-right pr-2 font-medium text-white">{vehicle.earnings}</td>
                                <td className="py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-primary hover:bg-primary/10"
                                            onClick={() => onEdit?.(vehicle)}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
