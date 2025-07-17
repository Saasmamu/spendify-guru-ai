import React, { createContext, useContext, useState, useEffect } from 'react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: SubscriptionLimits;
}

interface SubscriptionLimits {
  maxStatements: number;
  maxSavedAnalyses: number;
  aiAnalysis: boolean;
  financialGoals: boolean;
  customCategories: boolean;
  anomalyDetection: boolean;
}

interface SubscriptionContextType {
  plan: SubscriptionPlan | null;
  activePlan: SubscriptionPlan | null;
  limits: SubscriptionLimits;
  subscription: any;
  setSubscription: (subscription: any) => void;
  isLoading: boolean;
}

const FREE_LIMITS: SubscriptionLimits = {
  maxStatements: 3,
  maxSavedAnalyses: 1,
  aiAnalysis: false,
  financialGoals: false,
  customCategories: false,
  anomalyDetection: false
};

const PREMIUM_LIMITS: SubscriptionLimits = {
  maxStatements: 10,
  maxSavedAnalyses: 5,
  aiAnalysis: true,
  financialGoals: true,
  customCategories: true,
  anomalyDetection: true
};

const ENTERPRISE_LIMITS: SubscriptionLimits = {
  maxStatements: 100,
  maxSavedAnalyses: 20,
  aiAnalysis: true,
  financialGoals: true,
  customCategories: true,
  anomalyDetection: true
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

const getLimitsForPlan = (planId: string): SubscriptionLimits => {
  switch (planId) {
    case 'premium':
      return PREMIUM_LIMITS;
    case 'enterprise':
      return ENTERPRISE_LIMITS;
    default:
      return FREE_LIMITS;
  }
};

const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const limits = plan ? plan.limits : FREE_LIMITS;

  useEffect(() => {
    const loadSubscription = async () => {
      setIsLoading(true);
      try {
        // Mock subscription data
        const mockSubscription = {
          id: 'sub_123',
          status: 'active',
          plan: 'premium',
          customerId: 'cus_123',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        };
        setSubscription(mockSubscription);

        const activePlan = await getActivePlan();
        setPlan(activePlan);
      } catch (error) {
        console.error('Failed to load subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, []);

  const getActivePlan = (): Promise<SubscriptionPlan> => {
    if (subscription?.plan) {
      return Promise.resolve({
        id: subscription.plan,
        name: subscription.plan === 'free' ? 'Free' : subscription.plan === 'premium' ? 'Premium' : 'Enterprise',
        price: subscription.plan === 'free' ? 0 : subscription.plan === 'premium' ? 29 : 99,
        interval: subscription.plan === 'free' ? 'monthly' as const : 'monthly' as const,
        features: [],
        limits: getLimitsForPlan(subscription.plan)
      });
    }
    
    return Promise.resolve({
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'monthly' as const,
      features: [],
      limits: FREE_LIMITS
    });
  };

  const contextValue: SubscriptionContextType = {
    plan: plan,
    activePlan: plan,
    limits: limits,
    subscription: subscription,
    setSubscription: setSubscription,
    isLoading: isLoading
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {!isLoading && children}
    </SubscriptionContext.Provider>
  );
};

const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export { SubscriptionProvider, useSubscription };
