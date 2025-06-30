import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAdmin } from '@/contexts/AdminContext';
import {
  Home,
  Upload,
  BarChart,
  PieChart,
  GitCompare,
  Target,
  Trophy,
  CreditCard,
  Brain,
  Clock,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const { subscription } = useSubscription();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Upload', href: '/upload', icon: Upload },
    { label: 'Analyze', href: '/analyze', icon: BarChart },
    { label: 'Charts', href: '/charts', icon: PieChart },
    { label: 'Compare', href: '/compare', icon: GitCompare },
    { label: 'Budgets', href: '/budgets', icon: Target },
    { label: 'Budget Dashboard', href: '/budgets/dashboard', icon: BarChart3 },
    { label: 'Goals', href: '/goals', icon: Trophy },
    { label: 'Transactions', href: '/transactions', icon: CreditCard },
    { label: 'AI Advisor', href: '/ai-financial-advisor', icon: Brain },
    { label: 'History', href: '/history', icon: Clock },
  ];

  return (
    <div className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      <div className="container max-w-6xl mx-auto py-3 px-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-bold text-primary flex items-center">
          BudgetWise
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center text-gray-600 hover:text-primary px-3 py-2 rounded-md transition-colors",
                location.pathname === item.href ? "text-primary font-semibold" : ""
              )}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Dropdown */}
        <div className="hidden md:flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {subscription ? 'Pro Account' : 'Free Account'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <Home className="w-4 h-4 mr-2" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/billing')}>
                <Settings className="w-4 h-4 mr-2" />
                <span>Billing</span>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Admin</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "flex items-center text-gray-600 hover:text-primary px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.href ? "text-primary font-semibold" : ""
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}
              <Button variant="outline" className="w-full mt-4" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
