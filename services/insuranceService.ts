import { apiClient } from './apiClient';

export interface OwnerVehicleInsurance {
    id: number;
    vehicleId: number;
    vehicleName: string;
    insuranceId: number;
    insuranceType: 'BASIC' | 'STANDARD' | 'PREMIUM';
    insuranceName: string;
    insuranceDescription: string;
    coveragePoints: string[];
    dailyPrice: number;
    weeklyPrice: number;
    monthlyPrice: number;
    isIncluded: boolean;
    isActive: boolean;
    excessAmount: number | null;
    depositAmount: number | null;
    ownerNotes: string | null;
    isCustom: boolean;
    customName?: string;
    customDescription?: string;
    createdAt: string;
    updatedAt: string | null;
}

// NEW: Owner-level insurance (global for all vehicles)
export interface OwnerInsurance {
    id: number;
    ownerId: number;
    ownerName: string;
    insuranceId: number;
    insuranceType: 'BASIC' | 'STANDARD' | 'PREMIUM';
    insuranceName: string;
    insuranceDescription: string;
    coveragePoints: string[];
    dailyPrice: number;
    weeklyPrice: number;
    monthlyPrice: number;
    isIncluded: boolean;
    isActive: boolean;
    excessAmount: number | null;
    depositAmount: number | null;
    ownerNotes: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface InsuranceUpdateRequest {
    dailyPrice?: number;
    weeklyPrice?: number;
    monthlyPrice?: number;
    isIncluded?: boolean;
    isActive?: boolean;
    excessAmount?: number;
    depositAmount?: number;
    ownerNotes?: string;
    customName?: string;
    customDescription?: string;
}

export interface InsuranceCreateRequest {
    vehicleId: number;
    insuranceId: number;
    dailyPrice: number;
    weeklyPrice?: number;
    monthlyPrice?: number;
    isIncluded?: boolean;
    excessAmount?: number;
    depositAmount?: number;
    ownerNotes?: string;
    isCustom?: boolean;
    customName?: string;
    customDescription?: string;
}

// Insurance template from the system (default prices)
export interface InsuranceTemplate {
    id: number;
    insuranceType: 'BASIC' | 'STANDARD' | 'PREMIUM';
    name: string;
    description: string;
    coveragePoints: string;
    dailyPrice: number;
    weeklyPrice: number;
    monthlyPrice: number;
    deductibleAmount: number;
    coverageLimit: number;
    maxClaimValue: number;
    currency: string;
    isActive: boolean;
    isDefault: boolean;
}

const unwrapResponse = <T>(response: any): T => {
    if (Array.isArray(response)) {
        return response as T;
    }
    if (response && typeof response === "object" && "data" in response) {
        return (response as { data: T }).data;
    }
    return response as T;
};

const insuranceService = {
    // ===== INSURANCE TEMPLATES (System defaults) =====

    /**
     * Get all active insurance templates (BASIC, STANDARD, PREMIUM)
     * These show the system default prices and coverage info
     */
    getInsuranceTemplates: async (): Promise<InsuranceTemplate[]> => {
        const response = await apiClient.get<InsuranceTemplate[]>('/insurances/active');
        const data = unwrapResponse<InsuranceTemplate[]>(response);
        return Array.isArray(data) ? data : [];
    },

    /**
     * Initialize insurance templates (BASIC, STANDARD, PREMIUM)
     */
    initInsuranceTemplates: async (): Promise<string> => {
        const response = await apiClient.post<{ message?: string } | string>('/insurances/init');
        const data = unwrapResponse<{ message?: string } | string>(response);
        if (typeof data === "string") {
            return data;
        }
        return data?.message || "OK";
    },

    // ===== VEHICLE-LEVEL INSURANCE (Legacy) =====
    getInsurancesForVehicle: async (vehicleId: number): Promise<OwnerVehicleInsurance[]> => {
        const response = await apiClient.get<OwnerVehicleInsurance[]>(`/owner-vehicle-insurances/vehicle/${vehicleId}`);
        const data = unwrapResponse<OwnerVehicleInsurance[]>(response);
        return Array.isArray(data) ? data : [];
    },

    getInsurancesForCarOwner: async (carOwnerId: number): Promise<OwnerVehicleInsurance[]> => {
        const response = await apiClient.get<OwnerVehicleInsurance[]>(`/owner-vehicle-insurances/car-owner/${carOwnerId}`);
        const data = unwrapResponse<OwnerVehicleInsurance[]>(response);
        return Array.isArray(data) ? data : [];
    },

    setupDefaultInsurances: async (vehicleId: number, standardDailyPrice?: number, premiumDailyPrice?: number): Promise<OwnerVehicleInsurance[]> => {
        const params = new URLSearchParams();
        if (standardDailyPrice !== undefined) params.append('standardDailyPrice', standardDailyPrice.toString());
        if (premiumDailyPrice !== undefined) params.append('premiumDailyPrice', premiumDailyPrice.toString());

        const response = await apiClient.post<OwnerVehicleInsurance[]>(
            `/owner-vehicle-insurances/vehicle/${vehicleId}/setup-defaults?${params.toString()}`
        );
        const data = unwrapResponse<OwnerVehicleInsurance[]>(response);
        return Array.isArray(data) ? data : [];
    },

    updateInsurance: async (id: number, request: InsuranceUpdateRequest): Promise<OwnerVehicleInsurance> => {
        const response = await apiClient.put<OwnerVehicleInsurance>(`/owner-vehicle-insurances/${id}`, request);
        return unwrapResponse<OwnerVehicleInsurance>(response);
    },

    addInsuranceToVehicle: async (request: InsuranceCreateRequest): Promise<OwnerVehicleInsurance> => {
        const response = await apiClient.post<OwnerVehicleInsurance>('/owner-vehicle-insurances', request);
        return unwrapResponse<OwnerVehicleInsurance>(response);
    },

    getInsuranceByType: async (type: string): Promise<any> => {
        const response = await apiClient.get<any>(`/insurances/type/${type}`);
        return unwrapResponse<any>(response);
    },

    deleteInsurance: async (id: number): Promise<void> => {
        await apiClient.delete(`/owner-vehicle-insurances/${id}`);
    },

    updateGlobalInsurance: async (carOwnerId: number, insuranceType: string, request: InsuranceUpdateRequest): Promise<OwnerVehicleInsurance[]> => {
        const response = await apiClient.put<OwnerVehicleInsurance[]>(
            `/owner-vehicle-insurances/global?carOwnerId=${carOwnerId}&insuranceType=${insuranceType}`,
            request
        );
        const data = unwrapResponse<OwnerVehicleInsurance[]>(response);
        return Array.isArray(data) ? data : [];
    },

    setupDefaultInsurancesForAllOwnerVehicles: async (carOwnerId: number, standardDailyPrice?: number, premiumDailyPrice?: number): Promise<OwnerVehicleInsurance[]> => {
        const params = new URLSearchParams();
        if (standardDailyPrice !== undefined) params.append('standardDailyPrice', standardDailyPrice.toString());
        if (premiumDailyPrice !== undefined) params.append('premiumDailyPrice', premiumDailyPrice.toString());

        const response = await apiClient.post<OwnerVehicleInsurance[]>(
            `/owner-vehicle-insurances/car-owner/${carOwnerId}/setup-all-defaults?${params.toString()}`
        );
        const data = unwrapResponse<OwnerVehicleInsurance[]>(response);
        return Array.isArray(data) ? data : [];
    },

    // ===== OWNER-LEVEL INSURANCE (New Global System) =====

    /**
     * Get all owner-level insurances for an owner
     */
    getOwnerInsurances: async (ownerId: number): Promise<OwnerInsurance[]> => {
        const response = await apiClient.get<OwnerInsurance[]>(`/owner-insurances/owner/${ownerId}`);
        const data = unwrapResponse<OwnerInsurance[]>(response);
        return Array.isArray(data) ? data : [];
    },

    /**
     * Get active owner-level insurances
     */
    getActiveOwnerInsurances: async (ownerId: number): Promise<OwnerInsurance[]> => {
        const response = await apiClient.get<OwnerInsurance[]>(`/owner-insurances/owner/${ownerId}/active`);
        const data = unwrapResponse<OwnerInsurance[]>(response);
        return Array.isArray(data) ? data : [];
    },

    /**
     * Get owner insurance by type (BASIC, STANDARD, PREMIUM)
     */
    getOwnerInsuranceByType: async (ownerId: number, insuranceType: string): Promise<OwnerInsurance> => {
        const response = await apiClient.get<OwnerInsurance>(`/owner-insurances/owner/${ownerId}/type/${insuranceType}`);
        return unwrapResponse<OwnerInsurance>(response);
    },

    /**
     * Setup default owner-level insurances (BASIC, STANDARD, PREMIUM)
     */
    setupOwnerDefaults: async (ownerId: number, standardDailyPrice?: number, premiumDailyPrice?: number): Promise<OwnerInsurance[]> => {
        const params = new URLSearchParams();
        if (standardDailyPrice !== undefined) params.append('standardDailyPrice', standardDailyPrice.toString());
        if (premiumDailyPrice !== undefined) params.append('premiumDailyPrice', premiumDailyPrice.toString());

        const response = await apiClient.post<OwnerInsurance[]>(
            `/owner-insurances/owner/${ownerId}/setup-defaults?${params.toString()}`
        );
        const data = unwrapResponse<OwnerInsurance[]>(response);
        return Array.isArray(data) ? data : [];
    },

    /**
     * Update owner-level insurance pricing
     */
    updateOwnerInsurance: async (id: number, request: InsuranceUpdateRequest): Promise<OwnerInsurance> => {
        const response = await apiClient.put<OwnerInsurance>(`/owner-insurances/${id}`, request);
        return unwrapResponse<OwnerInsurance>(response);
    },

    /**
     * Delete owner-level insurance
     */
    deleteOwnerInsurance: async (id: number): Promise<void> => {
        await apiClient.delete(`/owner-insurances/${id}`);
    }
};

export default insuranceService;
