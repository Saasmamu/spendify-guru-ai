import React from 'react';
import Navbar from '@/components/Navbar';
import FeatureCard from '@/components/FeatureCard';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: 'User Authentication',
      description: 'Allows users to create an account or log in to access the application.',
      icon: 'lock',
    },
    {
      title: 'Dashboard Home',
      description: 'Provides a comprehensive overview of the user\'s financial status, including quick statistics, budget and goal progress, AI insights, and action cards for uploading statements and analyzing expenses.',
      icon: 'home',
    },
    {
      title: 'Home Page',
      description: 'Serves as the landing page, providing an overview of the application\'s features and guiding users to either sign in or go to the dashboard. It includes a hero section with a parallax effect and feature cards.',
      icon: 'globe',
    },
    {
      title: 'Budget Management',
      description: 'Allows users to track their monthly spending and view budget progress. Users can set budget limits for different categories and receive alerts when they exceed their budget.',
      icon: 'dollar-sign',
    },
    {
      title: 'Goal Setting',
      description: 'Enables users to set and monitor financial goals. Users can create goals with specific amounts and deadlines and receive notifications when they are close to achieving their goals.',
      icon: 'target',
    },
    {
      title: 'Expense Analysis',
      description: 'Provides detailed analysis of the user\'s spending patterns. Users can view categorized expenses, identify trends, and receive recommendations for saving money and spending smarter.',
      icon: 'chart-bar',
    },
    {
      title: 'Statement Upload',
      description: 'Allows users to upload their bank statements in PDF format. The application processes these statements to provide detailed financial analysis.',
      icon: 'upload',
    },
    {
      title: 'AI Insights',
      description: 'Provides personalized recommendations based on the user\'s spending habits. AI analyzes the uploaded bank statements to offer insights and suggestions for optimizing spending.',
      icon: 'cpu',
    },
    {
      title: 'Responsive Design',
      description: 'Ensures the application is fully responsive and works well on various devices, including desktops, tablets, and mobile phones.',
      icon: 'smartphone',
    },
    {
      title: 'Navigation',
      description: 'Provides a navigation bar at the top of the page, allowing users to easily navigate between different sections of the application.',
      icon: 'navigation',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        <Link to="/" className="flex items-center text-muted-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold">Features</h1>
          <p className="mt-4 text-lg text-muted-foreground">Discover all the features of AI Expense Buddy</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} title={feature.title} description={feature.description} icon={feature.icon} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
