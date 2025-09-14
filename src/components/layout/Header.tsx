import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutDashboard, FileText, Crown, LogOut, LogIn, User as UserIcon, Search } from 'lucide-react';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ first_name: string | null, subscription_status: string | null } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, subscription_status')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from('profiles').select('first_name, subscription_status').eq('id', session.user.id).single().then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const availableTabs = [
    { label: 'Dashboard', icon: <LayoutDashboard size={16} />, path: '/dashboard' },
    { label: 'My Owned Ideas', icon: <FileText size={16} />, path: '/my-ideas' },
    { label: 'Browse Ideas', icon: <Search size={16} />, path: '/browse-ideas' },
    { label: 'Upgrade to Pro', icon: <Crown size={16} />, path: '/payments' },
  ];

  const activeTabIndex = availableTabs.findIndex(tab => tab.path === location.pathname);

  const handleTabChange = (index: number) => {
    const tabPath = availableTabs[index].path;
    if (!user) {
      navigate('/login');
    } else {
      navigate(tabPath);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4">
      <div className="w-full bg-background/80 backdrop-blur-sm border rounded-full p-2 flex items-center justify-between shadow-lg">
        <Link to="/" className="flex items-center gap-2 pl-2">
          <img src="/logo.svg" alt="IdeaLab Logo" className="h-8 w-8" />
          <span className="font-bold text-lg hidden sm:inline">IdeaLab</span>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <ExpandableTabs
            tabs={availableTabs}
            onChange={handleTabChange}
            selectedIndex={activeTabIndex}
          />
        </div>

        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.email}`} alt="User avatar" />
                    <AvatarFallback>{profile?.first_name ? getInitials(profile.first_name) : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.first_name || 'Welcome'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {profile?.subscription_status !== 'pro' && (
                  <DropdownMenuItem onClick={() => navigate('/payments')}>
                    <Crown className="mr-2 h-4 w-4" />
                    <span>Upgrade to Pro</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;