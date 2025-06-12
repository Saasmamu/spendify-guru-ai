import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import PageTransition from './components/PageTransition';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Upload from './pages/Upload';
import Analyze from './pages/Analyze';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import Budgets from './pages/Budgets';
import BudgetCreate from './pages/BudgetCreate';
import BudgetDetails from './pages/BudgetDetails';
import Goals from './pages/Goals';
import GoalCreate from './pages/GoalCreate';
import GoalDetails from './pages/GoalDetails';
import History from './pages/History';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { StatementProvider } from './contexts/StatementContext';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// Wrap the Routes with appropriate transition components
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageTransition><Index /></PageTransition>} />
      <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
      
      {/* Protected dashboard routes */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route index element={<PageTransition><DashboardHome /></PageTransition>} />
        <Route path="upload" element={<PageTransition><Upload /></PageTransition>} />
        <Route path="analyze" element={<PageTransition><Analyze /></PageTransition>} />
        <Route path="history" element={<PageTransition><History /></PageTransition>} />
        <Route path="budgets" element={<PageTransition><Budgets /></PageTransition>} />
        <Route path="budgets/create" element={<PageTransition><BudgetCreate /></PageTransition>} />
        <Route path="budgets/:id" element={<PageTransition><BudgetDetails /></PageTransition>} />
        <Route path="goals" element={<PageTransition><Goals /></PageTransition>} />
        <Route path="goals/create" element={<PageTransition><GoalCreate /></PageTransition>} />
        <Route path="goals/:id" element={<PageTransition><GoalDetails /></PageTransition>} />
      </Route>
      
      {/* Redirect old paths to dashboard */}
      <Route path="/upload" element={<Navigate to="/dashboard/upload" replace />} />
      <Route path="/analyze" element={<Navigate to="/dashboard/analyze" replace />} />
      
      <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <StatementProvider>
        <Router>
          <AnimatedRoutes />
          <Toaster />
        </Router>
      </StatementProvider>
    </AuthProvider>
  );
}

export default App;
