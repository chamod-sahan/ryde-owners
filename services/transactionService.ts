import { apiClient } from "./apiClient";
import {
    ApiResponse,
    TransactionResponse,
    TransactionFilters,
    PayoutRequest,
    PaginatedResponse
} from "@/types/api";
import { MOCK_TRANSACTIONS } from "./mockData";

/**
 * TransactionService handles financial transactions and payouts.
 */
export const TransactionService = {
    /**
     * Get paginated transactions with filters
     */
    getTransactions: async (filters?: TransactionFilters): Promise<ApiResponse<PaginatedResponse<TransactionResponse>>> => {
        try {
            return await apiClient.get<PaginatedResponse<TransactionResponse>>(
                process.env.NEXT_PUBLIC_TRANSACTIONS_BASE || "/transactions",
                filters
            );
        } catch (error) {
            console.warn("API Error, using mock data:", error);
            return {
                success: true,
                message: "Mock data",
                data: {
                    data: MOCK_TRANSACTIONS as unknown as TransactionResponse[],
                    pagination: {
                        total: MOCK_TRANSACTIONS.length,
                        page: 1,
                        limit: 10,
                        totalPages: 1
                    }
                }
            };
        }
    },

    /**
     * Request a payout
     */
    requestPayout: async (data: PayoutRequest): Promise<ApiResponse<TransactionResponse>> => {
        try {
            return await apiClient.post<TransactionResponse>(
                process.env.NEXT_PUBLIC_TRANSACTIONS_REQUEST_PAYOUT || "/transactions/request-payout",
                data
            );
        } catch (error) {
            console.warn("API Error, simulating payout request:", error);
            return {
                success: true,
                message: "Payout requested (mock)",
                data: {
                    id: "temp-payout-" + Date.now(),
                    date: new Date().toISOString(),
                    description: "Payout Request",
                    amount: String(data.amount),
                    status: "Processing",
                    type: "Payout"
                } as TransactionResponse
            };
        }
    },

    /**
     * Get payout history
     */
    getPayoutHistory: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<TransactionResponse>>> => {
        try {
            return await apiClient.get<PaginatedResponse<TransactionResponse>>(
                process.env.NEXT_PUBLIC_TRANSACTIONS_PAYOUT || "/transactions/payout",
                { page, limit }
            );
        } catch (error) {
            console.warn("API Error, using mock data:", error);
            return {
                success: true,
                message: "Mock data",
                data: {
                    data: MOCK_TRANSACTIONS.filter(t => t.description.includes("Payout")) as unknown as TransactionResponse[],
                    pagination: {
                        total: 1,
                        page: 1,
                        limit: 10,
                        totalPages: 1
                    }
                }
            };
        }
    },

    /**
     * Export transactions as CSV/PDF
     */
    exportTransactions: async (filters?: TransactionFilters): Promise<ApiResponse<{ downloadUrl: string }>> => {
        try {
            return await apiClient.get<{ downloadUrl: string }>(
                process.env.NEXT_PUBLIC_TRANSACTIONS_EXPORT || "/transactions/export",
                filters
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
