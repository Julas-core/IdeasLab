import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header'; // Corrected import

const ProtectedRoute = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto p-4 md:p-8">Loading...</div>
        </div>
    );
  }

  return session ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;