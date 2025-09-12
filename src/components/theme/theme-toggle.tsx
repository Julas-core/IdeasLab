"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { useIsClient } from "usehooks-ts" // Using a reliable client-side check

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isClient = useIsClient()

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  // Render nothing on server to avoid hydration issues
  if (!isClient) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-5 w-5" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={handleThemeChange}
        aria-label="Toggle theme"
      />
      <Moon className="h-5 w-5" />
    </div>
  )
}