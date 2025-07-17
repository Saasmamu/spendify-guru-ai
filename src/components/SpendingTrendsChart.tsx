
import React from 'react';

interface SpendingTrendsChartProps {
  data: { date: string; amount: number }[];
}

const SpendingTrendsChart: React.FC<SpendingTrendsChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <span className="text-gray-500">Spending Trends</span>
      <div className="h-40 flex items-center justify-center text-gray-400">
        [Spending Trends Chart Placeholder]
      </div>
    </div>
  );
};

export default SpendingTrendsChart;
