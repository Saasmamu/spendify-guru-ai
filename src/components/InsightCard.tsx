
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: string;
  type?: 'warning' | 'success' | 'info' | 'trend';
  className?: string;
}

const InsightCard = ({ insight, type = 'info', className }: InsightCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'warning':
        return 'border-l-orange-500';
      case 'success':
        return 'border-l-green-500';
      case 'trend':
        return 'border-l-blue-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <Card className={cn("border-l-4", getBorderColor(), className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {getIcon()}
          <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
