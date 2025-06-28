
export interface SubscriptionLimits {
  maxStatements: number;
  maxSavedAnalyses: number;
  aiAnalysis: boolean;
  advancedCharts: boolean;
  exportReports: boolean;
  prioritySupport: boolean;
  customCategories: boolean;
  budgetTracking: boolean;
  advancedAnalytics: boolean;
  advancedAnalysis: boolean;
  financialGoals: boolean;
  aiAdvisor: boolean;
  budgetPlanner: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: SubscriptionLimits;
  isPopular?: boolean;
}

export interface SubscriptionContextType {
  activePlan: SubscriptionPlan | null;
  limits: SubscriptionLimits;
  isLoading: boolean;
  loading?: boolean;
  error: string | null;
  planEndDate?: string;
  trialEndsAt?: string;
  trialType?: string;
  isTrialActive?: boolean;
  cardAdded?: boolean;
  upgradePlan: (planId: string) => Promise<void>;
  updateSubscription?: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}
