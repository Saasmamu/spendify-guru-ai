
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function Onboarding() {
  return (
    <div className="container mx-auto py-8">
      <Card className="w-[400px] mx-auto mt-8">
        <CardHeader>
          <CardTitle>Welcome to Spendify</CardTitle>
          <CardDescription>
            Let's get you started with your financial journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Onboarding content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Onboarding;
