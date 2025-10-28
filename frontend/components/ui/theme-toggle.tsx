'use client';

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Button } from "./button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 hover:bg-blue-50 dark:hover:bg-gray-800"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-gray-700 dark:text-gray-400" />
      ) : (
        <Sun className="h-4 w-4 text-gray-700 dark:text-gray-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}