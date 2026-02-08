// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    error: string;
    message: string;
    statusCode: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Authentication Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface AuthResponse {
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
        isActive: boolean;
        emailVerified: boolean;
        logoUrl?: string;
    };
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface ResetPasswordRequest {
    email: string;
}

export interface VerifyEmailRequest {
    token: string;
}

// Vehicle Types
export interface VehicleRequest {
    name: string;
    bodyType: string;
    fuel: string;
    transmission: string;
    seats: number;
    description?: string;
    pricePerDay?: number;
}

export interface VehicleResponse {
    id: string;
    name: string;
    status: "Active" | "Rented" | "Maintenance";
    earnings: string;
    trips: number;
    rating: number;
    bodyType: string;
    fuel: string;
    transmission: string;
    seats: number;
    description?: string;
    pricePerDay?: number;
    images?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface UploadImageRequest {
    vehicleId: string;
    image: File;
}

// Vehicle Search Response (from /owner-vehicles/search-specs)
export interface VehicleSearchResponse {
    makeId: number;
    makeName: string;
    modelId: number;
    modelName: string;
    year: number;
    available: boolean; // true if vehicle exists, false if not
    // If vehicle exists (available = true)
    vehicleId?: number;
    fuelTypeId?: number;
    fuelTypeName?: string;
    transmissionId?: number;
    transmissionName?: string;
    driveTypeId?: number;
    driveTypeName?: string;
    seats?: number;
    doors?: number;
    colorImages?: VehicleColorImage[];
    // If vehicle doesn't exist (available = false)
    message?: string;
}

export interface VehicleColorImage {
    colorId: number;
    colorName: string;
    colorCode: string;
    thumbUrl: string;
    imageUrl: string;
}

// Vehicle Registration Request (for /owner-vehicles/register-simplified)
export interface VehicleRegistrationRequest {
    // Vehicle identification
    vehicleId?: number; // Optional: use existing vehicle
    makeId: number;
    modelId: number;
    year: number;
    // Vehicle specs (required if vehicle doesn't exist)
    fuelTypeId: number;
    transmissionId: number;
    driveTypeId: number;
    seats: number;
    doors: number;
    // Owner registration
    userId: number;
    bodyTypeId: number;
    location: string;
    pricePerDay: number;
    pricePerHour?: number;
    pricePerWeek?: number;
    pricePerMonth?: number;
    description?: string;
    vehicleCount?: number;
    features?: string[];
}

// Booking Types

export interface BookingResponse {
    id: string;
    vehicleId: string;
    vehicleName: string;
    customerId: string;
    customerName: string;
    startDate: string;
    endDate: string;
    totalPrice: string;
    status: "Pending" | "Active" | "Completed" | "Cancelled";
    createdAt: string;
}

export interface UpdateBookingStatusRequest {
    bookingId: string;
    status: "Pending" | "Active" | "Completed" | "Cancelled";
}

export interface BookingFilters {
    status?: string;
    vehicleId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

// User/Owner Types
export interface OwnerProfile {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
    bankDetails?: BankDetails;
    notificationPreferences?: NotificationPreferences;
    createdAt: string;
}

export interface BankDetails {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
}

export interface NotificationPreferences {
    emailNotifications: boolean;
    smsNotifications: boolean;
    bookingAlerts: boolean;
    paymentAlerts: boolean;
}

export interface UpdateProfileRequest {
    fullName?: string;
    phone?: string;
    bankDetails?: BankDetails;
}

export interface UserResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isActive: boolean;
    emailVerified: boolean;
    logoUrl?: string;
    addresses?: CarOwnerAddressResponse[];
}

export interface CarOwnerAddressResponse {
    id: number;
    carOwnerId: number;
    businessName: string;
    addressType: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    isPrimary: boolean;
    isActive: boolean;
    contactPerson?: string;
    phoneNumber?: string;
    email?: string;
    operatingHours?: string;
    description?: string;
}

// Transaction Types
export interface TransactionResponse {
    id: string;
    date: string;
    description: string;
    amount: string;
    status: "Processing" | "Paid" | "Failed";
    type: "Payout" | "Earning" | "Refund";
    bookingId?: string;
}

export interface PayoutRequest {
    amount: number;
    bankDetailsId: string;
}

export interface TransactionFilters {
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

// Analytics Types
export interface KPIResponse {
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
    color: "blue" | "green" | "purple" | "orange";
}

export interface EarningsData {
    month: string;
    amount: number;
}

export interface VehiclePerformance {
    vehicleId: string;
    vehicleName: string;
    totalEarnings: number;
    totalTrips: number;
    averageRating: number;
    utilizationRate: number;
}

export interface BookingStats {
    totalBookings: number;
    activeBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    averageBookingValue: number;
}

// Utility Types
export interface QueryParams {
    [key: string]: string | number | boolean | undefined;
}
