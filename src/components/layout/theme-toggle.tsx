"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Theme Toggle Component
 *
 * A dropdown menu that allows users to switch between light, dark, and system themes.
 * Uses next-themes for theme management with system preference detection.
 *
 * Features:
 * - Light/Dark/System theme options
 * - Smooth transitions between themes
 * - System preference detection
 * - Accessible dropdown menu
 * - Icon indicators for current theme
 *
 * @example
 * ```tsx
 * import { ThemeToggle } from "@/components/ui/theme-toggle"
 *
 * export default function Header() {
 *   return (
 *     <div className="flex items-center gap-4">
 *       <ThemeToggle />
 *     </div>
 *   )
 * }
 * ```
 */
export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className="w-auto">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
          <span className="ml-5 hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Sun className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Simple Theme Toggle Button (Alternative)
 *
 * A simpler version that just toggles between light and dark themes
 * without the dropdown menu.
 *
 * @example
 * ```tsx
 * import { SimpleThemeToggle } from "@/components/ui/theme-toggle"
 *
 * export default function Navbar() {
 *   return (
 *     <div className="flex items-center">
 *       <SimpleThemeToggle />
 *     </div>
 *   )
 * }
 * ```
 */
export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
