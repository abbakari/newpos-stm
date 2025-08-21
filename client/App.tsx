import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import SearchCustomers from "./pages/customers/SearchCustomers";
import AddCustomer from "./pages/customers/AddCustomer";
import CustomerDetails from "./pages/customers/CustomerDetails";
import CustomerTypes from "./pages/customers/CustomerTypes";
import TireServices from "./pages/services/TireServices";
import TireInventory from "./pages/inventory/TireInventory";
import InvoiceManagement from "./pages/invoices/InvoiceManagement";
import NotFound from "./pages/NotFound";
import { 
  Users, 
  Search, 
  UserPlus, 
  Building2, 
  Car, 
  ShoppingCart, 
  HelpCircle, 
  Clock, 
  UserCheck, 
  FileText, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Settings 
} from "lucide-react";

const queryClient = new QueryClient();

function WrappedPlaceholder({ title, description, icon }: { title: string; description: string; icon: any }) {
  return (
    <DashboardLayout>
      <PlaceholderPage title={title} description={description} icon={icon} />
    </DashboardLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          
          {/* Customer Management Routes */}
          <Route path="/customers/search" element={
            <DashboardLayout>
              <SearchCustomers />
            </DashboardLayout>
          } />
          <Route path="/customers/add" element={
            <DashboardLayout>
              <AddCustomer />
            </DashboardLayout>
          } />
          <Route path="/customers/:customerId" element={
            <DashboardLayout>
              <CustomerDetails />
            </DashboardLayout>
          } />
          <Route path="/customers/types" element={
            <DashboardLayout>
              <CustomerTypes />
            </DashboardLayout>
          } />
          
          {/* Service Management Routes */}
          <Route path="/services/car" element={
            <WrappedPlaceholder 
              title="Car Services" 
              description="Manage car service offerings and scheduling" 
              icon={Car} 
            />
          } />
          <Route path="/services/tires" element={
            <DashboardLayout>
              <TireServices />
            </DashboardLayout>
          } />
          <Route path="/inventory/tires" element={
            <DashboardLayout>
              <TireInventory />
            </DashboardLayout>
          } />
          <Route path="/invoices" element={
            <DashboardLayout>
              <InvoiceManagement />
            </DashboardLayout>
          } />
          <Route path="/services/consultations" element={
            <WrappedPlaceholder 
              title="Consultations" 
              description="Manage customer consultation requests and information" 
              icon={HelpCircle} 
            />
          } />
          
          {/* Order Management Routes */}
          <Route path="/orders/active" element={
            <WrappedPlaceholder 
              title="Active Orders" 
              description="View and manage currently active service orders" 
              icon={Clock} 
            />
          } />
          <Route path="/orders/completed" element={
            <WrappedPlaceholder 
              title="Completed Orders" 
              description="Review completed orders and customer feedback" 
              icon={UserCheck} 
            />
          } />
          <Route path="/orders/job-cards" element={
            <WrappedPlaceholder 
              title="Job Cards" 
              description="Manage work orders and job card assignments" 
              icon={FileText} 
            />
          } />
          
          {/* Tracking Routes */}
          <Route path="/tracking/daily" element={
            <WrappedPlaceholder 
              title="Daily Tracking" 
              description="Monitor daily service activities and time tracking" 
              icon={Calendar} 
            />
          } />
          <Route path="/tracking/status" element={
            <WrappedPlaceholder 
              title="Service Status" 
              description="Track service progress and completion status" 
              icon={TrendingUp} 
            />
          } />
          
          {/* Reports Routes */}
          <Route path="/reports/daily" element={
            <WrappedPlaceholder 
              title="Daily Reports" 
              description="Generate and view daily performance reports" 
              icon={Calendar} 
            />
          } />
          <Route path="/reports/weekly" element={
            <WrappedPlaceholder 
              title="Weekly Reports" 
              description="Analyze weekly trends and performance metrics" 
              icon={TrendingUp} 
            />
          } />
          <Route path="/reports/monthly" element={
            <WrappedPlaceholder 
              title="Monthly Reports" 
              description="Review monthly analytics and business insights" 
              icon={BarChart3} 
            />
          } />
          <Route path="/reports/yearly" element={
            <WrappedPlaceholder 
              title="Yearly Reports" 
              description="Comprehensive yearly analysis and growth metrics" 
              icon={TrendingUp} 
            />
          } />
          
          {/* Administration Routes */}
          <Route path="/admin/users" element={
            <WrappedPlaceholder 
              title="User Access Control" 
              description="Manage user permissions and access levels" 
              icon={Shield} 
            />
          } />
          <Route path="/admin/settings" element={
            <WrappedPlaceholder 
              title="System Settings" 
              description="Configure system preferences and business settings" 
              icon={Settings} 
            />
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
