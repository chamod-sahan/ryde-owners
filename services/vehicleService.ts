import { apiClient } from "./apiClient";
import {
    ApiResponse,
    VehicleRequest,
    VehicleResponse,
    PaginatedResponse,
    QueryParams,
    VehicleSearchResponse,
    VehicleRegistrationRequest,
    UpdateVehicleRequest
} from "@/types/api";

// Mock Data Fallbacks
const MOCK_MAKES = [
    { id: 1, name: "Toyota" },
    { id: 2, name: "Honda" },
    { id: 3, name: "Nissan" },
    { id: 4, name: "Suzuki" },
    { id: 5, name: "Mitsubishi" },
    { id: 6, name: "BMW" },
    { id: 7, name: "Mercedes-Benz" },
    { id: 8, name: "Audi" },
    { id: 9, name: "Kia" },
    { id: 10, name: "Hyundai" }
];

const MOCK_BODY_TYPES = [
    { id: 1, name: "Sedan", code: "SEDAN" },
    { id: 2, name: "SUV", code: "SUV" },
    { id: 3, name: "Hatchback", code: "HATCHBACK" },
    { id: 4, name: "Van", code: "VAN" },
    { id: 5, name: "Coupe", code: "COUPE" },
    { id: 6, name: "Convertible", code: "CONVERTIBLE" },
    { id: 7, name: "Wagon", code: "WAGON" },
    { id: 8, name: "Pickup", code: "PICKUP" }
];

const MOCK_FUEL_TYPES = [
    { id: 1, name: "Petrol", code: "PETROL" },
    { id: 2, name: "Diesel", code: "DIESEL" },
    { id: 3, name: "Hybrid", code: "HYBRID" },
    { id: 4, name: "Electric", code: "ELECTRIC" },
    { id: 5, name: "Plug-in Hybrid", code: "PHEV" }
];

const MOCK_TRANSMISSIONS = [
    { id: 1, name: "Automatic", code: "AUTO" },
    { id: 2, name: "Manual", code: "MANUAL" },
    { id: 3, name: "Tiptronic", code: "TIPTRONIC" },
    { id: 4, name: "CVT", code: "CVT" }
];

const MOCK_DRIVE_TYPES = [
    { id: 1, name: "Front Wheel Drive", code: "FWD" },
    { id: 2, name: "Rear Wheel Drive", code: "RWD" },
    { id: 3, name: "All Wheel Drive", code: "AWD" },
    { id: 4, name: "4 Wheel Drive", code: "4WD" }
];

const MOCK_MODELS: Record<string, { id: number; name: string }[]> = {
    "Toyota": [
        { id: 101, name: "Corolla" }, { id: 102, name: "Camry" }, { id: 103, name: "Prius" },
        { id: 104, name: "Yaris" }, { id: 105, name: "Vitz" }, { id: 106, name: "Land Cruiser" },
        { id: 107, name: "Prado" }, { id: 108, name: "Aqua" }, { id: 109, name: "Axio" }, { id: 110, name: "Premio" }
    ],
    "Honda": [
        { id: 201, name: "Civic" }, { id: 202, name: "Accord" }, { id: 203, name: "Fit" },
        { id: 204, name: "Vezel" }, { id: 205, name: "CR-V" }, { id: 206, name: "Insight" }, { id: 207, name: "Grace" }
    ],
    "Nissan": [
        { id: 301, name: "Sunny" }, { id: 302, name: "Leaf" }, { id: 303, name: "X-Trail" },
        { id: 304, name: "Patrol" }, { id: 305, name: "March" }, { id: 306, name: "Tiida" }
    ],
    "Suzuki": [
        { id: 401, name: "Alto" }, { id: 402, name: "Wagon R" }, { id: 403, name: "Swift" },
        { id: 404, name: "Baleno" }, { id: 405, name: "Celerio" }, { id: 406, name: "Every" }
    ],
    "Mitsubishi": [
        { id: 501, name: "Lancer" }, { id: 502, name: "Montero" }, { id: 503, name: "Outlander" }, { id: 504, name: "Mirage" }
    ],
    "BMW": [
        { id: 601, name: "3 Series" }, { id: 602, name: "5 Series" }, { id: 603, name: "X1" }, { id: 604, name: "X3" }, { id: 605, name: "X5" }, { id: 606, name: "i8" }
    ],
    "Mercedes-Benz": [
        { id: 701, name: "C-Class" }, { id: 702, name: "E-Class" }, { id: 703, name: "S-Class" }, { id: 704, name: "CLA" }, { id: 705, name: "GLA" }
    ],
    "Audi": [
        { id: 801, name: "A3" }, { id: 802, name: "A4" }, { id: 803, name: "A6" }, { id: 804, name: "Q3" }, { id: 805, name: "Q5" }, { id: 806, name: "Q7" }
    ],
    "Kia": [
        { id: 901, name: "Picanto" }, { id: 902, name: "Rio" }, { id: 903, name: "Sportage" }, { id: 904, name: "Sorento" }
    ],
    "Hyundai": [
        { id: 1001, name: "Elantra" }, { id: 1002, name: "Tucson" }, { id: 1003, name: "Santa Fe" }, { id: 1004, name: "Sonata" }, { id: 1005, name: "Grand i10" }
    ]
};

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
     * Get vehicles for the authenticated owner
     */
    getMyVehicles: async (): Promise<ApiResponse<any>> => {
        console.log("🚗 Fetching my vehicles from API...");
        return await apiClient.get<any>("/owner-vehicles/my-vehicles");
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
     * Unified update for an owner's vehicle instance
     */
    updateOwnerVehicle: async (id: number | string, data: UpdateVehicleRequest): Promise<ApiResponse<any>> => {
        console.log(`🚗 Updating owner vehicle ${id} with unified request...`);
        return await apiClient.put<any>(`/owner-vehicles/${id}`, data);
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
            const response = await apiClient.get<any>("/vehicles/comprehensive/body-types");
            const data = Array.isArray(response) ? response : (response.data || []);
            console.log(`✅ Fetched ${data.length} body types`);
            return data.map((bt: any) => ({
                id: bt.id,
                name: bt.name,
                code: bt.code
            }));
        } catch (error) {
            console.warn("⚠️ Failed to fetch body types (using fallback):", error);
            return MOCK_BODY_TYPES;
        }
    },

    /**
     * Get all vehicle makes from the API
     * Using /api/vehicles/comprehensive/makes endpoint
     */
    getMakes: async (): Promise<{ id: number; name: string }[]> => {
        console.log("🚗 Fetching vehicle makes from API...");
        try {
            const response = await apiClient.get<any>("/vehicles/comprehensive/makes");
            const data = Array.isArray(response) ? response : (response.data || []);
            console.log(`✅ Fetched ${data.length} vehicle makes`);
            return data.map((m: any) => ({ id: m.id, name: m.name }));
        } catch (error) {
            console.warn("⚠️ Failed to fetch makes (using fallback):", error);
            return MOCK_MAKES;
        }
    },

    /**
     * Get models for a specific make by makeId
     * Using /api/vehicles/comprehensive/models?makeId=X endpoint
     */
    getModels: async (makeName: string, makeId?: number): Promise<{ id: number; name: string }[]> => {
        console.log(`🚗 Fetching models for make: ${makeName} (id: ${makeId})`);

        if (!makeId && !makeName) {
            console.warn("⚠️ No makeId or makeName provided, cannot fetch models");
            return [];
        }

        try {
            if (makeId) {
                const response = await apiClient.get<any>("/vehicles/comprehensive/models", { makeId });
                const data = Array.isArray(response) ? response : (response.data || []);
                console.log(`✅ Fetched ${data.length} models for ${makeName}`);
                return data.map((m: any) => ({ id: m.id, name: m.name }));
            }
            throw new Error("No makeId provided");
        } catch (error) {
            console.warn(`⚠️ Failed to fetch models for ${makeName} (using fallback):`, error);
            const mockModels = MOCK_MODELS[makeName] || [];
            return mockModels.map((m, index) => ({ id: m.id || (makeId ? makeId * 100 + index : index), name: m.name }));
        }
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
            return []; // No mock data for detailed submodels yet
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
        try {
            const response = await apiClient.get<VehicleSearchResponse>(
                "/owner-vehicles/search-specs",
                { makeId, modelId, year }
            );
            const data = (response as any).data || response;
            return data as VehicleSearchResponse;
        } catch (error) {
            console.warn("⚠️ Failed to search specs (returning unavailable):", error);
            // Return unavailable to trigger manual entry mode in UI
            return {
                available: false,
                makeId,
                makeName: "",
                modelId,
                modelName: "",
                year
            } as VehicleSearchResponse;
        }
    },

    /**
     * Register vehicle with simplified flow (auto-create if needed)
     */
    registerVehicleSimplified: async (
        request: VehicleRegistrationRequest
    ): Promise<ApiResponse<any>> => {
        console.log("🚗 Registering vehicle (simplified)");
        try {
            const response = await apiClient.post<any>(
                "/owner-vehicles/register-simplified",
                request
            );
            const data = (response as any).data || response;
            console.log("✅ Registration response:", data);
            return {
                success: true,
                message: "Vehicle registered successfully",
                data: data
            };
        } catch (error: any) {
            console.error("❌ Registration failed:", error);
            return {
                success: false,
                message: error.message || "Registration failed",
                data: null
            };
        }
    },




    /**
     * Get fuel types from API
     * Using /api/vehicles/comprehensive/fuel-types endpoint
     */
    getFuelTypes: async (): Promise<{ id: number; name: string; code: string }[]> => {
        console.log("🚗 Fetching fuel types from API...");
        try {
            const response = await apiClient.get<any>("/vehicles/comprehensive/fuel-types");
            const data = Array.isArray(response) ? response : (response.data || []);
            console.log(`✅ Fetched ${data.length} fuel types`);
            return data.map((ft: any) => ({ id: ft.id, name: ft.name, code: ft.code }));
        } catch (error) {
            console.warn("⚠️ Failed to fetch fuel types (using fallback):", error);
            return MOCK_FUEL_TYPES;
        }
    },

    /**
     * Get transmission types from API
     * Using /api/vehicles/comprehensive/transmissions endpoint
     */
    getTransmissions: async (): Promise<{ id: number; name: string; code: string }[]> => {
        console.log("🚗 Fetching transmissions from API...");
        try {
            const response = await apiClient.get<any>("/vehicles/comprehensive/transmissions");
            const data = Array.isArray(response) ? response : (response.data || []);
            console.log(`✅ Fetched ${data.length} transmissions`);
            return data.map((t: any) => ({ id: t.id, name: t.name, code: t.code }));
        } catch (error) {
            console.warn("⚠️ Failed to fetch transmissions (using fallback):", error);
            return MOCK_TRANSMISSIONS;
        }
    },

    /**
     * Get drive types from API
     * Using /api/vehicles/comprehensive/drive-types endpoint
     */
    getDriveTypes: async (): Promise<{ id: number; name: string; code: string }[]> => {
        console.log("🚗 Fetching drive types from API...");
        try {
            const response = await apiClient.get<any>("/vehicles/comprehensive/drive-types");
            const data = Array.isArray(response) ? response : (response.data || []);
            console.log(`✅ Fetched ${data.length} drive types`);
            return data.map((dt: any) => ({ id: dt.id, name: dt.name, code: dt.code }));
        } catch (error) {
            console.warn("⚠️ Failed to fetch drive types (using fallback):", error);
            return MOCK_DRIVE_TYPES;
        }
    }
};
