import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/contexts/AdminContext';

interface AnalyticsData {
  userGrowth: {
    labels: string[];
    data: number[];
  };
  revenueGrowth: {
    labels: string[];
    data: number[];
  };
  documentProcessing: {
    labels: string[];
    processed: number[];
    failed: number[];
  };
  userEngagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    averageSessionTime: number;
  };
  subscriptionMetrics: {
    newSubscriptions: number[];
    churnRate: number[];
    mrr: number[];
    labels: string[];
  };
  systemPerformance: {
    apiResponseTime: number[];
    errorRate: number[];
    uptime: number;
    labels: string[];
  };
}

interface UseAdminAnalyticsReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  dateRange: string;
  setDateRange: (range: string) => void;
}

export function useAdminAnalytics(): UseAdminAnalyticsReturn {
  const { adminUser } = useAdmin();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dateRange, setDateRange] = useState('30d');

  const fetchAnalyticsData = async () => {
    if (!adminUser) {
      setError(new Error('Admin authentication required'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch user growth data
      const { data: userGrowthData, error: userGrowthError } = await supabase
        .rpc('get_user_growth_analytics', { days: parseInt(dateRange) });

      if (userGrowthError) throw userGrowthError;

      // Fetch revenue data
      const { data: revenueData, error: revenueError } = await supabase
        .rpc('get_revenue_analytics', { days: parseInt(dateRange) });

      if (revenueError) throw revenueError;

      // Fetch document processing data
      const { data: documentData, error: documentError } = await supabase
        .rpc('get_document_processing_analytics', { days: parseInt(dateRange) });

      if (documentError) throw documentError;

      // Fetch user engagement data
      const { data: engagementData, error: engagementError } = await supabase
        .rpc('get_user_engagement_analytics');

      if (engagementError) throw engagementError;

      // Fetch subscription metrics
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .rpc('get_subscription_analytics', { days: parseInt(dateRange) });

      if (subscriptionError) throw subscriptionError;

      // Fetch system performance data
      const { data: performanceData, error: performanceError } = await supabase
        .rpc('get_system_performance_analytics', { days: parseInt(dateRange) });

      if (performanceError) throw performanceError;

      // Transform and combine all data
      const analyticsData: AnalyticsData = {
        userGrowth: {
          labels: userGrowthData?.map((item: any) => item.date) || [],
          data: userGrowthData?.map((item: any) => item.users) || []
        },
        revenueGrowth: {
          labels: revenueData?.map((item: any) => item.date) || [],
          data: revenueData?.map((item: any) => item.revenue) || []
        },
        documentProcessing: {
          labels: documentData?.map((item: any) => item.date) || [],
          processed: documentData?.map((item: any) => item.processed) || [],
          failed: documentData?.map((item: any) => item.failed) || []
        },
        userEngagement: {
          dailyActive: engagementData?.daily_active || 0,
          weeklyActive: engagementData?.weekly_active || 0,
          monthlyActive: engagementData?.monthly_active || 0,
          averageSessionTime: engagementData?.avg_session_time || 0
        },
        subscriptionMetrics: {
          labels: subscriptionData?.map((item: any) => item.date) || [],
          newSubscriptions: subscriptionData?.map((item: any) => item.new_subscriptions) || [],
          churnRate: subscriptionData?.map((item: any) => item.churn_rate) || [],
          mrr: subscriptionData?.map((item: any) => item.mrr) || []
        },
        systemPerformance: {
          labels: performanceData?.map((item: any) => item.date) || [],
          apiResponseTime: performanceData?.map((item: any) => item.response_time) || [],
          errorRate: performanceData?.map((item: any) => item.error_rate) || [],
          uptime: performanceData?.[0]?.uptime || 99.9
        }
      };

      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics data'));
      
      // Set mock data for development
      const mockData: AnalyticsData = {
        userGrowth: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [100, 150, 200, 280, 350, 420]
        },
        revenueGrowth: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [1200, 1800, 2400, 3200, 4100, 5200]
        },
        documentProcessing: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          processed: [45, 52, 48, 61],
          failed: [3, 2, 4, 1]
        },
        userEngagement: {
          dailyActive: 85,
          weeklyActive: 245,
          monthlyActive: 420,
          averageSessionTime: 1240
        },
        subscriptionMetrics: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          newSubscriptions: [12, 18, 15, 22, 28, 35],
          churnRate: [2.1, 1.8, 2.3, 1.9, 1.6, 1.4],
          mrr: [2400, 3200, 4100, 5200, 6800, 8500]
        },
        systemPerformance: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          apiResponseTime: [120, 115, 118, 112],
          errorRate: [0.8, 0.6, 0.9, 0.5],
          uptime: 99.8
        }
      };
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchAnalyticsData();
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [adminUser, dateRange]);

  return {
    data,
    loading,
    error,
    refresh,
    dateRange,
    setDateRange
  };
}
