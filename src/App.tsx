import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Layout } from './components/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Transactions from './pages/transactions/Transactions';
import Accounts from './pages/accounts/Accounts';
import AssetsLiabilities from './pages/assets-liabilities/AssetsLiabilities';
import Reports from './pages/reports/Reports';
import Events from './pages/events/Events';
import EventDetails from './pages/events/EventDetails';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {/* ADD THE BASENAME PROP HERE */}
        <Router basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="assets" element={<AssetsLiabilities />} />
              <Route path="reports" element={<Reports />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetails />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}