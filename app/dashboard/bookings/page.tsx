"use client";

import React, { useEffect, useState } from "react";
import { BookingTable } from "@/components/dashboard/BookingTable";
import { DashboardService, Booking } from "@/services/dashboardService";
import { Button } from "@/components/ui/Button";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { exportBookingsToCSV } from "@/lib/csv-export";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBookings() {
            const data = await DashboardService.getAllBookings();
            setBookings(data);
            setLoading(false);
        }
        loadBookings();
    }, []);

    const handleExport = () => {
        exportBookingsToCSV(bookings);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Bookings</h1>
                    <p className="text-slate-400 mt-1">View and manage all your past and upcoming reservations.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="text-slate-300 border-white/10 hover:bg-white/5 hover:text-white">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Select Dates
                    </Button>
                    <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="py-12 text-center text-slate-500">Loading bookings...</div>
            ) : (
                <BookingTable bookings={bookings} />
            )}
        </div>
    );
}
