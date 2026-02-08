export const MOCK_VEHICLES = [
    {
        id: "v1",
        name: "Tesla Model 3",
        plate: "ABC-1234",
        status: "Active",
        earnings: "$1,250",
        trips: 12,
        rating: 4.8,
        bodyType: "Sedan",
        fuel: "Electric",
        transmission: "Automatic",
        seats: 5
    },
    {
        id: "v2",
        name: "BMW X5",
        plate: "XYZ-9876",
        status: "Rented",
        earnings: "$3,400",
        trips: 8,
        rating: 4.9,
        bodyType: "SUV",
        fuel: "Gasoline",
        transmission: "Automatic",
        seats: 7
    },
    {
        id: "v3",
        name: "Mercedes C-Class",
        plate: "LMN-4567",
        status: "Maintenance",
        earnings: "$950",
        trips: 5,
        rating: 4.7,
        bodyType: "Sedan",
        fuel: "Gasoline",
        transmission: "Automatic",
        seats: 5
    },
    {
        id: "v4",
        name: "Audi Q7",
        plate: "QRS-1122",
        status: "Active",
        earnings: "$2,100",
        trips: 15,
        rating: 4.6,
        bodyType: "SUV",
        fuel: "Diesel",
        transmission: "Automatic",
        seats: 7
    },
    {
        id: "v5",
        name: "Ford Mustang",
        plate: "MUS-5566",
        status: "Active",
        earnings: "$1,800",
        trips: 10,
        rating: 4.8,
        bodyType: "Coupe",
        fuel: "Gasoline",
        transmission: "Automatic",
        seats: 4
    }
];

export const MOCK_KPIS = [
    { label: "Total Earnings", value: "$12,450", trend: "+12.5%", trendUp: true, color: "blue" },
    { label: "Active Rentals", value: "8", trend: "+2", trendUp: true, color: "green" },
    { label: "Pending Bookings", value: "3", trend: "-1", trendUp: false, color: "purple" },
    { label: "Vehicle Utilization", value: "85%", trend: "+5%", trendUp: true, color: "orange" }
];

export const MOCK_BOOKINGS = [
    {
        id: "b1",
        vehicleName: "Tesla Model 3",
        customerName: "John Doe",
        startDate: "2024-03-10",
        endDate: "2024-03-15",
        totalPrice: "$450",
        status: "Completed"
    },
    {
        id: "b2",
        vehicleName: "BMW X5",
        customerName: "Jane Smith",
        startDate: "2024-03-12",
        endDate: "2024-03-18",
        totalPrice: "$1,200",
        status: "Active"
    },
    {
        id: "b3",
        vehicleName: "Mercedes C-Class",
        customerName: "Robert Johnson",
        startDate: "2024-03-20",
        endDate: "2024-03-25",
        totalPrice: "$600",
        status: "Pending"
    }
];

export const MOCK_EARNINGS = [
    { month: "Jan", amount: 4500 },
    { month: "Feb", amount: 5200 },
    { month: "Mar", amount: 4800 },
    { month: "Apr", amount: 6100 },
    { month: "May", amount: 5900 },
    { month: "Jun", amount: 7500 }
];

export const MOCK_TRANSACTIONS = [
    { id: "t1", date: "2024-03-15", description: "Payout for March", amount: "-$2,500.00", status: "Paid" },
    { id: "t2", date: "2024-03-14", description: "Rental - BMW X5", amount: "+$450.00", status: "Processing" },
    { id: "t3", date: "2024-03-12", description: "Maintenance - Mercedes", amount: "-$120.00", status: "Paid" }
];
