
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Charts from '@/pages/Charts';
import Analyze from '@/pages/Analyze';
import Transactions from '@/pages/Transactions';
import Compare from '@/pages/Compare';
import SavedAnalyses from '@/pages/SavedAnalyses';
import AdvancedAnalysis from '@/pages/AdvancedAnalysis';
import Onboarding from '@/pages/Onboarding';
import Pricing from '@/pages/Pricing';
import AdminRoot from '@/components/admin/AdminRoot';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <AdminProvider>
            <SubscriptionProvider>
              <Router>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/admin/*" element={<AdminRoot />} />
                  <Route path="/*" element={
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/charts" element={<Charts />} />
                        <Route path="/analyze" element={<Analyze />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/compare" element={<Compare />} />
                        <Route path="/saved" element={<SavedAnalyses />} />
                        <Route path="/advanced" element={<AdvancedAnalysis />} />
                      </Routes>
                    </Layout>
                  } />
                </Routes>
              </Router>
              <Toaster />
            </SubscriptionProvider>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
