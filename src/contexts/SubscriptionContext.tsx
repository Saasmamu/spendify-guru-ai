
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: {
    maxFileSize: number;
    maxFilesPerMonth: number;
    advancedAnalytics: boolean;
    aiInsights: boolean;
    exportFormats: string[];
    priority: string;
  };
  description: string;
}

export interface Subscription {
  id: string;
  planId: string;
  status: string;
  currentPeriodEnd: string;
}

interface SubscriptionContextType {
  activePlan: Plan | null;
  subscription: Subscription | null;
  planEndDate: string | null;
  trialEndsAt: string | null;
  trialType: string | null;
  cardAdded: boolean;
  isTrialActive: boolean;
  loading: boolean;
  limits: {
    maxFileSize: number;
    maxFilesPerMonth: number;
    filesUsedThisMonth: number;
  };
  updateSubscription: (planId: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    const mockPlan: Plan = {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: {
        maxFileSize: 5 * 1024 * 1024,
        maxFilesPerMonth: 5,
        advancedAnalytics: false,
        aiInsights: false,
        exportFormats: ['pdf'],
        priority: 'low'
      },
      description: 'Basic plan for personal use'
    };

    setActivePlan(mockPlan);
    setLoading(false);
  }, []);

  const updateSubscription = async (planId: string) => {
    // Mock implementation
    console.log('Updating subscription to plan:', planId);
  };

  const value: SubscriptionContextType = {
    activePlan,
    subscription,
    planEndDate: null,
    trialEndsAt: null,
    trialType: null,
    cardAdded: false,
    isTrialActive: false,
    loading,
    limits: {
      maxFileSize: activePlan?.features.maxFileSize || 5 * 1024 * 1024,
      maxFilesPerMonth: activePlan?.features.maxFilesPerMonth || 5,
      filesUsedThisMonth: 0
    },
    updateSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
