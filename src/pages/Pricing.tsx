
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Dashboard from '@/pages/Dashboard';

// Define plan features
interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  badge?: string;
  features: PlanFeature[];
}

interface PlanDuration {
  months: number;
  discount: number;
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for individuals getting started',
    basePrice: 1500, // in NGN
    features: [
      { name: 'Upload Bank Statements', included: true },
      { name: 'Charts & Visualizations', included: true },
      { name: 'Expense Tracker', included: true },
      { name: 'Basic Transaction Analysis', included: true },
      { name: 'Category Breakdown', included: true },
      { name: 'Export to PDF', included: true },
      { name: 'Financial Goals', included: false },
      { name: 'Compare Analyses', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'AI Financial Advisor', included: false },
      { name: 'Priority Support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For power users who need more features',
    basePrice: 3000,
    badge: 'Most Popular',
    features: [
      { name: 'Upload Bank Statements', included: true },
      { name: 'Charts & Visualizations', included: true },
      { name: 'Expense Tracker', included: true },
      { name: 'Basic Transaction Analysis', included: true },
      { name: 'Category Breakdown', included: true },
      { name: 'Export to PDF', included: true },
      { name: 'Financial Goals', included: true },
      { name: 'Compare Analyses', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'AI Financial Advisor', included: false },
      { name: 'Priority Support', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full features for serious financial analysis',
    basePrice: 5000,
    features: [
      { name: 'Upload Bank Statements', included: true },
      { name: 'Charts & Visualizations', included: true },
      { name: 'Expense Tracker', included: true },
      { name: 'Basic Transaction Analysis', included: true },
      { name: 'Category Breakdown', included: true },
      { name: 'Export to PDF', included: true },
      { name: 'Financial Goals', included: true },
      { name: 'Compare Analyses', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'AI Financial Advisor', included: true },
      { name: 'Priority Support', included: true },
    ],
  },
];

const DURATIONS: PlanDuration[] = [
  { months: 1, discount: 0 },
  { months: 6, discount: 0.1 }, // 10% discount
  { months: 12, discount: 0.2 }, // 20% discount
];

const calculatePrice = (plan: Plan, duration: PlanDuration): number => {
  const monthlyPrice = plan.basePrice;
  const totalPrice = monthlyPrice * duration.months;
  const discountedPrice = totalPrice * (1 - duration.discount);
  return Math.round(discountedPrice);
};

const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function Pricing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { activePlan, limits, isLoading } = useSubscription();
  const [selectedDuration, setSelectedDuration] = useState<PlanDuration>(DURATIONS[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or sign up to subscribe to a plan.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (isProcessing || isLoading) return;

    setIsProcessing(true);
    try {
      // Mock payment processing - replace with actual payment integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful",
        description: "Your subscription has been activated.",
      });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentPlanName = (): string => {
    if (typeof activePlan === 'string') {
      return activePlan;
    }
    if (activePlan && typeof activePlan === 'object' && 'name' in activePlan) {
      return activePlan.name;
    }
    return 'Free';
  };

  const isCurrentPlan = (planId: string): boolean => {
    if (typeof activePlan === 'string') {
      return activePlan === planId;
    }
    if (activePlan && typeof activePlan === 'object' && 'id' in activePlan) {
      return activePlan.id === planId;
    }
    return false;
  };

  const content = (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start with a 7-day free trial. Cancel anytime. No credit card required for trial.
        </p>
        {activePlan && (
          <div className="mt-4">
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              <Crown className="w-5 h-5 mr-2 inline-block" />
              Current Plan: {getCurrentPlanName()}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex justify-center mb-8">
        <Tabs defaultValue={selectedDuration.months.toString()} className="w-full max-w-xs">
          <TabsList className="grid w-full grid-cols-3">
            {DURATIONS.map((duration) => (
              <TabsTrigger
                key={duration.months}
                value={duration.months.toString()}
                onClick={() => setSelectedDuration(duration)}
                className="text-sm"
              >
                {duration.months === 1 ? 'Monthly' : 
                 duration.months === 6 ? '6 Months' : 'Yearly'}
                {duration.discount > 0 && (
                  <span className="ml-1 text-xs text-green-600">
                    -{duration.discount * 100}%
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {PLANS.map((plan) => {
          const price = calculatePrice(plan, selectedDuration);
          const monthlyPrice = price / selectedDuration.months;
          const isCurrentActive = isCurrentPlan(plan.id);

          return (
            <Card key={plan.id} className={`relative p-6 flex flex-col ${isCurrentActive ? 'border-primary' : ''}`}>
              {plan.badge && (
                <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                  {plan.badge}
                </div>
              )}
              {isCurrentActive && (
                <div className="absolute top-0 left-0 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                  Current Plan
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold">
                  {formatPrice(monthlyPrice)}
                  <span className="text-lg font-normal text-muted-foreground">/mo</span>
                </div>
                {selectedDuration.months > 1 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {formatPrice(price)} billed every {selectedDuration.months} months
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-4 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature.name} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span className="font-medium">{feature.name}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => handleSubscribe(plan)}
                  className="w-full"
                  disabled={isProcessing || isLoading || isCurrentActive}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : isCurrentActive ? (
                    'Current Plan'
                  ) : (
                    `Subscribe ${formatPrice(monthlyPrice)}/mo`
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          All plans include a 7-day free trial. Cancel anytime during the trial period.
          <br />
          Need help choosing? <a href="/contact" className="text-primary hover:underline">Contact our team</a>
        </p>
      </div>
    </div>
  );

  return <Dashboard>{content}</Dashboard>;
}
