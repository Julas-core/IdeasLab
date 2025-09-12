import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme/theme-provider";
import MyIdeas from "./pages/MyIdeas";
import IdeaDetail from "./pages/IdeaDetail";
import Profile from "./pages/Profile";
import Payments from "./pages/Payments";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const queryClient = new QueryClient();

// Replace with your PayPal Client ID. Use "sb" for sandbox testing.
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb"; 

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-ideas" element={<MyIdeas />} />
                <Route path="/idea/:id" element={<IdeaDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/payments" element={<Payments />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PayPalScriptProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;