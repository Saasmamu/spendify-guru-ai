
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';

interface SubscriptionLimits {
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
  canCompare: boolean;
  hasAdvancedAnalytics: boolean;
  hasFinancialGoals: boolean;
  hasAIFinancialAdvisor: boolean;
}

interface FeatureGateProps {
  children: ReactNode;
  feature: keyof Omit<SubscriptionLimits, 'maxStatements' | 'maxSavedAnalyses'>;
}

export function FeatureGate({ children, feature }: FeatureGateProps) {
  const { activePlan } = useSubscription();
  const navigate = useNavigate();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Mock limits based on plan
  const limits: SubscriptionLimits = {
    maxStatements: 10,
    maxSavedAnalyses: 5,
    aiAnalysis: activePlan?.features.aiInsights || false,
    advancedCharts: activePlan?.features.advancedAnalytics || false,
    exportReports: true,
    prioritySupport: activePlan?.features.priority === 'high',
    customCategories: true,
    budgetTracking: true,
    advancedAnalytics: activePlan?.features.advancedAnalytics || false,
    advancedAnalysis: activePlan?.features.advancedAnalytics || false,
    financialGoals: true,
    aiAdvisor: activePlan?.features.aiInsights || false,
    budgetPlanner: true,
    canCompare: activePlan?.features.advancedAnalytics || false,
    hasAdvancedAnalytics: activePlan?.features.advancedAnalytics || false,
    hasFinancialGoals: true,
    hasAIFinancialAdvisor: activePlan?.features.aiInsights || false,
  };

  if (limits[feature]) {
    return <>{children}</>;
  }

  // Convert camelCase feature name to readable text
  const featureDisplayName = String(feature).replace(/([A-Z])/g, ' $1').toLowerCase();

  // Get plan name
  const planName = activePlan?.name || 'Free';

  // If the feature is not available, show upgrade dialog
  return (
    <>
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Required</DialogTitle>
            <DialogDescription>
              This feature is not available on your current plan ({planName}). 
              Upgrade to access {featureDisplayName}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => navigate('/pricing')}>
              View Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div onClick={() => setShowUpgradeDialog(true)}>
        {children}
      </div>
    </>
  );
}
