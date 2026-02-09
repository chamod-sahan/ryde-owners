import { AnalyticsService } from "./analyticsService";
import { VehicleService } from "./vehicleService";
import { BookingService } from "./bookingService";
import { TransactionService } from "./transactionService";
import { apiClient } from "./apiClient";
import {
    MOCK_KPIS,
    MOCK_VEHICLES,
    MOCK_BOOKINGS,
    MOCK_EARNINGS,
    MOCK_TRANSACTIONS
} from "./mockData";

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
    location?: string;
    description?: string;
    deliveryFee?: number;
    // Base Pricing
    dailyRentalPrice?: number;
    weeklyRentalPrice?: number;
    monthlyRentalPrice?: number;
    hourlyRentalPrice?: number;
    availableFrom?: string;
    availableUntil?: string;
    isActive?: boolean;
    availabilityStatus?: string;
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
    status: "Pending" | "Active" | "Completed" | "Cancelled" | "ACCEPTED" | "REJECTED";
}

export interface DashboardBooking {
    id: string;
    car: string;
    status: string;
    time: string;
    user: string;
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

/**
 * DashboardService aggregates data from domain services and providing 
 * specific data structures for the dashboard UI.
 */
export const DashboardService = {
    getKPIs: async (): Promise<KPI[]> => {
        try {
            const response = await apiClient.get<any>("/owner-dashboard/stats");
            const data = (response as any).data || response;

            return [
                {
                    label: "Total Earnings",
                    value: `LKR ${data.totalEarnings?.toLocaleString() || '0'}`,
                    trend: "+12%", // Mock trend for now
                    trendUp: true,
                    color: "green"
                },
                {
                    label: "Active Vehicles",
                    value: data.activeVehicles?.toString() || '0',
                    trend: "Stable",
                    trendUp: true,
                    color: "blue"
                },
                {
                    label: "Total Rentals",
                    value: data.totalRentals?.toString() || '0',
                    trend: "+5%",
                    trendUp: true,
                    color: "purple"
                },
                {
                    label: "Average Rating",
                    value: data.averageRating?.toFixed(1) || '0.0',
                    trend: "Top Rated",
                    trendUp: true,
                    color: "orange"
                }
            ];
        } catch (error) {
            console.warn("Failed to fetch dashboard stats (using fallback):", error);
            // Fallback to mock KPIs
            return MOCK_KPIS.map(k => ({
                ...k,
                trendUp: k.trendUp ?? true // Ensure trendUp exists
            })) as KPI[];
        }
    },

    getAllVehicles: async (): Promise<DashboardVehicle[]> => {
        try {
            const response = await apiClient.get<any>("/owner-vehicles/my-vehicles");
            const data = (response as any).data || response;
            const vehicles = data.vehicles || [];

            return vehicles.map((v: any) => ({
                id: v.id.toString(),
                name: v.make && v.model ? `${v.make} ${v.model}` : 'Vehicle',
                status: v.availabilityStatus === 'AVAILABLE' ? "Active" :
                    v.availabilityStatus === 'BOOKED' ? "Rented" : "Maintenance",
                earnings: `LKR ${v.totalEarnings?.toLocaleString() || '0'}`,
                trips: v.totalRentals || 0,
                rating: v.averageRating || 0.0,
                bodyType: v.bodyTypeName || "N/A",
                fuel: v.fuelType || "N/A",
                transmission: v.transmission || "N/A",
                seats: v.seats || 0,
                location: v.location,
                description: v.description,
                deliveryFee: v.deliveryFee,
                dailyRentalPrice: v.dailyRentalPrice,
                weeklyRentalPrice: v.weeklyRentalPrice,
                monthlyRentalPrice: v.monthlyRentalPrice,
                hourlyRentalPrice: v.hourlyRentalPrice,
                availableFrom: v.availableFrom,
                availableUntil: v.availableUntil,
                isActive: v.isActive,
                availabilityStatus: v.availabilityStatus
            }));
        } catch (error) {
            console.warn("Failed to fetch all vehicles (using fallback):", error);
            // Fallback to mock vehicles
            return MOCK_VEHICLES.map(v => ({
                id: v.id,
                name: v.name,
                status: v.status as any,
                earnings: v.earnings,
                trips: v.trips,
                rating: v.rating,
                bodyType: v.bodyType,
                fuel: v.fuel,
                transmission: v.transmission,
                seats: v.seats,
                location: "Colombo", // Default for mock
                description: "Mock vehicle description",
                isActive: true,
                availabilityStatus: v.status === "Active" ? "AVAILABLE" : "BOOKED"
            }));
        }
    },

    getTopVehicles: async (): Promise<DashboardVehicle[]> => {
        try {
            const vehicles = await DashboardService.getAllVehicles();
            // Sort by earnings (descending) and take top 5
            return vehicles
                .sort((a, b) => {
                    const priceA = parseFloat(a.earnings.replace(/[^\d.]/g, ''));
                    const priceB = parseFloat(b.earnings.replace(/[^\d.]/g, ''));
                    return priceB - priceA;
                })
                .slice(0, 5);
        } catch (error) {
            console.warn("Failed to fetch top vehicles (using fallback):", error);
            // Reuse logic from getAllVehicles fallback since we are inside the service
            const allVehicles = await DashboardService.getAllVehicles();
            // The getAllVehicles now has a fallback, so this will return mocks if API failed
            return allVehicles
                .sort((a, b) => {
                    const priceA = parseFloat(a.earnings.replace(/[^\d.]/g, '')) || 0;
                    const priceB = parseFloat(b.earnings.replace(/[^\d.]/g, '')) || 0;
                    return priceB - priceA;
                })
                .slice(0, 5);
        }
    },

    getAllBookings: async (): Promise<Booking[]> => {
        try {
            const response = await BookingService.getBookings({ limit: 100 });
            if (!response.success) throw new Error("API failed");

            const bookings = response.data?.data || [];
            return bookings.map((b: any) => ({
                id: b.id.toString(),
                vehicleName: b.vehicleName || `Vehicle #${b.vehicleId}`,
                customerName: b.customerName || `Customer #${b.customerId}`,
                startDate: b.startDate,
                endDate: b.endDate,
                totalPrice: `LKR ${b.totalAmount?.toLocaleString() || '0'}`,
                status: b.bookingStatus
            }));
        } catch (error) {
            console.warn("Failed to fetch all bookings (using fallback):", error);
            return MOCK_BOOKINGS.map(b => ({
                id: b.id,
                vehicleName: b.vehicleName,
                customerName: b.customerName,
                startDate: b.startDate,
                endDate: b.endDate,
                totalPrice: b.totalPrice,
                status: b.status as any
            }));
        }
    },

    getRecentBookings: async (): Promise<DashboardBooking[]> => {
        try {
            const response = await apiClient.get<any>("/owner-dashboard/stats");
            const data = (response as any).data || response;
            const bookings = data.recentBookings || [];

            return bookings.map((b: any) => ({
                id: b.id.toString(),
                car: `Vehicle #${b.vehicleId}`, // Simple mapping for now
                status: b.bookingStatus,
                time: new Date(b.createdAt).toLocaleDateString(),
                user: `Customer #${b.customerId}`
            }));
        } catch (error) {
            console.warn("Failed to fetch recent bookings (using fallback):", error);
            return MOCK_BOOKINGS.slice(0, 5).map(b => ({
                id: b.id,
                car: b.vehicleName,
                status: b.status,
                time: new Date().toLocaleDateString(), // Mock current date
                user: b.customerName
            }));
        }
    },

    getEarningsHistory: async (): Promise<EarningStat[]> => {
        try {
            const response = await AnalyticsService.getEarnings();
            if (!response.success) throw new Error("API failed");
            return response.data;
        } catch (error) {
            console.warn("Failed to fetch earnings history (using fallback):", error);
            return MOCK_EARNINGS;
        }
    },

    getTransactions: async (): Promise<Transaction[]> => {
        try {
            const response = await TransactionService.getTransactions({ limit: 10 });
            if (!response.success) throw new Error("API failed");

            const transactions = response.data?.data || [];
            return transactions.map((t: any) => ({
                id: t.id.toString(),
                date: t.date,
                description: t.description,
                amount: t.amount,
                status: t.status
            }));
        } catch (error) {
            console.warn("Failed to fetch transactions (using fallback):", error);
            return MOCK_TRANSACTIONS.map(t => ({
                id: t.id,
                date: t.date,
                description: t.description,
                amount: t.amount,
                status: t.status as any
            }));
        }
    }
};
