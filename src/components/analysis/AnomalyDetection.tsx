import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, XCircle, Filter } from 'lucide-react';

interface Anomaly {
  id: string;
  transaction_id: string;
  amount: number;
  description: string;
  date: string;
  type: 'unusual_amount' | 'duplicate' | 'timing' | 'merchant';
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  reason: string;
}

interface AnomalyDetectionProps {
  anomalies: {
    data: any[];
    count: number;
    highSeverity: number;
  };
  transactions: any[];
}

const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ anomalies, transactions }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  
  // Mock anomaly data - in real implementation, this would come from AI analysis
  const anomaliesData = anomalies.data;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredAnomalies = selectedSeverity === 'all' 
    ? anomaliesData 
    : anomaliesData.filter(anomaly => anomaly.severity === selectedSeverity);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anomalies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{anomalies.count}</div>
            <p className="text-xs text-muted-foreground">
              Detected this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {anomalies.highSeverity}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {Math.round(anomaliesData.reduce((sum, a) => sum + a.confidence, 0) / anomaliesData.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average detection confidence
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Detected Anomalies</CardTitle>
              <CardDescription>
                AI-powered detection of unusual transaction patterns
              </CardDescription>
            </div>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAnomalies.map((anomaly) => (
            <Alert key={anomaly.id} className="border-l-4 border-l-orange-500">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(anomaly.severity)}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertTitle className="text-sm font-medium">
                        {anomaly.description}
                      </AlertTitle>
                      <Badge variant={getSeverityColor(anomaly.severity) as any}>
                        {anomaly.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {anomaly.confidence}% confidence
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm">
                      <div className="space-y-1">
                        <p><strong>Amount:</strong> ${anomaly.amount}</p>
                        <p><strong>Date:</strong> {anomaly.date}</p>
                        <p><strong>Type:</strong> {anomaly.type.replace('_', ' ')}</p>
                        <p className="text-blue-600"><strong>Reason:</strong> {anomaly.reason}</p>
                      </div>
                    </AlertDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Mark Valid
                  </Button>
                  <Button variant="destructive" size="sm">
                    Flag Fraud
                  </Button>
                </div>
              </div>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnomalyDetection;
