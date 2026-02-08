import { ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;


    // Helper to get headers with current token
    const getHeaders = () => {
        const headers: HeadersInit = { ...options.headers };
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken");
            if (token) {
                (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
            }

    const headers: HeadersInit = {
        ...options.headers,
    };

    // Add Authorization header if token exists
    if (typeof window !== "undefined") {
        const { TokenService } = require("./tokenService"); // Dynamic import to avoid circular dependency if any, or just import at top level
        const token = TokenService.getAccessToken();
        if (token) {
            (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

        }
        if (!(options.body instanceof FormData)) {
            (headers as Record<string, string>)["Content-Type"] = "application/json";
        }
        return headers;
    };

    let response = await fetch(url, {
        ...options,
        headers: getHeaders(),
    });

    // Handle 401 Unauthorized (Token expired)
    if (response.status === 401 && !endpoint.includes("/auth/refresh")) {
        console.warn(`🔒 Received 401 Unauthorized for ${endpoint}. Attempting token refresh...`);

        if (!isRefreshing) {
            isRefreshing = true;
            const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

            if (refreshToken) {
                try {
                    // Try to refresh token
                    const refreshUrl = `${BASE_URL.replace(/\/$/, "")}/api/auth/refresh?refreshToken=${refreshToken}`;
                    const refreshResponse = await fetch(refreshUrl, { method: "POST" });

                    if (refreshResponse.ok) {
                        const refreshData = await refreshResponse.json();
                        const newAccessToken = refreshData.accessToken || refreshData.data?.accessToken;
                        const newRefreshToken = refreshData.refreshToken || refreshData.data?.refreshToken;

                        if (newAccessToken && typeof window !== "undefined") {
                            localStorage.setItem("accessToken", newAccessToken);
                            if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

                            console.log("✅ Token refreshed successfully. Retrying queued requests.");

                            // Process queued requests
                            refreshQueue.forEach(callback => callback(newAccessToken));
                            refreshQueue = [];
                            isRefreshing = false;

                            // Retry current request
                            response = await fetch(url, {
                                ...options,
                                headers: getHeaders(),
                            });
                        } else {
                            throw new Error("Invalid refresh response");
                        }
                    } else {
                        throw new Error("Refresh failed");
                    }
                } catch (error) {
                    console.error("❌ Token refresh failed:", error);
                    isRefreshing = false;
                    refreshQueue = [];
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
                    }
                    throw new Error("Session expired. Please login again.");
                }
            } else {
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
                }
                throw new Error("Unauthorized");
            }
        } else {
            // Wait for refresh to complete
            console.log(`⏳ Refresh in progress. Queuing request for ${endpoint}`);
            return new Promise<ApiResponse<T>>((resolve) => {
                refreshQueue.push((newToken: string) => {
                    resolve(fetcher<T>(endpoint, options));
                });
            });
        }
    }

    // Handle empty responses (e.g., 204 No Content, or empty body)
    const text = await response.text();
    let data;

    try {
        // Check if response is XML (common for backend error responses)
        if (text.trim().startsWith('<')) {
            console.warn("Received XML response instead of JSON:", text);

            // Try to extract error message from XML
            const messageMatch = text.match(/<message>(.*?)<\/message>/);
            const statusMatch = text.match(/<status>(\d+)<\/status>/);
            const errorMatch = text.match(/<error>(.*?)<\/error>/);

            throw new Error(
                messageMatch?.[1] ||
                errorMatch?.[1] ||
                `Server error (${statusMatch?.[1] || response.status})`
            );
        }

        data = text ? JSON.parse(text) : {};
    } catch (error) {
        // If it's already an Error object (from XML parsing above), rethrow it
        if (error instanceof Error && error.message !== "Unexpected token '<', \"<ErrorResp\"... is not valid JSON") {
            throw error;
        }

        console.error("Failed to parse response as JSON:", text);
        throw new Error("Invalid response format from server");
    }

    if (!response.ok) {
        const errorMessage = data?.message || "An error occurred";
        console.error(`❌ API Error [${response.status}] ${url}:`, errorMessage);
        throw new Error(`${errorMessage} (Status: ${response.status})`);
    }

    // Normalize response
    if (data.success && !data.data) {
        const { success, message, ...payload } = data;
        return {
            success,
            message,
            data: payload as T
        };
    }

    return data as ApiResponse<T>;
}

export const apiClient = {
    get: async <T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
        let url = endpoint;
        if (params) {
            const queryString = new URLSearchParams(
                Object.entries(params).reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== null) {
                        acc[key] = String(value);
                    }
                    return acc;
                }, {} as Record<string, string>)
            ).toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }
        return fetcher<T>(url, { method: "GET" });
    },

    post: async <T>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
        return fetcher<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        });
    },

    put: async <T>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
        return fetcher<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    },

    patch: async <T>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
        return fetcher<T>(endpoint, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    },

    delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
        return fetcher<T>(endpoint, { method: "DELETE" });
    },

    uploadFile: async <T>(
        endpoint: string,
        file: File,
        additionalData?: Record<string, any>,
        fileField: string = "file"
    ): Promise<ApiResponse<T>> => {
        const formData = new FormData();
        formData.append(fileField, file);

        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
        }

        return fetcher<T>(endpoint, {
            method: "POST",
            body: formData,
        });
    },
};
