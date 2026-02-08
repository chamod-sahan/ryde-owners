import { apiClient } from "./apiClient";
import {
    ApiResponse,
    KPIResponse,
    EarningsData,
    VehiclePerformance,
    BookingStats,
    QueryParams
} from "@/types/api";
import { MOCK_KPIS, MOCK_EARNINGS } from "./mockData";

/**
 * AnalyticsService handles data retrieval for dashboards and reports.
 */
export const AnalyticsService = {
    /**
     * Get Key Performance Indicators (KPIs)
     */
    getKPIs: async (period: string = "month"): Promise<ApiResponse<KPIResponse[]>> => {
        try {
            return await apiClient.get<KPIResponse[]>(
                process.env.NEXT_PUBLIC_ANALYTICS_KPIS || "/analytics/kpis",
                { period }
            );
        } catch (error) {
            console.warn("API Error, using mock data:", error);
            return {
                success: true,
                message: "Mock data",
                data: MOCK_KPIS as unknown as KPIResponse[]
            };
        }
    },

    /**
     * Get earnings data for charts
     */
    getEarnings: async (params?: QueryParams): Promise<ApiResponse<EarningsData[]>> => {
        try {
            return await apiClient.get<EarningsData[]>(
                process.env.NEXT_PUBLIC_ANALYTICS_EARNINGS || "/analytics/earnings",
                params
            );
        } catch (error) {
            console.warn("API Error, using mock data:", error);
            return {
                success: true,
                message: "Mock data",
                data: MOCK_EARNINGS
            };
        }
    },

    /**
     * Get performance stats per vehicle
     */
    getVehiclePerformance: async (params?: QueryParams): Promise<ApiResponse<VehiclePerformance[]>> => {
        try {
            return await apiClient.get<VehiclePerformance[]>(
                process.env.NEXT_PUBLIC_ANALYTICS_VEHICLE_PERFORMANCE || "/analytics/vehicle-performance",
                params
            );
        } catch (error) {
            console.warn("API Error, returning empty list:", error);
            return {
                success: true,
                message: "Mock data (empty)",
                data: []
            };
        }
    },

    /**
     * Get overall booking statistics
     */
    getBookingStats: async (params?: QueryParams): Promise<ApiResponse<BookingStats>> => {
        try {
            return await apiClient.get<BookingStats>(
                process.env.NEXT_PUBLIC_ANALYTICS_BOOKING_STATS || "/analytics/booking-stats",
                params
            );
        } catch (error) {
            console.warn("API Error, using mock data:", error);
            return {
                success: true,
                message: "Mock data",
                data: {
                    totalBookings: 125,
                    activeBookings: 8,
                    completedBookings: 110,
                    cancelledBookings: 7,
                    averageBookingValue: 450
                }
            };
        }
    },

    /**
     * Export analytics data
     */
    exportAnalytics: async (type: "earnings" | "performance", params?: QueryParams): Promise<ApiResponse<{ downloadUrl: string }>> => {
        try {
            return await apiClient.get<{ downloadUrl: string }>(
                process.env.NEXT_PUBLIC_ANALYTICS_EXPORT || "/analytics/export",
                { type, ...params }
            );
        } catch (error) {
            console.warn("API Error, simulating export:", error);
            return {
                success: true,
                message: "Export ready (mock)",
                data: { downloadUrl: "#" }
            };
        }
    }
};
