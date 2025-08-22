import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/AppRouter";
import { VisitTrackingProvider } from "./context/VisitTrackingContext";
import { CustomerStoreProvider } from "./context/CustomerStoreContext";
import { AuthProvider } from "./context/AuthContext";
import { TechnicianStatusProvider } from "./context/TechnicianStatusContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CustomerStoreProvider>
          <VisitTrackingProvider>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </VisitTrackingProvider>
        </CustomerStoreProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
