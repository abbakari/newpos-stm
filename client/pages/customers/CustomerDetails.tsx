import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Car,
  FileText,
  DollarSign,
  Clock,
  User,
  Building2,
  Eye,
  Download,
  Plus,
  CheckCircle,
  AlertCircle,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock customer data - in real app this would come from API
const mockCustomer = {
  id: "CUST-001",
  firstName: "John",
  lastName: "Doe",
  companyName: "",
  customerType: "Personal",
  subType: "Car Owner",
  phone: "+256 700 123 456",
  email: "john.doe@email.com",
  altPhone: "+256 702 456 789",
  address: "123 Main Street, Kololo",
  city: "Kampala",
  district: "Kampala",
  country: "Uganda",
  nationalId: "CM1234567890",
  isOwner: true,
  registeredDate: "2024-01-15",
  lastVisit: "2024-01-20",
  totalOrders: 5,
  totalSpent: 1250000,
  status: "Active",
  vehicles: [
    {
      id: "VEH-001",
      make: "Toyota",
      model: "Camry",
      year: "2020",
      plateNumber: "UAG 123A",
      color: "Black",
      engineNumber: "ENG123456",
      chassisNumber: "CHS789012",
    },
    {
      id: "VEH-002",
      make: "Honda",
      model: "Civic",
      year: "2019",
      plateNumber: "UAG 456B",
      color: "White",
      engineNumber: "ENG654321",
      chassisNumber: "CHS210987",
    },
  ],
  orderHistory: [
    {
      id: "ORD-1234",
      date: "2024-01-20",
      service: "Oil Change",
      vehicle: "Toyota Camry",
      amount: 150000,
      status: "Completed",
      invoice: "INV-001234",
      duration: "45 minutes",
    },
    {
      id: "ORD-1230",
      date: "2024-01-15",
      service: "Tire Replacement",
      vehicle: "Honda Civic",
      amount: 800000,
      status: "Completed",
      invoice: "INV-001230",
      duration: "2 hours",
    },
    {
      id: "ORD-1225",
      date: "2024-01-10",
      service: "Engine Diagnostic",
      vehicle: "Toyota Camry",
      amount: 200000,
      status: "Completed",
      invoice: "INV-001225",
      duration: "1.5 hours",
    },
    {
      id: "ORD-1220",
      date: "2024-01-05",
      service: "Brake Service",
      vehicle: "Honda Civic",
      amount: 100000,
      status: "Completed",
      invoice: "INV-001220",
      duration: "1 hour",
    },
  ],
  invoices: [
    {
      id: "INV-001234",
      orderId: "ORD-1234",
      date: "2024-01-20",
      amount: 150000,
      status: "Paid",
      dueDate: "2024-01-20",
      paymentMethod: "Cash",
    },
    {
      id: "INV-001230",
      orderId: "ORD-1230",
      date: "2024-01-15",
      amount: 800000,
      status: "Paid",
      dueDate: "2024-01-15",
      paymentMethod: "Mobile Money",
    },
  ],
  notes:
    "Regular customer, prefers morning appointments. Very particular about service quality.",
  preferredServices: ["Oil Change", "Tire Installation", "Engine Repair"],
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
    case "Paid":
      return "bg-success text-success-foreground";
    case "In Progress":
    case "Pending":
      return "bg-warning text-warning-foreground";
    case "Cancelled":
    case "Overdue":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getCustomerTypeColor = (type: string) => {
  switch (type) {
    case "Government":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "NGO":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Private":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "Personal":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function CustomerDetails() {
  const { customerId } = useParams();
  const [customer] = useState(mockCustomer); // In real app, fetch by customerId

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/customers/search">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {customer.companyName ||
                `${customer.firstName} ${customer.lastName}`}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge
                variant="outline"
                className={getCustomerTypeColor(customer.customerType)}
              >
                {customer.customerType}
              </Badge>
              <Badge className={getStatusColor(customer.status)}>
                {customer.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ID: {customer.id}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Customer
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{customer.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(customer.totalSpent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehicles</p>
                <p className="text-2xl font-bold">{customer.vehicles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Visit</p>
                <p className="text-2xl font-bold">{customer.lastVisit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Customer Type:
                    </span>
                    <Badge
                      variant="outline"
                      className={getCustomerTypeColor(customer.customerType)}
                    >
                      {customer.customerType} - {customer.subType}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      National ID:
                    </span>
                    <span className="text-sm font-medium">
                      {customer.nationalId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Owner Status:
                    </span>
                    <span className="text-sm font-medium">
                      {customer.isOwner
                        ? "Vehicle Owner"
                        : "Driver/Representative"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Registered:
                    </span>
                    <span className="text-sm font-medium">
                      {customer.registeredDate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{customer.phone}</p>
                      <p className="text-xs text-muted-foreground">Primary</p>
                    </div>
                  </div>
                  {customer.altPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {customer.altPhone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Alternative
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{customer.email}</p>
                      <p className="text-xs text-muted-foreground">Email</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{customer.address}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.city}, {customer.district}, {customer.country}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Service Preferences & Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Preferred Services:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {customer.preferredServices.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Notes:</p>
                  <p className="text-sm">{customer.notes}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Registered Vehicles
                  </CardTitle>
                  <CardDescription>
                    {customer.vehicles.length} vehicles registered
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {customer.vehicles.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className="border-l-4 border-l-primary"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-lg">
                            {vehicle.make} {vehicle.model}
                          </h4>
                          <Badge variant="outline">{vehicle.year}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Plate:
                            </span>
                            <span className="font-medium ml-1">
                              {vehicle.plateNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Color:
                            </span>
                            <span className="font-medium ml-1">
                              {vehicle.color}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Engine:
                            </span>
                            <span className="font-medium ml-1">
                              {vehicle.engineNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Chassis:
                            </span>
                            <span className="font-medium ml-1">
                              {vehicle.chassisNumber}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            History
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Order History
                  </CardTitle>
                  <CardDescription>
                    Complete history of all services and orders
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.orderHistory.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.service}</TableCell>
                        <TableCell>{order.vehicle}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {order.duration}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(order.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Invoice History
                  </CardTitle>
                  <CardDescription>
                    All invoices and payment records
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.id}
                        </TableCell>
                        <TableCell>{invoice.orderId}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(invoice.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{invoice.paymentMethod}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
