"use client";

import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Lightbulb, LayoutDashboard, User, CreditCard } from "lucide-react"; // Import CreditCard icon

interface TabProps {
  label: string;
  icon: React.ElementType;
  path: string;
}

const tabs: TabProps[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "My Ideas", icon: Lightbulb, path: "/my-ideas" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Payments", icon: CreditCard, path: "/payments" }, // New Payments tab
];

const Tab = ({ label, icon: Icon, path }: TabProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
};

interface ExpandableTabsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ExpandableTabs = ({ className, ...props }: ExpandableTabsProps) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm",
        className
      )}
      {...props}
    >
      {tabs.map((tab) => (
        <Tab key={tab.path} {...tab} />
      ))}
    </div>
  );
};