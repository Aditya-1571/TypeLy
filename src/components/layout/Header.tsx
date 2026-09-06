"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, User as UserIcon, LogOut, Keyboard, Sparkles, Zap, SlidersHorizontal } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="relative w-full pt-5 pb-3">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        
        {/* Left Section: Sleek Brand Icon or spacer */}
        <div className="w-28 hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card/60 border border-border/60 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Test
          </span>
        </div>

        {/* Center Section: Logo, Tagline & Feature Chip */}
        <div className="flex flex-col items-center flex-1">
          <Link href="/" className="group flex items-center gap-2 transition-transform hover:scale-[1.02]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Keyboard className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground transition-colors">
              Type<span className="text-primary">Ly</span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            <p className="text-xs text-muted-foreground tracking-wide font-medium">
              World's most accurate typing test &middot; 100% free, instant results
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card/80 border border-border/80 text-[10px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors shadow-2xs">
              <SlidersHorizontal className="w-2.5 h-2.5 text-primary" />
              Optimize System Speed
            </span>
          </div>
        </div>

        {/* Right Section: Auth State & Theme Toggle */}
        <div className="flex items-center gap-3 justify-end md:w-28 relative">
          
          {/* Auth State */}
          {!session ? (
            <Link 
              href="/login" 
              className="text-xs font-semibold hover:text-primary transition-all bg-card/80 hover:bg-card border border-border/80 px-3 py-1.5 rounded-lg shadow-2xs whitespace-nowrap"
            >
              Sign In
            </Link>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:ring-2 hover:ring-primary/40 p-0.5 rounded-full transition-all"
              >
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user?.name || "User"} 
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-[0_0_8px_rgba(99,102,241,0.4)]">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </button>
              
              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-xl z-20 py-1.5 text-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-border/70 mb-1">
                      <p className="font-semibold text-foreground truncate">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="px-4 py-2 hover:bg-muted/60 flex items-center gap-2 text-foreground transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserIcon className="w-4 h-4 text-primary" />
                      Profile & History
                    </Link>
                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="px-4 py-2 hover:bg-rose-500/10 text-left text-rose-400 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Theme toggle */}
          <div className="w-8 h-8 flex items-center justify-center">
            {mounted ? (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-1.5 rounded-lg bg-card/60 hover:bg-card border border-border/70 transition-all text-muted-foreground hover:text-foreground hover:border-primary/40 shadow-2xs"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-300" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </button>
            ) : null}
          </div>

        </div>
      </div>
    </header>
  );
}
