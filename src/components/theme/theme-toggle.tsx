"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={cn(
        "flex items-center gap-2 h-10 w-[108px]",
        "bg-muted rounded-md p-1"
      )}>
        <Sun className="h-5 w-5" />
        <div className="h-5 w-10 bg-background rounded-full" />
        <Moon className="h-5 w-5" />
      </div>
    )
  }

  const isDark = theme === "dark" || theme === "system"

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-5 w-5" />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
      />
      <Moon className="h-5 w-5" />
    </div>
  )
}