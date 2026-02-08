import { apiClient } from "./apiClient";
import { ApiResponse } from "@/types/api";

// Define interface for the expected response data
interface HealthCheckResponse {
    status: string;
    timestamp: string;
    version: string;
}

interface ExampleData {
    id: number;
    title: string;
    description: string;
}

/**
 * SampleService demonstrates how to use the apiClient to make HTTP requests.
 * It includes examples for GET and POST methods.
 */
export const SampleService = {
    /**
     * Example of a simple GET request
     * Endpoint: /health (or any other public endpoint)
     */
    getHealthCheck: async (): Promise<ApiResponse<HealthCheckResponse>> => {
        // The apiClient automatically prepends NEXT_PUBLIC_API_BASE_URL
        return await apiClient.get<HealthCheckResponse>("/health");
    },

    /**
     * Example of a POST request with a body
     * Endpoint: /sample/data
     */
    createExampleData: async (data: Omit<ExampleData, "id">): Promise<ApiResponse<ExampleData>> => {
        return await apiClient.post<ExampleData>("/sample/data", data);
    },

    /**
     * Example of a GET request with query parameters
     * Endpoint: /sample/items?status=active&limit=10
     */
    getItems: async (status: string, limit: number = 10): Promise<ApiResponse<ExampleData[]>> => {
        return await apiClient.get<ExampleData[]>("/sample/items", { status, limit });
    }
};
