"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";

/**
 * Custom hook to automatically refresh JWT tokens every 15 minutes
 * Keeps the user's session alive by refreshing the access token before it expires
 */
export function useTokenRefresh() {
    const router = useRouter();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Function to refresh the token
        const refreshAccessToken = async () => {
            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    console.warn("No refresh token found, skipping token refresh");
                    return;
                }

                console.log("🔄 Refreshing access token...");
                const response = await AuthService.refreshToken(refreshToken);

                if (response.success && response.data) {
                    // Update tokens in localStorage
                    localStorage.setItem("accessToken", response.data.accessToken);
                    localStorage.setItem("refreshToken", response.data.refreshToken);

                    // Update user data if needed
                    if (response.data.user) {
                        localStorage.setItem("user", JSON.stringify(response.data.user));
                    }

                    console.log("✅ Token refreshed successfully");
                } else {
                    throw new Error("Token refresh failed");
                }
            } catch (error) {
                console.warn("⚠️ Token refresh failed:", error);

                // Only redirect to login if we had a refresh token but it failed
                // This prevents redirecting when user is already logged out
                const hadRefreshToken = localStorage.getItem("refreshToken");
                if (hadRefreshToken) {
                    console.log("Refresh token expired, redirecting to login...");
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                    router.push("/login");
                }
            }
        };

        // Check if user is authenticated before starting refresh
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken || !refreshToken) {
            console.log("User not authenticated, token refresh disabled");
            return;
        }

        // Set up interval to refresh every 15 minutes (900,000 milliseconds)
        const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
        intervalRef.current = setInterval(refreshAccessToken, REFRESH_INTERVAL);

        console.log("🔄 Token refresh interval started (every 15 minutes)");

        // Listen for unauthorized events (401 + refresh failed) to redirect to login
        const handleUnauthorized = () => {
            console.log("🔒 Received auth:unauthorized event. Refresh failed or no token. Redirecting to login...");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            router.push("/login");
        };

        window.addEventListener("auth:unauthorized", handleUnauthorized);

        // Cleanup interval and event listener on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                console.log("Token refresh interval cleared");
            }
            window.removeEventListener("auth:unauthorized", handleUnauthorized);
        };
    }, [router]);
}
