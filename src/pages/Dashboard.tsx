
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto pt-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
