import { apiClient } from "./apiClient";
import {
    ApiResponse,
    VehicleRequest,
    VehicleResponse,
    PaginatedResponse,
    QueryParams,
    VehicleSearchResponse,
    VehicleRegistrationRequest
} from "@/types/api";

/**
 * VehicleService handles all vehicle-related API calls.
 * All data comes from backend APIs only - no mock data.
 */
export const VehicleService = {
    /**
     * Get a paginated list of vehicles
     */
    getVehicles: async (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<VehicleResponse>>> => {
        console.log("🚗 Fetching vehicles from API...");
        const response = await apiClient.get<PaginatedResponse<VehicleResponse>>(
            process.env.NEXT_PUBLIC_VEHICLES_BASE || "/vehicles",
            params
        );
        return {
            success: true,
            message: "Vehicles fetched",
            data: response.data || response
        } as ApiResponse<PaginatedResponse<VehicleResponse>>;
    },

    /**
     * Get a single vehicle by ID
     */
    getVehicleById: async (id: string): Promise<ApiResponse<VehicleResponse>> => {
        console.log(`🚗 Fetching vehicle ${id} from API...`);
        const response = await apiClient.get<VehicleResponse>(
            `${process.env.NEXT_PUBLIC_VEHICLES_BASE || "/vehicles"}/${id}`
        );
        return {
            success: true,
            message: "Vehicle fetched",
            data: response.data || response
        } as ApiResponse<VehicleResponse>;
    },

    /**
     * Create a new vehicle
     */
    createVehicle: async (data: VehicleRequest): Promise<ApiResponse<VehicleResponse>> => {
        console.log("🚗 Creating vehicle...");
        return await apiClient.post<VehicleResponse>(
            process.env.NEXT_PUBLIC_VEHICLES_BASE || "/vehicles",
            data
        );
    },

    /**
     * Update an existing vehicle
     */
    updateVehicle: async (id: string, data: Partial<VehicleRequest>): Promise<ApiResponse<VehicleResponse>> => {
        console.log(`🚗 Updating vehicle ${id}...`);
        return await apiClient.put<VehicleResponse>(
            `${process.env.NEXT_PUBLIC_VEHICLES_BASE || "/vehicles"}/${id}`,
            data
        );
    },

    /**
     * Delete a vehicle
     */
    deleteVehicle: async (id: string): Promise<ApiResponse<void>> => {
        console.log(`🚗 Deleting vehicle ${id}...`);
        return await apiClient.delete<void>(
            `${process.env.NEXT_PUBLIC_VEHICLES_BASE || "/vehicles"}/${id}`
        );
    },

    /**
     * Upload a vehicle image
     */
    uploadImage: async (vehicleId: string, image: File): Promise<ApiResponse<{ url: string }>> => {
        console.log(`🚗 Uploading image for vehicle ${vehicleId}...`);
        return await apiClient.uploadFile<{ url: string }>(
            process.env.NEXT_PUBLIC_VEHICLES_UPLOAD_IMAGE || "/vehicles/upload-image",
            image,
            { vehicleId }
        );
    },

    /**
     * Get all vehicle body types from the API
     * Using /api/vehicles/comprehensive/body-types or fallback
     */
    getBodyTypes: async (): Promise<{ id: number; name: string; code: string }[]> => {
        console.log("🚗 Fetching body types from API...");
        try {
            // Try body-types endpoint
            const response = await apiClient.get<any>("/body-types");
            const data = Array.isArray(response) ? response : (response.data || []);
            console.log(`✅ Fetched ${data.length} body types`);
            return data.map((bt: any) => ({
                id: bt.id,
                name: bt.name,
                code: bt.code
            }));
        } catch (error) {
            console.error("❌ Failed to fetch body types:", error);
            return [];
        }
    },

    /**
     * Get all vehicle makes from the API
     * Using /api/vehicles/comprehensive/makes endpoint
     */
    getMakes: async (): Promise<{ id: number; name: string }[]> => {
        console.log("🚗 Fetching vehicle makes from API...");
        const response = await apiClient.get<any>("/vehicles/comprehensive/makes");
        const data = Array.isArray(response) ? response : (response.data || []);
        console.log(`✅ Fetched ${data.length} vehicle makes`);
        return data.map((m: any) => ({ id: m.id, name: m.name }));
    },

    /**
     * Get models for a specific make by makeId
     * Using /api/vehicles/comprehensive/models?makeId=X endpoint
     */
    getModels: async (makeName: string, makeId?: number): Promise<{ id: number; name: string }[]> => {
        console.log(`🚗 Fetching models for make: ${makeName} (id: ${makeId})`);

        if (!makeId) {
            console.warn("⚠️ No makeId provided, cannot fetch models");
            return [];
        }

        const response = await apiClient.get<any>("/vehicles/comprehensive/models", { makeId });
        const data = Array.isArray(response) ? response : (response.data || []);
        console.log(`✅ Fetched ${data.length} models for ${makeName}`);
        return data.map((m: any) => ({ id: m.id, name: m.name }));
    },

    /**
     * Get submodels for a specific make, model, and year
     */
    getSubModels: async (make: string, model: string, year: number): Promise<{ id: number | string; name: string }[]> => {
        console.log(`🚗 Fetching submodels for ${year} ${make} ${model}`);
        try {
            const response = await apiClient.get<{
                collection: any;
                data: {
                    id: number;
                    oem_make_model_id: number;
                    year: number;
                    make: string;
                    model: string;
                    submodel: string;
                }[]
            }>("/submodels/v2", {
                make,
                model,
                year,
                limit: 1000,
                page: 0,
                sort: "submodel",
                direction: "ASC"
            });

            const submodels = (response.data as any)?.data || response.data || [];
            console.log(`✅ Fetched ${submodels.length} submodels`);

            // Map to simple { id, name } format, filtering out duplicates
            const uniqueSubmodels = new Map();
            submodels.forEach((sm: any) => {
                if (!uniqueSubmodels.has(sm.submodel)) {
                    uniqueSubmodels.set(sm.submodel, { id: sm.id, name: sm.submodel });
                }
            });

            return Array.from(uniqueSubmodels.values());
        } catch (error) {
            console.error("❌ Failed to fetch submodels:", error);
            return [];
        }
    },

    /**
     * Get vehicle trim details
     */
    getTrimDetails: async (params: { make: string; model: string; year: number; submodel?: string }): Promise<any> => {
        console.log(`🚗 Fetching trim details for`, params);
        const response = await apiClient.get<any>("/trims", {
            year: params.year,
            make: params.make,
            model: params.model,
            trim: params.submodel,
            verbose: "yes",
            direction: "asc",
            sort: "id"
        });
        const data = response.data || response;
        if (Array.isArray(data)) return data[0];
        if (data.data && Array.isArray(data.data)) return data.data[0];
        return data;
    },

    /**
     * Search vehicle by make, model, year
     * Returns available=true with vehicle data if exists, or available=false if not
     */
    searchSpecs: async (makeId: number, modelId: number, year: number): Promise<VehicleSearchResponse> => {
        console.log(`🔍 Searching vehicle specs: makeId=${makeId}, modelId=${modelId}, year=${year}`);
        const response = await apiClient.get<VehicleSearchResponse>(
            "/owner-vehicles/search-specs",
            { makeId, modelId, year }
        );
        const data = (response as any).data || response;
        return data as VehicleSearchResponse;
    },

    /**
     * Register vehicle with simplified flow (auto-create if needed)
     */
    registerVehicleSimplified: async (
        carOwnerId: number,
        request: VehicleRegistrationRequest
    ): Promise<ApiResponse<any>> => {
        console.log(`🚗 Registering vehicle for owner: ${carOwnerId}`);
        return await apiClient.post<any>(
            `/owner-vehicles/register-simplified?carOwnerId=${carOwnerId}`,
            request
        );
    },

    /**
     * Get fuel types from API
     * Using /api/vehicles/comprehensive/fuel-types endpoint
     */
    getFuelTypes: async (): Promise<{ id: number; name: string; code: string }[]> => {
        console.log("🚗 Fetching fuel types from API...");
        const response = await apiClient.get<any>("/vehicles/comprehensive/fuel-types");
        const data = Array.isArray(response) ? response : (response.data || []);
        console.log(`✅ Fetched ${data.length} fuel types`);
        return data.map((ft: any) => ({ id: ft.id, name: ft.name, code: ft.code }));
    },

    /**
     * Get transmission types from API
     * Using /api/vehicles/comprehensive/transmissions endpoint
     */
    getTransmissions: async (): Promise<{ id: number; name: string; code: string }[]> => {
        console.log("🚗 Fetching transmissions from API...");
        const response = await apiClient.get<any>("/vehicles/comprehensive/transmissions");
        const data = Array.isArray(response) ? response : (response.data || []);
        console.log(`✅ Fetched ${data.length} transmissions`);
        return data.map((t: any) => ({ id: t.id, name: t.name, code: t.code }));
    },

    /**
     * Get drive types from API
     * Using /api/vehicles/comprehensive/drive-types endpoint
     */
    getDriveTypes: async (): Promise<{ id: number; name: string; code: string }[]> => {
        console.log("🚗 Fetching drive types from API...");
        const response = await apiClient.get<any>("/vehicles/comprehensive/drive-types");
        const data = Array.isArray(response) ? response : (response.data || []);
        console.log(`✅ Fetched ${data.length} drive types`);
        return data.map((dt: any) => ({ id: dt.id, name: dt.name, code: dt.code }));
    }
};
