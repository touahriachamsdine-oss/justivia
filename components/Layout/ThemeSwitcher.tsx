"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full bg-soft animate-pulse" />;
  }

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('night');
    else setTheme('light');
  };

  const getIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="w-4 h-4 text-legal-red" />;
      case 'dark': return <Monitor className="w-4 h-4 text-secondary" />;
      case 'night': return <Moon className="w-4 h-4 text-muted" />;
      default: return <Moon className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-full transition-all duration-300",
        "bg-card shadow-soft hover:shadow-legal",
        "flex items-center justify-center"
      )}
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
    >
      {getIcon()}
    </button>
  );
}

