import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SubscriptionLimits, SubscriptionPlan } from '@/types/subscription';

interface SubscriptionContextType {
  activePlan: SubscriptionPlan | null;
  limits: SubscriptionLimits;
  isLoading: boolean;
  error: string | null;
  upgradePlan: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const defaultLimits: SubscriptionLimits = {
  maxStatements: 1,
  maxSavedAnalyses: 3,
  aiAnalysis: false,
  advancedCharts: false,
  exportReports: false,
  prioritySupport: false,
  customCategories: false,
  budgetTracking: false,
  advancedAnalytics: false,
  advancedAnalysis: false,
  financialGoals: false,
  aiAdvisor: false,
  budgetPlanner: false,
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [activePlan, setActivePlan] = useState<SubscriptionPlan | null>(null);
  const [limits, setLimits] = useState<SubscriptionLimits>(defaultLimits);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock implementation: Fetch subscription data from local storage or API
    const storedPlan = localStorage.getItem('activePlan');
    if (storedPlan) {
      setActivePlan(JSON.parse(storedPlan));
      // Mock setting limits based on the plan
      setLimits(getLimitsForPlan(JSON.parse(storedPlan).id));
    } else {
      // Default to free limits if no plan is active
      setLimits(getLimitsForPlan(null));
    }
  }, []);

  const upgradePlan = async (planId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock API call to upgrade plan
      const newPlan = await new Promise<SubscriptionPlan>((resolve) => {
        setTimeout(() => {
          const mockPlans = [
            { id: 'basic', name: 'Basic', price: 10, interval: 'monthly', features: [], limits: getLimitsForPlan('basic') },
            { id: 'premium', name: 'Premium', price: 20, interval: 'monthly', features: [], limits: getLimitsForPlan('premium') },
          ];
          const foundPlan = mockPlans.find(plan => plan.id === planId);
          resolve(foundPlan || { id: 'free', name: 'Free', price: 0, interval: 'monthly', features: [], limits: getLimitsForPlan('free') });
        }, 1000);
      });

      setActivePlan(newPlan);
      setLimits(getLimitsForPlan(newPlan.id));
      localStorage.setItem('activePlan', JSON.stringify(newPlan));
    } catch (err: any) {
      setError(err.message || 'Failed to upgrade plan');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock API call to cancel subscription
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });

      setActivePlan(null);
      setLimits(getLimitsForPlan(null));
      localStorage.removeItem('activePlan');
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const getLimitsForPlan = (planId: string | null): SubscriptionLimits => {
    const freeLimits: SubscriptionLimits = {
      maxStatements: 1,
      maxSavedAnalyses: 3,
      aiAnalysis: false,
      advancedCharts: false,
      exportReports: false,
      prioritySupport: false,
      customCategories: false,
      budgetTracking: false,
      advancedAnalytics: false,
      advancedAnalysis: false,
      financialGoals: false,
      aiAdvisor: false,
      budgetPlanner: false,
    };

    const basicLimits: SubscriptionLimits = {
      maxStatements: 5,
      maxSavedAnalyses: 10,
      aiAnalysis: true,
      advancedCharts: true,
      exportReports: false,
      prioritySupport: false,
      customCategories: true,
      budgetTracking: true,
      advancedAnalytics: false,
      advancedAnalysis: false,
      financialGoals: true,
      aiAdvisor: false,
      budgetPlanner: true,
    };

    const premiumLimits: SubscriptionLimits = {
      maxStatements: -1, // unlimited
      maxSavedAnalyses: -1, // unlimited
      aiAnalysis: true,
      advancedCharts: true,
      exportReports: true,
      prioritySupport: true,
      customCategories: true,
      budgetTracking: true,
      advancedAnalytics: true,
      advancedAnalysis: true,
      financialGoals: true,
      aiAdvisor: true,
      budgetPlanner: true,
    };

    switch (planId) {
      case 'basic':
        return basicLimits;
      case 'premium':
        return premiumLimits;
      default:
        return freeLimits;
    }
  };

  return (
    <SubscriptionContext.Provider value={{ activePlan, limits, isLoading, error, upgradePlan, cancelSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
