
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { StatementProvider } from '@/contexts/StatementContext';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import Upload from '@/pages/Upload';
import Analyze from '@/pages/Analyze';
import Charts from '@/pages/Charts';
import History from '@/pages/History';
import Compare from '@/pages/Compare';
import SavedAnalyses from '@/pages/SavedAnalyses';
import AdvancedAnalysis from '@/pages/AdvancedAnalysis';
import Pricing from '@/pages/Pricing';
import BillingPage from '@/pages/BillingPage';
import ProtectedRoute from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <StatementProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
                <Route path="/charts" element={<ProtectedRoute><Charts /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
                <Route path="/saved-analyses" element={<ProtectedRoute><SavedAnalyses /></ProtectedRoute>} />
                <Route path="/advanced-analysis" element={<ProtectedRoute><AdvancedAnalysis /></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
              </Routes>
              <Toaster />
            </Router>
          </StatementProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
