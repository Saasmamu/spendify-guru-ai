
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import PageTransition from './components/PageTransition';
import Index from './pages/Index';
import Upload from './pages/Upload';
import Analyze from './pages/Analyze';
import NotFound from './pages/NotFound';
import { StatementProvider } from './contexts/StatementContext';
import './App.css';

// Wrap the Routes with appropriate transition components
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageTransition><Index /></PageTransition>} />
      <Route path="/upload" element={<PageTransition><Upload /></PageTransition>} />
      <Route path="/analyze" element={<PageTransition><Analyze /></PageTransition>} />
      <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
    </Routes>
  );
};

function App() {
  return (
    <StatementProvider>
      <Router>
        <AnimatedRoutes />
        <Toaster />
      </Router>
    </StatementProvider>
  );
}

export default App;
