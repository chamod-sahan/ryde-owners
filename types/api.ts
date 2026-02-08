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
    plate: string;
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
    plate: string;
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
