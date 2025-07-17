
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const {
    activePlan,
    planEndDate,
    trialEndsAt,
    isTrialActive,
    loading: subscriptionLoading,
  } = useSubscription();
  const navigate = useNavigate();

  const [isCancelling, setIsCancelling] = React.useState(false);
  const [isDeactivatingTrial, setIsDeactivatingTrial] = React.useState(false);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    toast({ title: 'Cancelling subscription...', description: 'This feature is not yet implemented.' });
    setIsCancelling(false);
  };

  const handleDeactivateTrial = async () => {
    setIsDeactivatingTrial(true);
    toast({ title: 'Deactivating trial...', description: 'This feature is not yet implemented.' });
    setIsDeactivatingTrial(false);
  };

  if (subscriptionLoading) {
    return <div className="container mx-auto p-4"><p>Loading billing information...</p></div>;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Billing Management</CardTitle>
          <CardDescription>Manage your subscription and billing details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {activePlan && (
            <section>
              <h3 className="text-lg font-semibold mb-2">Current Plan: {activePlan.name}</h3>
              <p>Price: ₦{activePlan.price.toFixed(2)} / {activePlan.interval}</p>
              {isTrialActive && trialEndsAt && (
                <p className="text-green-600 font-semibold">Active Trial ends on: {new Date(trialEndsAt).toLocaleDateString()}</p>
              )}
              {planEndDate && !isTrialActive && (
                <p>Your current plan is active until: {new Date(planEndDate).toLocaleDateString()}</p>
              )}
            </section>
          )}

          {!activePlan && !isTrialActive && (
            <section className="text-center py-4">
              <p className="mb-4">You don't have an active subscription or trial.</p>
              <Button onClick={() => navigate('/pricing')}>View Pricing Plans</Button>
            </section>
          )}
          
          {(activePlan || isTrialActive) && <Separator />}

          {isTrialActive && trialEndsAt && (
            <section>
              <h3 className="text-lg font-semibold mb-2">Manage Your Trial</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Your free trial for the {activePlan?.name || 'selected'} plan is active until {new Date(trialEndsAt).toLocaleDateString()}.
                You can deactivate it at any time.
              </p>
              <Button 
                variant="outline"
                onClick={handleDeactivateTrial} 
                disabled={isDeactivatingTrial || !isTrialActive}
              >
                {isDeactivatingTrial ? 'Deactivating...' : 'Deactivate Trial'}
              </Button>
            </section>
          )}

          {activePlan && !isTrialActive && planEndDate && (
             <section>
              <h3 className="text-lg font-semibold mb-2">Manage Your Subscription</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Your subscription for the {activePlan.name} plan is active until {new Date(planEndDate).toLocaleDateString()}.
                If you cancel, your access will continue until this date, but it will not renew.
              </p>
              <Button 
                variant="destructive"
                onClick={handleCancelSubscription} 
                disabled={isCancelling || !activePlan || isTrialActive}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
              </Button>
            </section>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            For changes to payment methods or detailed invoice history, please contact support (feature coming soon).
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BillingPage;
