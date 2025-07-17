
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

// Mock pricing data
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Basic plan for personal use',
    features: [
      { name: 'Up to 5 files per month', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'PDF export', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'AI insights', included: false }
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    description: 'Perfect for professionals',
    badge: 'Popular',
    features: [
      { name: 'Unlimited files', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'AI insights', included: true },
      { name: 'Multiple export formats', included: true },
      { name: 'Priority support', included: true }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.99,
    description: 'For teams and organizations',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Team collaboration', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'SLA guarantee', included: true }
    ]
  }
];

const DURATIONS = [
  { months: 1, discount: 0 },
  { months: 6, discount: 0.1 },
  { months: 12, discount: 0.2 }
];

export default function Pricing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { activePlan, loading: subscriptionLoading, updateSubscription } = useSubscription();
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculatePrice = (plan: any, duration: any) => {
    return plan.price * duration.months * (1 - duration.discount);
  };

  const formatPrice = (price: number) => {
    return `₦${price.toFixed(2)}`;
  };

  const handleSubscribe = async (plan: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or sign up to subscribe to a plan.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (isProcessing || subscriptionLoading) return;

    setIsProcessing(true);
    try {
      await updateSubscription(plan.id);
      toast({
        title: "Subscription Updated",
        description: `You are now subscribed to the ${plan.name} plan.`,
      });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('Subscription failed:', error);
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Could not update subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const content = (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start with a free plan. Upgrade anytime. Cancel anytime.
        </p>
        {activePlan && (
          <div className="mt-4">
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              <Crown className="w-5 h-5 mr-2 inline-block" />
              Current Plan: {PLANS.find(p => p.id === activePlan)?.name || activePlan}
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
          const isCurrentPlan = activePlan === plan.id;

          return (
            <Card key={plan.id} className={`relative p-6 flex flex-col ${isCurrentPlan ? 'border-primary' : ''}`}>
              {plan.badge && (
                <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                  {plan.badge}
                </div>
              )}
              {isCurrentPlan && (
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

              <div className="mt-6">
                <Button
                  onClick={() => handleSubscribe(plan)}
                  className="w-full"
                  disabled={isProcessing || subscriptionLoading || isCurrentPlan}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : isCurrentPlan ? (
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
          All plans include customer support. Cancel anytime.
          <br />
          Need help choosing? <a href="/contact" className="text-primary hover:underline">Contact our team</a>
        </p>
      </div>
    </div>
  );

  return <Dashboard>{content}</Dashboard>;
}
