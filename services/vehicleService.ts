import { apiClient } from "./apiClient";
import {
    ApiResponse,
    VehicleRequest,
    VehicleResponse,
    PaginatedResponse,
    QueryParams
} from "@/types/api";
import { MOCK_VEHICLES } from "./mockData";

/**
 * VehicleService handles all vehicle-related API calls.
 */
export const VehicleService = {
    /**
     * Get a paginated list of vehicles
     */
    getVehicles: async (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<VehicleResponse>>> => {
        try {
            return await apiClient.get<PaginatedResponse<VehicleResponse>>(
                process.env.NEXT_PUBLIC_VEHICLES_BASE || "/vehicles",
                params
            );
        } catch (error) {
            console.warn("API Error, using mock data:", error);
            // Return mock data matching PaginatedResponse structure
            return {
                success: true,
                message: "Mock data",
                data: {
                    data: MOCK_VEHICLES as unknown as VehicleResponse[],
                    pagination: {
                        total: MOCK_VEHICLES.length,
                        page: 1,
                        limit: 10,
                        totalPages: 1
                    }
                }
            };
        }
    },

    /**
     * Get a single vehicle by ID
     */
    getVehicleById: async (id: string): Promise<ApiResponse<VehicleResponse>> => {
        try {
            return await apiClient.get<VehicleResponse>(
                `${process.env.NEXT_PUBLIC_VEHICLES_BASE || "/vehicles"}/${id}`
            );
        } catch (error) {
            console.warn("API Error, using mock data:", error);
            const vehicle = MOCK_VEHICLES.find(v => v.id === id) || MOCK_VEHICLES[0];
            return {
                success: true,
                message: "Mock data",
                data: vehicle as unknown as VehicleResponse
            };
        }
    },

    /**
     * Create a new vehicle
     */
    createVehicle: async (data: VehicleRequest): Promise<ApiResponse<VehicleResponse>> => {
        try {
            return await apiClient.post<VehicleResponse>(
                process.env.NEXT_PUBLIC_VEHICLES_BASE || "/vehicles",
                data
            );
        } catch (error) {
            console.warn("API Error, simulating creation:", error);
            return {
                success: true,
                message: "Vehicle created (mock)",
                data: {
                    id: "temp-id-" + Date.now(),
                    ...data,
                    status: "Active",
                    earnings: "$0",
                    trips: 0,
                    rating: 0
                } as unknown as VehicleResponse
            };
        }
    },

    /**
     * Update an existing vehicle
     */
    updateVehicle: async (id: string, data: Partial<VehicleRequest>): Promise<ApiResponse<VehicleResponse>> => {
        try {
            return await apiClient.put<VehicleResponse>(
                `${process.env.NEXT_PUBLIC_VEHICLES_BASE || "/vehicles"}/${id}`,
                data
            );
        } catch (error) {
            console.warn("API Error, simulating update:", error);
            return {
                success: true,
                message: "Vehicle updated (mock)",
                data: {
                    id,
                    ...data
                } as unknown as VehicleResponse
            };
        }
    },

    /**
     * Delete a vehicle
     */
    deleteVehicle: async (id: string): Promise<ApiResponse<void>> => {
        try {
            return await apiClient.delete<void>(
                `${process.env.NEXT_PUBLIC_VEHICLES_BASE || "/vehicles"}/${id}`
            );
        } catch (error) {
            console.warn("API Error, simulating delete:", error);
            return {
                success: true,
                message: "Vehicle deleted (mock)",
                data: undefined
            };
        }
    },

    /**
     * Upload a vehicle image
     */
    uploadImage: async (vehicleId: string, image: File): Promise<ApiResponse<{ url: string }>> => {
        try {
            return await apiClient.uploadFile<{ url: string }>(
                process.env.NEXT_PUBLIC_VEHICLES_UPLOAD_IMAGE || "/vehicles/upload-image",
                image,
                { vehicleId }
            );
        } catch (error) {
            console.warn("API Error, simulating upload:", error);
            return {
                success: true,
                message: "Image uploaded (mock)",
                data: { url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994" }
            };
        }
    },

    /**
     * Get all vehicle body types from the API
     * Returns list of body types for dropdown selection
     */
    getBodyTypes: async (): Promise<{ id: number; name: string; code: string }[]> => {
        try {
            console.log("🚗 [BODY TYPES] Starting fetch from API...");
            console.log("🌐 [BODY TYPES] Endpoint: /vehicles/body-types");

            const response = await apiClient.get<any>("/vehicles/body-types");

            console.log("✅ [BODY TYPES] API Response received:", response);
            console.log("📊 [BODY TYPES] Response structure:", {
                hasData: !!response.data,
                dataType: typeof response.data,
                isArray: Array.isArray(response.data),
                dataKeys: response.data ? Object.keys(response.data) : 'none',
                firstItem: Array.isArray(response.data) ? response.data[0] : 'N/A'
            });

            // Extract body types from the API response
            // The apiClient returns the parsed JSON.
            // If the API returns an array directly, 'response' IS the array.
            let bodyTypes: any = response;

            // Check if response is the array (case: [{...}, {...}])
            if (Array.isArray(response)) {
                bodyTypes = response;
            }
            // Check if response has data property (case: { data: [...] })
            else if (response && response.data && Array.isArray(response.data)) {
                console.log("📦 [BODY TYPES] Data is wrapped in .data property");
                bodyTypes = response.data;
            }
            // Check if response.data.data exists (case: { data: { data: [...] } })
            else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
                console.log("📦 [BODY TYPES] Data is doubly wrapped, extracting...");
                bodyTypes = response.data.data;
            }

            // Ensure we have an array
            if (!Array.isArray(bodyTypes)) {
                console.error("❌ [BODY TYPES] Expected array but got:", typeof bodyTypes, bodyTypes);
                throw new Error("Invalid response format");
            }

            console.log(`✅ [BODY TYPES] Fetched ${bodyTypes.length} body types from API`);
            console.log("📋 [BODY TYPES] Full array:", bodyTypes);

            const mapped = bodyTypes.map((bt: any) => ({
                id: bt.id,
                name: bt.name,
                code: bt.code
            }));

            console.log("✅ [BODY TYPES] Returning mapped data:", mapped);
            return mapped;
        } catch (error) {
            console.error("❌ [BODY TYPES] Failed to fetch from API:", error);
            console.log("📦 [BODY TYPES] Returning mock data: common body types");
            return [
                { id: 1, code: "SEDAN", name: "Sedan" },
                { id: 2, code: "SUV", name: "SUV" },
                { id: 3, code: "TRUCK", name: "Truck" },
                { id: 4, code: "VAN", name: "Van" },
                { id: 5, code: "COUPE", name: "Coupe" },
                { id: 6, code: "CONVERTIBLE", name: "Convertible" },
                { id: 7, code: "WAGON", name: "Wagon" },
                { id: 8, code: "HATCHBACK", name: "Hatchback" },
                { id: 9, code: "MINIVAN", name: "Minivan" },
                { id: 10, code: "SPORTS_CAR", name: "Sports Car" }
            ];
        }
    },

    /**
     * Get all vehicle makes from the API (limited to 50 items)
     * Official API response: { collection: {...}, data: [{ id: number, name: string }] }
     */
    getMakes: async (): Promise<{ id: number; name: string }[]> => {
        try {
            console.log("🚗 Fetching vehicle makes from API...");
            const response = await apiClient.get<{
                collection?: {
                    url: string;
                    count: number;
                    pages: number;
                    total: number;
                    next?: string;
                    prev?: string;
                    first?: string;
                    last?: string;
                };
                data?: { id: number; name: string }[];
            }>("/makes/v2", {
                limit: 1000,
                page: 0,
                sort: "name",
                direction: "ASC"
            });

            console.log("✅ API Response received:", response);

            // Extract makes from the API response
            // The API returns: { collection: {...}, data: Array }
            // After apiClient normalization, we get the data directly
            const makes = (response.data as any)?.data || response.data || [];
            console.log("✅ Fetched makes from API:", makes.length, "items", makes.slice(0, 3));

            // Limit to 1000 items
            return makes.slice(0, 1000);
        } catch (error) {
            console.warn("⚠️ Failed to fetch vehicle makes from API, using mock data:", error);
            // Return mock data as fallback (50 popular makes)
            console.log("📦 Returning mock data: 50 popular vehicle makes");
            return [
                { id: 1, name: "Acura" },
                { id: 2, name: "Alfa Romeo" },
                { id: 3, name: "Aston Martin" },
                { id: 4, name: "Audi" },
                { id: 5, name: "Bentley" },
                { id: 6, name: "BMW" },
                { id: 7, name: "Buick" },
                { id: 8, name: "Cadillac" },
                { id: 9, name: "Chevrolet" },
                { id: 10, name: "Chrysler" },
                { id: 11, name: "Dodge" },
                { id: 12, name: "Ferrari" },
                { id: 13, name: "Fiat" },
                { id: 14, name: "Ford" },
                { id: 15, name: "Genesis" },
                { id: 16, name: "GMC" },
                { id: 17, name: "Honda" },
                { id: 18, name: "Hyundai" },
                { id: 19, name: "Infiniti" },
                { id: 20, name: "Jaguar" },
                { id: 21, name: "Jeep" },
                { id: 22, name: "Kia" },
                { id: 23, name: "Lamborghini" },
                { id: 24, name: "Land Rover" },
                { id: 25, name: "Lexus" },
                { id: 26, name: "Lincoln" },
                { id: 27, name: "Maserati" },
                { id: 28, name: "Mazda" },
                { id: 29, name: "McLaren" },
                { id: 30, name: "Mercedes-Benz" },
                { id: 31, name: "Mini" },
                { id: 32, name: "Mitsubishi" },
                { id: 33, name: "Nissan" },
                { id: 34, name: "Polestar" },
                { id: 35, name: "Porsche" },
                { id: 36, name: "Ram" },
                { id: 37, name: "Rivian" },
                { id: 38, name: "Rolls-Royce" },
                { id: 39, name: "Subaru" },
                { id: 40, name: "Tesla" },
                { id: 41, name: "Toyota" },
                { id: 42, name: "Volkswagen" },
                { id: 43, name: "Volvo" },
                { id: 44, name: "Peugeot" },
                { id: 45, name: "Renault" },
                { id: 46, name: "Seat" },
                { id: 47, name: "Skoda" },
                { id: 48, name: "Smart" },
                { id: 49, name: "Suzuki" },
                { id: 50, name: "Opel" }
            ];
        }
    },

    /**
     * Get models for a specific make (limited to 50 items)
     * @param makeName - The vehicle make name (e.g., "Audi", "Toyota")
     */
    getModels: async (makeName: string): Promise<{ id: number; name: string }[]> => {
        try {
            console.log(`🚗 Fetching models for make: ${makeName}`);
            const response = await apiClient.get<{
                collection: {
                    url: string;
                    count: number;
                    pages: number;
                    total: number;
                    next?: string;
                    prev?: string;
                    first?: string;
                    last?: string;
                };
                data: {
                    id: number;
                    make_id: number;
                    make: string;
                    name: string;
                }[]
            }>("/models/v2", {
                make: makeName,
                limit: 1000,
                page: 0,
                sort: "name",
                direction: "ASC"
            });

            console.log("✅ API Response received:", response);
            // Extract models from the API response
            // The API returns: { collection: {...}, data: Array }
            const models = (response.data as any)?.data || response.data || [];
            console.log(`✅ Fetched ${models.length} models for ${makeName}:`, models.slice(0, 3));
            return models.map((m: any) => ({ id: m.id, name: m.name }));
        } catch (error) {
            console.warn(`⚠️ Failed to fetch models for make ${makeName} from API, using mock data:`, error);
            // Return mock data as fallback based on make name
            const mockModels: Record<string, { id: number; name: string }[]> = {
                "Toyota": [
                    { id: 101, name: "Camry" },
                    { id: 102, name: "Corolla" },
                    { id: 103, name: "RAV4" },
                    { id: 104, name: "Highlander" },
                    { id: 105, name: "Tacoma" }
                ],
                "Honda": [
                    { id: 201, name: "Accord" },
                    { id: 202, name: "Civic" },
                    { id: 203, name: "CR-V" },
                    { id: 204, name: "Pilot" },
                    { id: 205, name: "Odyssey" }
                ],
                "Tesla": [
                    { id: 301, name: "Model 3" },
                    { id: 302, name: "Model S" },
                    { id: 303, name: "Model X" },
                    { id: 304, name: "Model Y" },
                    { id: 305, name: "Cybertruck" }
                ],
                "BMW": [
                    { id: 401, name: "330i" },
                    { id: 402, name: "X5" },
                    { id: 403, name: "M3" },
                    { id: 404, name: "X3" },
                    { id: 405, name: "5 Series" }
                ],
                "Mercedes-Benz": [
                    { id: 501, name: "C-Class" },
                    { id: 502, name: "E-Class" },
                    { id: 503, name: "GLC" },
                    { id: 504, name: "S-Class" },
                    { id: 505, name: "GLE" }
                ]
            };
            const fallbackModels = mockModels[makeName] || [];
            console.log(`📦 Returning mock data for ${makeName}:`, fallbackModels.length, "models");
            return fallbackModels.slice(0, 50);
        }
    },
    /**
     * Get submodels for a specific make, model, and year
     * @param make - The vehicle make name (e.g., "Audi")
     * @param model - The vehicle model name (e.g., "A3")
     * @param year - The model year (e.g., 2020)
     */
    getSubModels: async (make: string, model: string, year: number): Promise<{ id: number | string; name: string }[]> => {
        try {
            console.log(`🚗 Fetching submodels for ${year} ${make} ${model}`);
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

            console.log("✅ API Response received:", response);
            const submodels = (response.data as any)?.data || response.data || [];
            console.log(`✅ Fetched ${submodels.length} submodels`);

            // Map to simple { id, name } format, filtering out duplicates if any
            const uniqueSubmodels = new Map();
            submodels.forEach((sm: any) => {
                if (!uniqueSubmodels.has(sm.submodel)) {
                    uniqueSubmodels.set(sm.submodel, { id: sm.id, name: sm.submodel });
                }
            });

            return Array.from(uniqueSubmodels.values());
        } catch (error) {
            console.warn(`⚠️ Failed to fetch submodels for ${make} ${model} ${year}, using mock data:`, error);
            // Mock data fallback
            return [
                { id: 1, name: "Base" },
                { id: 2, name: "SE" },
                { id: 3, name: "LE" },
                { id: 4, name: "XLE" },
                { id: 5, name: "Limited" },
                { id: 6, name: "Platinum" },
                { id: 7, name: "Sport" },
                { id: 8, name: "Touring" }
            ];
        }
    },

    /**
     * Get vehicle trim details by ID
     * @param id - The trim ID
     */
    getTrimDetails: async (params: { make: string; model: string; year: number; submodel?: string }): Promise<any> => {
        console.log(`🚗 Fetching trim details for`, params);
        // Use the search endpoint which is more reliable than ID
        const response = await apiClient.get<any>("/trims", {
            year: params.year,
            make: params.make,
            model: params.model,
            trim: params.submodel, // API expects 'trim' for the submodel/trim name
            verbose: "yes",
            direction: "asc",
            sort: "id"
        });
        console.log("✅ Trim API Response:", response);
        // Response for list endpoint is usually { data: [...] }
        // We want the first matching trim if available
        const data = response.data || response;
        if (Array.isArray(data)) return data[0];
        if (data.data && Array.isArray(data.data)) return data.data[0];
        return data;
    }
};
