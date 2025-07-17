
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Upload from '@/pages/Upload';
import Analyze from '@/pages/Analyze';
import Compare from '@/pages/Compare';
import Charts from '@/pages/Charts';
import History from '@/pages/History';
import Pricing from '@/pages/Pricing';
import Features from '@/pages/Features';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import Blog from '@/pages/Blog';
import ThankYou from '@/pages/ThankYou';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import BillingPage from '@/pages/BillingPage';
import ExpenseTracker from '@/pages/ExpenseTracker';
import Budgets from '@/pages/Budgets';
import BudgetForm from '@/pages/BudgetForm';
import BudgetCreate from '@/pages/BudgetCreate';
import BudgetDetails from '@/pages/BudgetDetails';
import BudgetDashboard from '@/pages/BudgetDashboard';
import Goals from '@/pages/Goals';
import GoalCreate from '@/pages/GoalCreate';
import GoalDetails from '@/pages/GoalDetails';
import FinancialGoals from '@/pages/FinancialGoals';
import Transactions from '@/pages/Transactions';
import SavedAnalyses from '@/pages/SavedAnalyses';
import AdvancedAnalysis from '@/pages/AdvancedAnalysis';
import AdvancedAnalytics from '@/pages/AdvancedAnalytics';
import AdvancedFinancialAnalysis from '@/pages/AdvancedFinancialAnalysis';
import AIFinancialAdvisor from '@/pages/AIFinancialAdvisor';
import PaystackTest from '@/pages/PaystackTest';
import DashboardHome from '@/pages/DashboardHome';
import CategoryCharts from '@/pages/CategoryCharts';
import CategoryTotalsChart from '@/pages/CategoryTotalsChart';
import RecurringExpensesChart from '@/pages/RecurringExpensesChart';
import PredictionsTab from '@/pages/PredictionsTab';

// Admin routes
import AdminRoot from '@/components/admin/AdminRoot';
import { AdminProtectedRoute } from '@/components/admin/AdminProtectedRoute';
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminUserDetails from '@/pages/admin/UserDetails';
import AdminSubscriptions from '@/pages/admin/Subscriptions';
import AdminSubscriptionDetails from '@/pages/admin/SubscriptionDetails';
import AdminAnalytics from '@/pages/admin/Analytics';
import AdminSettings from '@/pages/admin/Settings';
import AdminDocuments from '@/pages/admin/Documents';
import AdminReports from '@/pages/admin/Reports';
import AdminPlans from '@/pages/admin/Plans';
import AdminNotifications from '@/pages/admin/Notifications';
import AdminEmailTemplates from '@/pages/admin/EmailTemplates';
import AdminCampaigns from '@/pages/admin/Campaigns';
import AdminUserSegments from '@/pages/admin/UserSegments';
import AdminBackups from '@/pages/admin/Backups';
import AdminDataCleanup from '@/pages/admin/DataCleanup';
import AdminReleaseNotes from '@/pages/admin/ReleaseNotes';
import AdminSystemUpdates from '@/pages/admin/SystemUpdates';
import AdminContent from '@/pages/admin/Content';

export const routes = [
  // Public routes
  { path: '/', element: <Index /> },
  { path: '/auth', element: <Auth /> },
  { path: '/pricing', element: <Pricing /> },
  { path: '/features', element: <Features /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/faq', element: <FAQ /> },
  { path: '/blog', element: <Blog /> },
  { path: '/thank-you', element: <ThankYou /> },
  { path: '/paystack-test', element: <PaystackTest /> },

  // Protected routes
  { path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: '/dashboard/home', element: <ProtectedRoute><DashboardHome /></ProtectedRoute> },
  { path: '/dashboard/budgets', element: <ProtectedRoute><BudgetDashboard /></ProtectedRoute> },
  { path: '/upload', element: <ProtectedRoute><Upload /></ProtectedRoute> },
  { path: '/analyze', element: <ProtectedRoute><Analyze /></ProtectedRoute> },
  { path: '/compare', element: <ProtectedRoute><Compare /></ProtectedRoute> },
  { path: '/charts', element: <ProtectedRoute><Charts /></ProtectedRoute> },
  { path: '/history', element: <ProtectedRoute><History /></ProtectedRoute> },
  { path: '/billing', element: <ProtectedRoute><BillingPage /></ProtectedRoute> },
  { path: '/expense-tracker', element: <ProtectedRoute><ExpenseTracker /></ProtectedRoute> },
  { path: '/budgets', element: <ProtectedRoute><Budgets /></ProtectedRoute> },
  { path: '/budgets/create', element: <ProtectedRoute><BudgetCreate /></ProtectedRoute> },
  { path: '/budgets/dashboard', element: <ProtectedRoute><BudgetDashboard /></ProtectedRoute> },
  { path: '/budgets/edit/:id', element: <ProtectedRoute><BudgetForm /></ProtectedRoute> },
  { path: '/budgets/:id', element: <ProtectedRoute><BudgetDetails /></ProtectedRoute> },
  { path: '/goals', element: <ProtectedRoute><Goals /></ProtectedRoute> },
  { path: '/goals/create', element: <ProtectedRoute><GoalCreate /></ProtectedRoute> },
  { path: '/goals/:id', element: <ProtectedRoute><GoalDetails /></ProtectedRoute> },
  { path: '/financial-goals', element: <ProtectedRoute><FinancialGoals /></ProtectedRoute> },
  { path: '/transactions', element: <ProtectedRoute><Transactions /></ProtectedRoute> },
  { path: '/saved-analyses', element: <ProtectedRoute><SavedAnalyses /></ProtectedRoute> },
  { path: '/advanced-analysis', element: <ProtectedRoute><AdvancedAnalysis /></ProtectedRoute> },
  { path: '/advanced-analytics', element: <ProtectedRoute><AdvancedAnalytics /></ProtectedRoute> },
  { path: '/advanced-financial-analysis', element: <ProtectedRoute><AdvancedFinancialAnalysis /></ProtectedRoute> },
  { path: '/ai-financial-advisor', element: <ProtectedRoute><AIFinancialAdvisor /></ProtectedRoute> },
  { path: '/category-charts', element: <ProtectedRoute><CategoryCharts /></ProtectedRoute> },
  { path: '/category-totals-chart', element: <ProtectedRoute><CategoryTotalsChart /></ProtectedRoute> },
  { path: '/recurring-expenses-chart', element: <ProtectedRoute><RecurringExpensesChart /></ProtectedRoute> },
  { path: '/predictions', element: <ProtectedRoute><PredictionsTab /></ProtectedRoute> },

  // Admin routes
  { path: '/admin/login', element: <AdminLogin /> },
  { 
    path: '/admin', 
    element: <AdminProtectedRoute><AdminRoot /></AdminProtectedRoute>,
    children: [
      { path: '', element: <AdminDashboard /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'users/:id', element: <AdminUserDetails /> },
      { path: 'subscriptions', element: <AdminSubscriptions /> },
      { path: 'subscriptions/:id', element: <AdminSubscriptionDetails /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'settings', element: <AdminSettings /> },
      { path: 'documents', element: <AdminDocuments /> },
      { path: 'reports', element: <AdminReports /> },
      { path: 'plans', element: <AdminPlans /> },
      { path: 'notifications', element: <AdminNotifications /> },
      { path: 'email-templates', element: <AdminEmailTemplates /> },
      { path: 'campaigns', element: <AdminCampaigns /> },
      { path: 'user-segments', element: <AdminUserSegments /> },
      { path: 'backups', element: <AdminBackups /> },
      { path: 'data-cleanup', element: <AdminDataCleanup /> },
      { path: 'release-notes', element: <AdminReleaseNotes /> },
      { path: 'system-updates', element: <AdminSystemUpdates /> },
      { path: 'content', element: <AdminContent /> },
    ]
  },

  // Catch all route
  { path: '*', element: <NotFound /> },
];
