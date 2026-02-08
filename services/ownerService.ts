import { apiClient } from "./apiClient";
import {
    ApiResponse,
    OwnerProfile,
    UpdateProfileRequest,
    BankDetails,
    NotificationPreferences
} from "@/types/api";

/**
 * OwnerService handles user profile and settings.
 */
export const OwnerService = {
    /**
     * Get current owner profile
     */
    getProfile: async (): Promise<ApiResponse<OwnerProfile>> => {
        return await apiClient.get<OwnerProfile>(
            process.env.NEXT_PUBLIC_USER_PROFILE || "/owner/profile"
        );
    },

    /**
     * Update owner profile
     */
    updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<OwnerProfile>> => {
        return await apiClient.patch<OwnerProfile>(
            process.env.NEXT_PUBLIC_USER_UPDATE_PROFILE || "/owner/profile/update",
            data
        );
    },

    /**
     * Upload profile avatar
     */
    uploadAvatar: async (image: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
        return await apiClient.uploadFile<{ avatarUrl: string }>(
            process.env.NEXT_PUBLIC_USER_UPLOAD_AVATAR || "/owner/profile/avatar",
            image
        );
    },

    /**
     * Get bank details
     */
    getBankDetails: async (): Promise<ApiResponse<BankDetails>> => {
        return await apiClient.get<BankDetails>(
            process.env.NEXT_PUBLIC_USER_BANK_DETAILS || "/owner/bank-details"
        );
    },

    /**
     * Update bank details
     */
    updateBankDetails: async (data: BankDetails): Promise<ApiResponse<BankDetails>> => {
        return await apiClient.put<BankDetails>(
            process.env.NEXT_PUBLIC_USER_BANK_DETAILS || "/owner/bank-details",
            data
        );
    },

    /**
     * Get notification preferences
     */
    getNotificationPreferences: async (): Promise<ApiResponse<NotificationPreferences>> => {
        return await apiClient.get<NotificationPreferences>(
            process.env.NEXT_PUBLIC_USER_NOTIFICATIONS || "/owner/notifications"
        );
    },

    /**
     * Update notification preferences
     */
    updateNotificationPreferences: async (data: NotificationPreferences): Promise<ApiResponse<NotificationPreferences>> => {
        return await apiClient.put<NotificationPreferences>(
            process.env.NEXT_PUBLIC_USER_NOTIFICATIONS || "/owner/notifications",
            data
        );
    }
};
