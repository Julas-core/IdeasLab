import { useAuth } from '@/integrations/supabase/auth-context';
import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header';
import { BGPattern } from '@/components/ui/bg-pattern';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
        <div className="min-h-screen bg-background relative">
            <BGPattern variant="grid" mask="fade-edges" />
            <Header />
            <div className="container mx-auto p-4 md:p-8">Loading...</div>
        </div>
    );
  }

  return session ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;