
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/types';

interface SpendingTrendsChartProps {
  transactions: Transaction[];
}

const SpendingTrendsChart: React.FC<SpendingTrendsChartProps> = ({ transactions }) => {
  // Group transactions by date and calculate daily totals
  const dailyData = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = { date, income: 0, expenses: 0 };
    }
    if (transaction.type === 'income') {
      acc[date].income += transaction.amount;
    } else {
      acc[date].expenses += Math.abs(transaction.amount);
    }
    return acc;
  }, {} as Record<string, { date: string; income: number; expenses: number }>);

  const chartData = Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip 
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
        />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#00C49F" strokeWidth={2} />
        <Line type="monotone" dataKey="expenses" stroke="#FF8042" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SpendingTrendsChart;
