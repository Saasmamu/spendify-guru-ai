
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardWidgetProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const DashboardWidget = ({ title, description, children, className, icon }: DashboardWidgetProps) => {
  return (
    <Card className={cn("h-full transition-all duration-300 hover:shadow-lg", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardWidget;
