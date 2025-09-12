import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Rocket, LogOut, User, Home } from "lucide-react";
import { ThemeToggle } from "../theme/theme-toggle";
import { useSupabase } from "@/integrations/supabase"; // Corrected import path
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
  { title: "Ideas", icon: Home, link: "/" },
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
    if (index !== null && navItems[index].link) {
      if (navItems[index].link === "/profile" && !session) {
        navigate("/login");
      } else {
        navigate(navItems[index].link);
      }
    }
  };

  const activeTabIndex = React.useMemo(() => {
    if (location.pathname === "/profile" && !session) {
      return null;
    }
    const activeIndex = navItems.findIndex(
      (tab) => tab.link === location.pathname
    );
    return activeIndex !== -1 ? activeIndex : null;
  }, [location.pathname, session]);

  return (
    <header className="p-4 border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-2">
          <Rocket className="w-6 h-6" />
          <h1 className="text-2xl font-bold hidden sm:block">IdeaLab</h1>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2">
          <ExpandableTabs
            tabs={session ? navItems : [navItems[0]]}
            onChange={handleTabChange}
            selectedIndex={activeTabIndex}
          />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={session.user.user_metadata.avatar_url} />
                  <AvatarFallback>
                    {session.user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;