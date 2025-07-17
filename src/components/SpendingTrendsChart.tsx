
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/types';
import { format, parseISO } from 'date-fns';

interface SpendingTrendsChartProps {
  transactions: Transaction[];
}

const SpendingTrendsChart: React.FC<SpendingTrendsChartProps> = ({ transactions }) => {
  // Group transactions by date and calculate daily totals
  const dailyTotals = transactions.reduce((acc, transaction) => {
    const date = format(parseISO(transaction.date), 'MMM dd');
    if (!acc[date]) {
      acc[date] = { date, income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'credit') {
      acc[date].income += transaction.amount;
    } else {
      acc[date].expenses += Math.abs(transaction.amount);
    }
    
    return acc;
  }, {} as Record<string, { date: string; income: number; expenses: number }>);

  const data = Object.values(dailyTotals).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, '']} />
        <Line 
          type="monotone" 
          dataKey="income" 
          stroke="#10B981" 
          strokeWidth={2}
          name="Income"
        />
        <Line 
          type="monotone" 
          dataKey="expenses" 
          stroke="#EF4444" 
          strokeWidth={2}
          name="Expenses"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SpendingTrendsChart;
