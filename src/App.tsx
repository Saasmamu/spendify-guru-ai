
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { StatementProvider } from "@/contexts/StatementContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Analyze from "./pages/Analyze";
import SavedAnalyses from "./pages/SavedAnalyses";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StatementProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                  <Route path="/dashboard/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
                  <Route path="/dashboard/saved-analyses" element={<ProtectedRoute><SavedAnalyses /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </StatementProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
