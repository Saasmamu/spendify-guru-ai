
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto pt-8">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};

export default Dashboard;
