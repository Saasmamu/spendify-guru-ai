
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, BarChart3, Shield, Zap, TrendingUp, PieChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">Spendify</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/auth">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Transform Your</span>
            <span className="block text-indigo-600">Financial Life</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Upload your bank statements and get intelligent insights into your spending patterns, 
            budget optimization, and financial health with our AI-powered analysis.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="w-full flex items-center justify-center px-8 py-3 text-base font-medium"
              >
                Get started for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your finances
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Upload className="h-8 w-8 text-indigo-600" />
                    <CardTitle className="ml-3">Smart Upload</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Upload bank statements in PDF format and let our AI extract and categorize all transactions automatically.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-indigo-600" />
                    <CardTitle className="ml-3">Visual Analytics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Beautiful charts and graphs that make it easy to understand your spending patterns and financial trends.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-indigo-600" />
                    <CardTitle className="ml-3">Smart Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get personalized recommendations and insights to optimize your spending and improve your financial health.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <PieChart className="h-8 w-8 text-indigo-600" />
                    <CardTitle className="ml-3">Category Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Automatic categorization of expenses with detailed breakdowns by category, merchant, and time period.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-indigo-600" />
                    <CardTitle className="ml-3">Secure & Private</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Your financial data is encrypted and secure. We never store your banking credentials or share your data.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Zap className="h-8 w-8 text-indigo-600" />
                    <CardTitle className="ml-3">Lightning Fast</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Process hundreds of transactions in seconds with our optimized AI engine and get instant results.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to take control?</span>
            <span className="block">Start analyzing today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of users who have already improved their financial health with Spendify.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            variant="secondary"
            className="mt-8"
          >
            Get started for free
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link to="/pricing" className="text-gray-400 hover:text-gray-500">
              Pricing
            </Link>
            <Link to="/features" className="text-gray-400 hover:text-gray-500">
              Features
            </Link>
            <Link to="/about" className="text-gray-400 hover:text-gray-500">
              About
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-gray-500">
              Contact
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 Spendify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
