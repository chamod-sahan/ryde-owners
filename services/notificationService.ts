import { apiClient } from "@/services/apiClient";

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    createdAt: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        title: "New Booking Request",
        message: "You have a new booking request for Toyota Camry.",
        type: "info",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    },
    {
        id: "2",
        title: "Vehicle Maintenance Due",
        message: "Audi A4 is due for scheduled maintenance.",
        type: "warning",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
        id: "3",
        title: "Weekly Earnings Report",
        message: "Your earnings report for last week is ready.",
        type: "success",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        id: "4",
        title: "Payment Received",
        message: "You received a payment of LKR 45,000.",
        type: "success",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    }
];

export const NotificationService = {
    getNotifications: async (): Promise<Notification[]> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_NOTIFICATIONS;
    },

    markAsRead: async (id: string): Promise<void> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        const notification = MOCK_NOTIFICATIONS.find(n => n.id === id);
        if (notification) {
            notification.read = true;
        }
    },

    markAllAsRead: async (): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        MOCK_NOTIFICATIONS.forEach(n => n.read = true);
    }
};
