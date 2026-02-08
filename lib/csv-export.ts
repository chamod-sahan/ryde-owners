import { Booking } from "@/services/dashboardService";

export function exportBookingsToCSV(bookings: Booking[]) {
    // Define CSV headers
    const headers = ["Booking ID", "Vehicle", "Customer", "Start Date", "End Date", "Status", "Total Price"];

    // Map booking data to CSV rows
    const rows = bookings.map(booking => [
        booking.id,
        `"${booking.vehicleName}"`, // Quote strings that might contain commas
        `"${booking.customerName}"`,
        booking.startDate,
        booking.endDate,
        booking.status,
        `"${booking.totalPrice}"`
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n");

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);

        // Generate filename with current date
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute("download", `bookings_export_${date}.csv`);

        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
