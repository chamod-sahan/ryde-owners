import { AnalyticsService } from "./analyticsService";
import { VehicleService } from "./vehicleService";
import { BookingService } from "./bookingService";
import { TransactionService } from "./transactionService";

export interface VehicleLegacy {
    id: string;
    name: string;
    status: "Active" | "Rented" | "Maintenance";
    earnings: string;
    trips: number;
    rating: number;
    bodyType: string;
    fuel: string;
    transmission: string;
    seats: number;
}

export interface DashboardVehicle {
    id: string;
    name: string;
    status: "Active" | "Rented" | "Maintenance";
    earnings: string;
    trips: number;
    rating: number;
    bodyType: string;
    fuel: string;
    transmission: string;
    seats: number;
}

export interface KPI {
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
    color: "blue" | "green" | "purple" | "orange";
}

export interface Booking {
    id: string;
    vehicleName: string;
    customerName: string;
    startDate: string;
    endDate: string;
    totalPrice: string;
    status: "Pending" | "Active" | "Completed" | "Cancelled";
}

export interface EarningStat {
    month: string;
    amount: number;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: string;
    status: "Processing" | "Paid" | "Failed";
}

// NOTE: This service now aggregates data from specific domain services
export const DashboardService = {
    getKPIs: async (): Promise<KPI[]> => {
        try {
            const response = await AnalyticsService.getKPIs();
            if (response.success) {
                return response.data;
            }
        } catch (error) {
            console.error("Failed to fetch KPIs:", error);
        }
        return [];
    },

    getAllVehicles: async (): Promise<DashboardVehicle[]> => {
        try {
            const response = await VehicleService.getVehicles({ limit: 100 });
            if (response.success) {
                return response.data.data.map(v => ({
                    id: v.id,
                    name: v.name,
                    status: v.status,
                    earnings: v.earnings,
                    trips: v.trips,
                    rating: v.rating,
                    bodyType: v.bodyType,
                    fuel: v.fuel,
                    transmission: v.transmission,
                    seats: v.seats
                }));
            }
        } catch (error) {
            console.error("Failed to fetch all vehicles:", error);
        }
        return [];
    },

    getTopVehicles: async (): Promise<DashboardVehicle[]> => {
        try {
            const response = await VehicleService.getVehicles({ limit: 3, sort: 'earnings' }); // Assuming sort param exists or backend handles it
            if (response.success) {
                return response.data.data.map(v => ({
                    id: v.id,
                    name: v.name,
                    status: v.status,
                    earnings: v.earnings,
                    trips: v.trips,
                    rating: v.rating,
                    bodyType: v.bodyType,
                    fuel: v.fuel,
                    transmission: v.transmission,
                    seats: v.seats
                }));
            }
        } catch (error) {
            console.error("Failed to fetch top vehicles:", error);
        }
        return [];
    },

    getAllBookings: async (): Promise<Booking[]> => {
        try {
            const response = await BookingService.getBookings({ limit: 100 });
            if (response.success) {
                return response.data.data.map(b => ({
                    id: b.id,
                    vehicleName: b.vehicleName,
                    customerName: b.customerName,
                    startDate: b.startDate,
                    endDate: b.endDate,
                    totalPrice: b.totalPrice,
                    status: b.status
                }));
            }
        } catch (error) {
            console.error("Failed to fetch all bookings:", error);
        }
        return [];
    },

    getRecentBookings: async () => {
        try {
            const response = await BookingService.getBookings({ limit: 3 });
            if (response.success) {
                return response.data.data.map(b => ({
                    id: b.id,
                    car: b.vehicleName,
                    status: b.status,
                    time: b.startDate,
                    user: b.customerName
                }));
            }
        } catch (error) {
            console.error("Failed to fetch recent bookings:", error);
        }
        return [];
    },

    getEarningsHistory: async (): Promise<EarningStat[]> => {
        try {
            const response = await AnalyticsService.getEarnings();
            if (response.success) {
                return response.data;
            }
        } catch (error) {
            console.error("Failed to fetch earnings history:", error);
        }
        return [];
    },

    getTransactions: async (): Promise<Transaction[]> => {
        try {
            const response = await TransactionService.getTransactions({ limit: 10 });
            if (response.success) {
                return response.data.data.map(t => ({
                    id: t.id,
                    date: t.date,
                    description: t.description,
                    amount: t.amount,
                    status: t.status
                }));
            }
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        }
        return [];
    }
};
