import { apiClient } from "./apiClient";
import {
    ApiResponse,
    LoginRequest,
    SignupRequest,
    AuthResponse,
    RefreshTokenRequest,
    ResetPasswordRequest,
    VerifyEmailRequest
} from "@/types/api";

/**
 * AuthService handles all authentication-related API calls.
 */
export const AuthService = {
    /**
     * Login with email and password
     */
    login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
        return await apiClient.post<AuthResponse>(
            process.env.NEXT_PUBLIC_AUTH_LOGIN || "/auth/login",
            credentials
        );
    },

    /**
     * Register a new user
     */
    signup: async (data: SignupRequest): Promise<ApiResponse<AuthResponse>> => {
        return await apiClient.post<AuthResponse>(
            process.env.NEXT_PUBLIC_AUTH_SIGNUP || "/auth/register",
            data
        );
    },

    /**
     * Logout the current user
     * Note: This may fail with 401 if token is expired, but we still want to clear local storage
     */
    logout: async (): Promise<ApiResponse<void>> => {
        try {
            return await apiClient.post<void>(
                process.env.NEXT_PUBLIC_AUTH_LOGOUT || "/auth/logout"
            );
        } catch (error) {
            // Logout should succeed even if the API call fails (e.g., expired token)
            // The client-side cleanup will happen regardless
            console.warn("Logout API call failed, but proceeding with client-side cleanup:", error);
            return {
                success: true,
                message: "Logged out (client-side)",
                data: undefined
            };
        }
    },

    /**
     * Refresh the access token using the refresh token
     */
    refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
        const endpoint = process.env.NEXT_PUBLIC_AUTH_REFRESH || "/auth/refresh";
        // Pass refreshToken as query param in POST request
        const url = `${endpoint}?refreshToken=${refreshToken}`;
        return await apiClient.post<AuthResponse>(url);
    },

    /**
     * Request a password reset
     */
    resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<void>> => {
        return await apiClient.post<void>(
            process.env.NEXT_PUBLIC_AUTH_RESET_PASSWORD || "/auth/reset-password",
            data
        );
    },

    /**
     * Verify email address with token
     */
    verifyEmail: async (data: VerifyEmailRequest): Promise<ApiResponse<void>> => {
        return await apiClient.post<void>(
            process.env.NEXT_PUBLIC_AUTH_VERIFY_EMAIL || "/auth/verify-email",
            data
        );
    },

    /**
     * Get current user profile
     */
    getProfile: async (): Promise<ApiResponse<AuthResponse>> => {
        return await apiClient.get<AuthResponse>(
            "/auth/profile"
        );
    }
};
