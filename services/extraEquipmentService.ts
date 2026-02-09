import { apiClient } from "./apiClient";

export interface ExtraEquipmentTemplate {
    id: number;
    equipmentName: string;
    description: string;
    category: string;
    commissionPercentage: number;
    isActive: boolean;
    isCommon: boolean;
}

export interface OwnerExtraEquipment {
    id: number;
    ownerId: number;
    ownerName: string;
    extraEquipmentId: number;
    equipmentName: string;
    equipmentCategory: string;
    equipmentDescription: string | null;
    commissionPercentage: number;
    basePrice: number;
    fullPrice: number;
    basePriceWithCommission?: number | null;
    fullPriceWithCommission?: number | null;
    isAvailable: boolean;
    notes?: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface OwnerExtraEquipmentCreateRequest {
    extraEquipmentId: number;
    basePrice: number;
    fullPrice?: number;
    isAvailable?: boolean;
    notes?: string;
}

export interface OwnerExtraEquipmentUpdateRequest {
    basePrice?: number;
    fullPrice?: number;
    isAvailable?: boolean;
    notes?: string;
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

export const extraEquipmentService = {
    getCommonEquipments: async (): Promise<ExtraEquipmentTemplate[]> => {
        const response = await apiClient.get<ExtraEquipmentTemplate[]>("/extra-equipments/common");
        const data = unwrapResponse<ExtraEquipmentTemplate[]>(response);
        return Array.isArray(data) ? data : [];
    },

    getOwnerEquipments: async (ownerId: number): Promise<OwnerExtraEquipment[]> => {
        const response = await apiClient.get<OwnerExtraEquipment[]>(`/owner-extra-equipments/owner/${ownerId}`);
        const data = unwrapResponse<OwnerExtraEquipment[]>(response);
        return Array.isArray(data) ? data : [];
    },

    getActiveOwnerEquipments: async (ownerId: number): Promise<OwnerExtraEquipment[]> => {
        const response = await apiClient.get<OwnerExtraEquipment[]>(`/owner-extra-equipments/owner/${ownerId}/active`);
        const data = unwrapResponse<OwnerExtraEquipment[]>(response);
        return Array.isArray(data) ? data : [];
    },

    createOwnerEquipment: async (ownerId: number, request: OwnerExtraEquipmentCreateRequest): Promise<OwnerExtraEquipment> => {
        const response = await apiClient.post<OwnerExtraEquipment>(`/owner-extra-equipments/owner/${ownerId}`, request);
        return unwrapResponse<OwnerExtraEquipment>(response);
    },

    updateOwnerEquipment: async (id: number, request: OwnerExtraEquipmentUpdateRequest): Promise<OwnerExtraEquipment> => {
        const response = await apiClient.put<OwnerExtraEquipment>(`/owner-extra-equipments/${id}`, request);
        return unwrapResponse<OwnerExtraEquipment>(response);
    },

    updateAvailability: async (id: number, isAvailable: boolean): Promise<OwnerExtraEquipment> => {
        const response = await apiClient.patch<OwnerExtraEquipment>(`/owner-extra-equipments/${id}/availability?isAvailable=${isAvailable}`);
        return unwrapResponse<OwnerExtraEquipment>(response);
    }
};
