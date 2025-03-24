
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Receipt, Upload, PieChart, ArrowRight, LogIn } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (heroRef.current) {
        // Parallax effect
        heroRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
        heroRef.current.style.opacity = `${1 - scrollY * 0.002}`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
    return (
      <div 
        className={cn(
          "p-6 rounded-2xl glass-effect border border-border/50",
          "hover:shadow-subtle hover:border-primary/20 transition-all duration-500",
          "animate-slide-up"
        )}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/0 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent z-0" />
        
        <div 
          ref={heroRef}
          className="max-w-5xl mx-auto text-center relative z-10 pt-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-scale-in">
            <Receipt className="w-4 h-4" />
            <span>Simplify Your Financial Management</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Analyze expenses with
            <span className="relative ml-2 inline-block">
              <span className="relative z-10 text-primary">AI</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-0" />
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Upload your bank statements and get AI-powered insights to optimize your spending habits
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {user ? (
              <Link to="/dashboard/upload">
                <Button size="lg" className="rounded-full px-6 gap-2 h-12">
                  <Upload className="w-4 h-4" />
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="rounded-full px-6 gap-2 h-12">
                  <LogIn className="w-4 h-4" />
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )}
            
            {!user && (
              <Link to="/auth">
                <Button size="lg" variant="outline" className="rounded-full px-6 gap-2 h-12">
                  <Receipt className="w-4 h-4" />
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-16 left-0 right-0 h-64 bg-gradient-radial from-primary/5 to-transparent opacity-70 z-0" />
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-6 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simplify Your Financial Life</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI Expense Buddy helps you understand your spending habits and make smarter financial decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Upload} 
              title="Easy PDF Upload" 
              description="Simply upload your bank statements in PDF format and let our AI do the rest."
              delay={0}
            />
            <FeatureCard 
              icon={PieChart} 
              title="Smart Analysis" 
              description="Get detailed insights into your spending patterns categorized automatically."
              delay={100}
            />
            <FeatureCard 
              icon={Receipt} 
              title="Spending Optimization" 
              description="Receive personalized recommendations to help you save money and spend smarter."
              delay={200}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
