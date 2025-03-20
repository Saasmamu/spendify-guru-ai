
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AnimatePresence } from 'react-transition-group';
import PageTransition from './components/PageTransition';
import Index from './pages/Index';
import Upload from './pages/Upload';
import Analyze from './pages/Analyze';
import NotFound from './pages/NotFound';
import { StatementProvider } from './contexts/StatementContext';
import './App.css';

// Wrap the Routes with AnimatePresence for page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/upload" element={<PageTransition><Upload /></PageTransition>} />
        <Route path="/analyze" element={<PageTransition><Analyze /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
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
