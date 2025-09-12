import { Rocket, LogOut } from "lucide-react";
import { ThemeToggle } from "../theme/theme-toggle";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Header = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="p-4 border-b bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Rocket className="w-6 h-6" />
          <h1 className="text-2xl font-bold">IdeaLab</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Dashboard</Button>
              <Button variant="ghost" onClick={handleLogout} size="icon" title="Logout">
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate('/login')}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
};