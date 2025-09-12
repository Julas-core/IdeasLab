import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Rocket, LogOut, User, Home, LayoutDashboard, FileText, Settings } from "lucide-react";
import { useSupabase } from "@/integrations/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { ExpandableTabs } from "../ui/expandable-tabs";

const navItems = [
  { title: "Home", icon: Home, link: "/" },
  { title: "Dashboard", icon: LayoutDashboard, link: "/dashboard" },
  { title: "My Ideas", icon: FileText, link: "/my-ideas" },
  { title: "Profile", icon: User, link: "/profile" },
];

function Header() {
  const { session, supabase } = useSupabase();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleTabChange = (index: number | null) => {
    if (index !== null && navItems[index]) {
      const targetLink = navItems[index].link;
      
      // Handle protected routes
      if (targetLink === "/dashboard" || targetLink === "/my-ideas" || targetLink === "/profile") {
        if (!session) {
          navigate("/login");
          return;
        }
      }
      
      navigate(targetLink);
    }
  };

  const activeTabIndex = React.useMemo(() => {
    if (!session && (location.pathname === "/dashboard" || 
                      location.pathname === "/my-ideas" || 
                      location.pathname === "/profile")) {
      return 0; // Default to Home for unauthenticated users on protected routes
    }
    
    const activeIndex = navItems.findIndex(
      (tab) => tab.link === location.pathname
    );
    return activeIndex !== -1 ? activeIndex : 0;
  }, [location.pathname, session]);

  // Filter tabs based on authentication status
  const availableTabs = React.useMemo(() => {
    if (!session) {
      return [navItems[0]]; // Only show Home for unauthenticated users
    }
    return navItems;
  }, [session]);

  return (
    <header className="p-4 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-2">
          <Rocket className="w-6 h-6" />
          <h1 className="text-2xl font-bold hidden sm:block">IdeaLab</h1>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <ExpandableTabs
            tabs={availableTabs}
            onChange={handleTabChange}
            selectedIndex={activeTabIndex}
          />
        </div>

        {/* Mobile menu - simplified for smaller screens */}
        <div className="md:hidden">
          <ExpandableTabs
            tabs={availableTabs}
            onChange={handleTabChange}
            selectedIndex={activeTabIndex}
            className="gap-1 p-0.5"
          />
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={session.user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {session.user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;