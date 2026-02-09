import { apiClient } from "./apiClient";
import { ApiResponse, UserResponse } from "@/types/api";

export const ProfileService = {
    /**
     * Get current user profile with logo and addresses
     */
    getProfile: async (): Promise<ApiResponse<UserResponse>> => {
        return await apiClient.get<UserResponse>("/profile");
    },

    /**
     * Update profile information
     */
    updateProfile: async (data: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
    }): Promise<ApiResponse<UserResponse>> => {
        return await apiClient.put<UserResponse>("/profile", data);
    },

    /**
     * Upload owner logo file
     */
    uploadLogo: async (file: File): Promise<ApiResponse<any>> => {
        return await apiClient.uploadFile<any>("/car-owners/logo/upload", file);
    },

    /**
     * Delete owner logo
     */
    deleteLogo: async (): Promise<ApiResponse<void>> => {
        return await apiClient.delete<void>("/car-owners/logo");
    },
};
