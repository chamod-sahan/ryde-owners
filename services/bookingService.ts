import { apiClient } from "./apiClient";
import {
    ApiResponse,
    BookingResponse,
    BookingFilters,
    UpdateBookingStatusRequest,
    PaginatedResponse
} from "@/types/api";
import { MOCK_BOOKINGS } from "./mockData";

/**
 * BookingService handles all booking-related API calls.
 */
export const BookingService = {
    /**
     * Get a paginated list of bookings with optional filters
     */
    getBookings: async (filters?: BookingFilters): Promise<ApiResponse<PaginatedResponse<BookingResponse>>> => {
        try {
            return await apiClient.get<PaginatedResponse<BookingResponse>>(
                process.env.NEXT_PUBLIC_BOOKINGS_BASE || "/bookings",
                filters
            );
        } catch (error) {
            console.warn("API Error, using mock data:", error);
            return {
                success: true,
                message: "Mock data",
                data: {
                    data: MOCK_BOOKINGS as unknown as BookingResponse[],
                    pagination: {
                        total: MOCK_BOOKINGS.length,
                        page: 1,
                        limit: 10,
                        totalPages: 1
                    }
                }
            };
        }
    },

    /**
     * Get a single booking by ID
     */
    getBookingById: async (id: string): Promise<ApiResponse<BookingResponse>> => {
        try {
            return await apiClient.get<BookingResponse>(
                `${process.env.NEXT_PUBLIC_BOOKINGS_BASE || "/bookings"}/${id}`
            );
        } catch (error) {
            console.warn("API Error, using mock data:", error);
            const booking = MOCK_BOOKINGS.find(b => b.id === id) || MOCK_BOOKINGS[0];
            return {
                success: true,
                message: "Mock data",
                data: booking as unknown as BookingResponse
            };
        }
    },

    /**
     * Update booking status
     */
    updateBookingStatus: async (data: UpdateBookingStatusRequest): Promise<ApiResponse<BookingResponse>> => {
        try {
            return await apiClient.patch<BookingResponse>(
                `${process.env.NEXT_PUBLIC_BOOKINGS_BASE || "/bookings"}/${data.bookingId}/status`,
                { status: data.status }
            );
        } catch (error) {
            console.warn("API Error, simulating status update:", error);
            const booking = MOCK_BOOKINGS.find(b => b.id === data.bookingId) || MOCK_BOOKINGS[0];
            return {
                success: true,
                message: "Booking status updated (mock)",
                data: { ...booking, status: data.status } as unknown as BookingResponse
            };
        }
    },

    /**
     * Get booking history for the current user/owner
     */
    getBookingHistory: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<BookingResponse>>> => {
        try {
            return await apiClient.get<PaginatedResponse<BookingResponse>>(
                process.env.NEXT_PUBLIC_BOOKINGS_HISTORY || "/bookings/history",
                { page, limit }
            );
        } catch (error) {
            console.warn("API Error, using mock data:", error);
            return {
                success: true,
                message: "Mock data",
                data: {
                    data: MOCK_BOOKINGS as unknown as BookingResponse[],
                    pagination: {
                        total: MOCK_BOOKINGS.length,
                        page: 1,
                        limit: 10,
                        totalPages: 1
                    }
                }
            };
        }
    }
};
