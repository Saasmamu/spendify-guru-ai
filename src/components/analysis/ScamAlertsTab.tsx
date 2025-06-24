
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  TrendingUp,
  Clock
} from 'lucide-react';

interface ScamAlert {
  id: string;
  type: 'phishing' | 'suspicious_merchant' | 'unusual_amount' | 'foreign_transaction';
  severity: 'low' | 'medium' | 'high';
  description: string;
  amount: number;
  date: string;
  merchant: string;
  recommendation: string;
  status: 'new' | 'reviewed' | 'dismissed';
}

interface ScamAlertsTabProps {
  transactions: any[];
}

const ScamAlertsTab: React.FC<ScamAlertsTabProps> = ({ transactions }) => {
  // Mock data - in real implementation, this would come from AI analysis
  const scamAlerts: ScamAlert[] = [
    {
      id: '1',
      type: 'suspicious_merchant',
      severity: 'high',
      description: 'Transaction with unverified merchant flagged by our AI',
      amount: 299.99,
      date: '2024-01-15',
      merchant: 'QUICK-DEALS-ONLINE',
      recommendation: 'Contact your bank immediately if you did not authorize this transaction',
      status: 'new'
    },
    {
      id: '2',
      type: 'unusual_amount',
      severity: 'medium',
      description: 'Transaction amount is 300% higher than your usual spending pattern',
      amount: 1250.00,
      date: '2024-01-12',
      merchant: 'ELECTRONICS STORE',
      recommendation: 'Verify this purchase and check for any unauthorized access to your account',
      status: 'new'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <Eye className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scamAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {scamAlerts.filter(alert => alert.severity === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">85%</div>
            <p className="text-xs text-muted-foreground">
              Good security rating
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Alerts</CardTitle>
          <CardDescription>
            AI-powered fraud detection and security recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {scamAlerts.map((alert) => (
            <Alert key={alert.id} className="border-l-4 border-l-red-500">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertTitle className="text-sm font-medium">
                        {alert.description}
                      </AlertTitle>
                      <Badge variant={getSeverityColor(alert.severity) as any}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm">
                      <div className="space-y-1">
                        <p><strong>Amount:</strong> ${alert.amount}</p>
                        <p><strong>Merchant:</strong> {alert.merchant}</p>
                        <p><strong>Date:</strong> {alert.date}</p>
                        <p className="text-blue-600"><strong>Recommendation:</strong> {alert.recommendation}</p>
                      </div>
                    </AlertDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Mark Safe
                  </Button>
                  <Button variant="destructive" size="sm">
                    Report Fraud
                  </Button>
                </div>
              </div>
            </Alert>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Enable Account Alerts</h4>
              <p className="text-sm text-muted-foreground">
                Set up real-time notifications for all transactions above $100
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Review Merchants Regularly</h4>
              <p className="text-sm text-muted-foreground">
                Check for unfamiliar merchant names and verify all purchases
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Monitor Card Usage</h4>
              <p className="text-sm text-muted-foreground">
                Report lost or stolen cards immediately to prevent fraud
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Use Secure Networks</h4>
              <p className="text-sm text-muted-foreground">
                Avoid making transactions on public Wi-Fi networks
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScamAlertsTab;
