
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  BarChart3, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Upload,
  PieChart,
  TrendingUp,
  Clock,
  Users,
  Award
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Smart PDF Analysis',
    description: 'Upload bank statements and financial documents for instant analysis and insights.',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Interactive charts and graphs that make your financial data easy to understand.',
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your financial data is protected with enterprise-grade security measures.',
  },
  {
    icon: Zap,
    title: 'Instant Processing',
    description: 'Get analysis results in seconds, not hours. Our AI processes data lightning-fast.',
  },
  {
    icon: PieChart,
    title: 'Category Breakdown',
    description: 'Automatically categorize transactions and see where your money goes.',
  },
  {
    icon: TrendingUp,
    title: 'Spending Trends',
    description: 'Track your spending patterns over time and identify financial trends.',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Financial Advisor',
    content: 'SpendifyGuru has transformed how I analyze client portfolios. The AI insights are incredibly accurate.',
    avatar: '👩‍💼',
  },
  {
    name: 'Mike Chen',
    role: 'Small Business Owner',
    content: 'Finally, a tool that makes financial analysis accessible. I can understand my business finances clearly.',
    avatar: '👨‍💻',
  },
  {
    name: 'Emily Davis',
    role: 'Personal Finance Blogger',
    content: 'The visual reports are perfect for my blog. My readers love the clear, professional charts.',
    avatar: '👩‍✍️',
  },
];

const stats = [
  { icon: Users, label: 'Active Users', value: '10,000+' },
  { icon: FileText, label: 'Documents Analyzed', value: '250,000+' },
  { icon: Clock, label: 'Average Processing Time', value: '< 30 seconds' },
  { icon: Award, label: 'Accuracy Rate', value: '99.2%' },
];

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              🚀 Now with Advanced AI Analysis
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {' '}Financial{' '}
              </span>
              Data Into Insights
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Upload your bank statements, get instant AI-powered analysis, and make smarter financial decisions with beautiful visualizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3"
                onClick={handleGetStarted}
              >
                <Upload className="mr-2 h-5 w-5" />
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3"
                onClick={() => navigate('/pricing')}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Financial Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to understand your finances better, all in one intelligent platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get insights from your financial data in just three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
              <p className="text-gray-600">
                Simply drag and drop your bank statements or financial documents into our secure platform.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI processes your data instantly, categorizing transactions and identifying patterns.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Insights</h3>
              <p className="text-gray-600">
                Receive beautiful charts, detailed analysis, and actionable insights to improve your finances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their financial understanding.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <blockquote className="text-lg mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="font-semibold">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-blue-200">
                  {testimonials[currentTestimonial].role}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-white' : 'bg-white/40'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Financial Analysis?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users who are already making smarter financial decisions with SpendifyGuru.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 font-semibold px-8 py-3"
                onClick={handleGetStarted}
              >
                <Upload className="mr-2 h-5 w-5" />
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="font-semibold px-8 py-3"
                onClick={() => navigate('/pricing')}
              >
                View Pricing Plans
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
