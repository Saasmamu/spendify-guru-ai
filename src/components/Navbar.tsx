
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Receipt, Upload, PieChart } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ to, label, icon: Icon }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
          "hover:bg-accent/10 active:scale-[0.97]",
          isActive ? "text-primary font-medium" : "text-muted-foreground"
        )}
      >
        <Icon className={cn(
          "w-5 h-5 transition-transform duration-300", 
          isActive && "text-primary"
        )} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300",
        isScrolled ? "glass-effect shadow-subtle backdrop-blur-lg" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Receipt className="w-6 h-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">AI Expense Buddy</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-2">
          <NavLink to="/" label="Home" icon={Receipt} />
          <NavLink to="/upload" label="Upload" icon={Upload} />
          <NavLink to="/analyze" label="Analyze" icon={PieChart} />
        </nav>
        
        <div className="flex md:hidden">
          {/* Mobile menu button would go here */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
