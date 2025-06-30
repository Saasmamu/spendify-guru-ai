
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { StatementProvider } from '@/contexts/StatementContext';
import { Toaster } from '@/components/ui/toaster';
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

export default function AppRoutes() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AdminProvider>
          <StatementProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/paystack-test" element={<PaystackTest />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/home" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
              <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
              <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
              <Route path="/charts" element={<ProtectedRoute><Charts /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
              <Route path="/expense-tracker" element={<ProtectedRoute><ExpenseTracker /></ProtectedRoute>} />
              <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
              <Route path="/budgets/create" element={<ProtectedRoute><BudgetCreate /></ProtectedRoute>} />
              <Route path="/budgets/dashboard" element={<ProtectedRoute><BudgetDashboard /></ProtectedRoute>} />
              <Route path="/budgets/edit/:id" element={<ProtectedRoute><BudgetForm /></ProtectedRoute>} />
              <Route path="/budgets/:id" element={<ProtectedRoute><BudgetDetails /></ProtectedRoute>} />
              <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
              <Route path="/goals/create" element={<ProtectedRoute><GoalCreate /></ProtectedRoute>} />
              <Route path="/goals/:id" element={<ProtectedRoute><GoalDetails /></ProtectedRoute>} />
              <Route path="/financial-goals" element={<ProtectedRoute><FinancialGoals /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
              <Route path="/saved-analyses" element={<ProtectedRoute><SavedAnalyses /></ProtectedRoute>} />
              <Route path="/advanced-analysis" element={<ProtectedRoute><AdvancedAnalysis /></ProtectedRoute>} />
              <Route path="/advanced-analytics" element={<ProtectedRoute><AdvancedAnalytics /></ProtectedRoute>} />
              <Route path="/advanced-financial-analysis" element={<ProtectedRoute><AdvancedFinancialAnalysis /></ProtectedRoute>} />
              <Route path="/ai-financial-advisor" element={<ProtectedRoute><AIFinancialAdvisor /></ProtectedRoute>} />
              <Route path="/category-charts" element={<ProtectedRoute><CategoryCharts /></ProtectedRoute>} />
              <Route path="/category-totals-chart" element={<ProtectedRoute><CategoryTotalsChart /></ProtectedRoute>} />
              <Route path="/recurring-expenses-chart" element={<ProtectedRoute><RecurringExpensesChart /></ProtectedRoute>} />
              <Route path="/predictions" element={<ProtectedRoute><PredictionsTab /></ProtectedRoute>} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminProtectedRoute><AdminRoot /></AdminProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminUserDetails />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="subscriptions/:id" element={<AdminSubscriptionDetails />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="documents" element={<AdminDocuments />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="plans" element={<AdminPlans />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="email-templates" element={<AdminEmailTemplates />} />
                <Route path="campaigns" element={<AdminCampaigns />} />
                <Route path="user-segments" element={<AdminUserSegments />} />
                <Route path="backups" element={<AdminBackups />} />
                <Route path="data-cleanup" element={<AdminDataCleanup />} />
                <Route path="release-notes" element={<AdminReleaseNotes />} />
                <Route path="system-updates" element={<AdminSystemUpdates />} />
                <Route path="content" element={<AdminContent />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </StatementProvider>
        </AdminProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
