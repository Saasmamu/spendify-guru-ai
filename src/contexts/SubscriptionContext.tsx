
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export type SubscriptionPlan = 'starter' | 'pro' | 'enterprise';

export interface SubscriptionContextType {
  activePlan: SubscriptionPlan | null;
  planEndDate: string | null;
  trialEndsAt: string | null;
  isTrialActive: boolean;
  loading: boolean;
  trialType: string | null;
  cardAdded: boolean;
  updateSubscription: (planId: string, isTrial?: boolean) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activePlan, setActivePlan] = useState<SubscriptionPlan | null>(null);
  const [planEndDate, setPlanEndDate] = useState<string | null>(null);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trialType, setTrialType] = useState<string | null>(null);
  const [cardAdded, setCardAdded] = useState(false);

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
        setTrialEndsAt(data.trial_ends_at);
        setIsTrialActive(data.trial_ends_at ? new Date(data.trial_ends_at) > new Date() : false);
        setTrialType(data.trial_type);
        setCardAdded(data.card_added || false);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (planId: string, isTrial: boolean = false) => {
    if (!user) return;

    try {
      const subscriptionData = {
        user_id: user.id,
        plan: planId as SubscriptionPlan,
        status: 'active',
        ...(isTrial && {
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
        title: isTrial ? 'Trial Started!' : 'Subscription Updated',
        description: isTrial 
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
