
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionLimits } from '@/types/subscription';

export type SubscriptionPlan = 'starter' | 'pro' | 'enterprise';

export interface SubscriptionPlanDetails {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export interface SubscriptionContextType {
  activePlan: SubscriptionPlan | null;
  planEndDate: string | null;
  trialEndsAt: Date | null;
  isTrialActive: boolean;
  loading: boolean;
  trialType: string | null;
  cardAdded: boolean;
  limits: SubscriptionLimits;
  subscription: any;
  updateSubscription: (planId: string, options?: { isTrialStart?: boolean; withCard?: boolean }) => Promise<void>;
}

const defaultLimits: SubscriptionLimits = {
  maxStatements: 5,
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
  canCompare: false,
  hasAdvancedAnalytics: false,
  hasFinancialGoals: false,
  hasAIFinancialAdvisor: false
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activePlan, setActivePlan] = useState<SubscriptionPlan | null>(null);
  const [planEndDate, setPlanEndDate] = useState<string | null>(null);
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trialType, setTrialType] = useState<string | null>(null);
  const [cardAdded, setCardAdded] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [limits, setLimits] = useState<SubscriptionLimits>(defaultLimits);

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      if (data) {
        setActivePlan(data.plan as SubscriptionPlan);
        setPlanEndDate(data.current_period_end);
        setTrialEndsAt(data.trial_ends_at ? new Date(data.trial_ends_at) : null);
        setIsTrialActive(data.trial_ends_at ? new Date(data.trial_ends_at) > new Date() : false);
        setTrialType(data.trial_type);
        setCardAdded(data.card_added || false);
        setSubscription(data);
        
        // Set limits based on plan
        const planLimits = getPlanLimits(data.plan as SubscriptionPlan);
        setLimits(planLimits);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanLimits = (plan: SubscriptionPlan): SubscriptionLimits => {
    switch (plan) {
      case 'pro':
        return {
          maxStatements: 50,
          maxSavedAnalyses: 25,
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
          canCompare: true,
          hasAdvancedAnalytics: true,
          hasFinancialGoals: true,
          hasAIFinancialAdvisor: true
        };
      case 'enterprise':
        return {
          maxStatements: -1, // unlimited
          maxSavedAnalyses: -1,
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
          canCompare: true,
          hasAdvancedAnalytics: true,
          hasFinancialGoals: true,
          hasAIFinancialAdvisor: true
        };
      default: // starter
        return defaultLimits;
    }
  };

  const updateSubscription = async (planId: string, options?: { isTrialStart?: boolean; withCard?: boolean }) => {
    if (!user) return;

    try {
      const subscriptionData = {
        user_id: user.id,
        plan: planId as SubscriptionPlan,
        status: 'active',
        ...(options?.isTrialStart && {
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          trial_type: 'free'
        })
      };

      const { error } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData);

      if (error) throw error;

      await fetchSubscriptionData();
      
      toast({
        title: options?.isTrialStart ? 'Trial Started!' : 'Subscription Updated',
        description: options?.isTrialStart 
          ? `Your 7-day trial for the ${planId} plan has begun.`
          : `Successfully updated to the ${planId} plan.`
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subscription. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const value: SubscriptionContextType = {
    activePlan,
    planEndDate,
    trialEndsAt,
    isTrialActive,
    loading,
    trialType,
    cardAdded,
    limits,
    subscription,
    updateSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
