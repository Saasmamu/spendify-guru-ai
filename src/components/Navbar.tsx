
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, BarChart3, Home, LogOut, Bookmark } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Spendify</span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button 
                  variant={isActive('/dashboard') ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              
              <Link to="/dashboard/upload">
                <Button 
                  variant={isActive('/dashboard/upload') ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </Link>

              <Link to="/dashboard/saved-analyses">
                <Button 
                  variant={isActive('/dashboard/saved-analyses') ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  Saved
                </Button>
              </Link>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
