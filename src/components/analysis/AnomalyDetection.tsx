
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Anomaly, Transaction } from '@/types';

interface AnomalyDetectionProps {
  anomalies: {
    data: Anomaly[];
    count: number;
    highSeverity: number;
  };
  transactions: Transaction[];
}

const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ anomalies, transactions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Anomaly Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Found {anomalies.count} anomalies, {anomalies.highSeverity} high severity
          </div>
          {anomalies.data.slice(0, 5).map((anomaly) => (
            <div key={anomaly.id} className="p-3 border rounded-md">
              <div className="font-medium">{anomaly.type}</div>
              <div className="text-sm text-muted-foreground">{anomaly.description}</div>
              <div className={`text-xs px-2 py-1 rounded-full inline-block mt-2 ${
                anomaly.severity === 'high' ? 'bg-red-100 text-red-800' :
                anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {anomaly.severity}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyDetection;
