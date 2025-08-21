import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Car,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Activity,
  Plus,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statsCards = [
  {
    title: "Total Customers",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    description: "Active customers this month",
  },
  {
    title: "Active Orders",
    value: "143",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: ClipboardList,
    description: "Currently in progress",
  },
  {
    title: "Completed Today",
    value: "28",
    change: "-3.1%",
    changeType: "negative" as const,
    icon: CheckCircle,
    description: "Services completed today",
  },
  {
    title: "Revenue (Today)",
    value: "$12,450",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "Total earnings today",
  },
];

const recentOrders = [
  {
    id: "ORD-1234",
    customer: "John Doe",
    service: "Car Service - Oil Change",
    status: "in-progress",
    time: "10:30 AM",
    estimatedCompletion: "12:00 PM",
    type: "Personal",
  },
  {
    id: "ORD-1235",
    customer: "Sarah Wilson",
    service: "Tire Replacement",
    status: "waiting",
    time: "11:15 AM",
    estimatedCompletion: "2:00 PM",
    type: "Government",
  },
  {
    id: "ORD-1236",
    customer: "Mike Johnson",
    service: "Consultation",
    status: "completed",
    time: "9:00 AM",
    estimatedCompletion: "9:30 AM",
    type: "Private",
  },
  {
    id: "ORD-1237",
    customer: "Express Delivery Co.",
    service: "Fleet Maintenance",
    status: "in-progress",
    time: "8:30 AM",
    estimatedCompletion: "3:00 PM",
    type: "NGO",
  },
];

const serviceProgress = [
  { service: "Car Services", completed: 45, total: 60, percentage: 75 },
  { service: "Tire Services", completed: 28, total: 35, percentage: 80 },
  { service: "Consultations", completed: 12, total: 15, percentage: 80 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-success text-success-foreground";
    case "in-progress":
      return "bg-info text-info-foreground";
    case "waiting":
      return "bg-warning text-warning-foreground";
    case "delayed":
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

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor your business performance and track customer services
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="flex items-center mt-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    stat.changeType === "positive"
                      ? "text-success"
                      : "text-destructive",
                  )}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  from last month
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <CardDescription>
                  Latest customer orders and their status
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-foreground">
                        {order.id}
                      </span>
                      <Badge
                        className={getStatusColor(order.status)}
                        variant="secondary"
                      >
                        {order.status.replace("-", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getCustomerTypeColor(order.type)}
                      >
                        {order.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground font-medium">
                      {order.customer}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.service}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {order.time}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Est. completion: {order.estimatedCompletion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Progress</CardTitle>
            <CardDescription>Service completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {serviceProgress.map((service) => (
                <div key={service.service}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-foreground">
                      {service.service}
                    </span>
                    <span className="text-muted-foreground">
                      {service.completed}/{service.total}
                    </span>
                  </div>
                  <Progress value={service.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {service.percentage}% completed
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Frequently used operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Add Customer
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ClipboardList className="h-6 w-6 mb-2" />
              Create Order
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Car className="h-6 w-6 mb-2" />
              Schedule Service
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
