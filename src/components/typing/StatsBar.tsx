"use client";

import React from 'react';
import { formatTime } from '@/lib/calculate';
import { Zap, Target, Clock, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  errors: number;
  kps: number;
  isActive: boolean;
}

export default function StatsBar({ wpm, accuracy, timeLeft, errors, kps, isActive }: StatsBarProps) {
  const stats = [
    { 
      label: 'WPM', 
      value: String(Math.round(wpm)), 
      icon: Zap,
      accent: 'text-indigo-400 dark:text-indigo-300'
    },
    { 
      label: 'ACCURACY', 
      value: `${Math.round(accuracy)}%`, 
      icon: Target,
      accent: 'text-indigo-400 dark:text-indigo-300'
    },
    { 
      label: 'TIME', 
      value: formatTime(timeLeft), 
      icon: Clock,
      accent: 'text-indigo-400 dark:text-indigo-300'
    },
    { 
      label: 'ERRORS', 
      value: String(errors), 
      icon: AlertTriangle,
      accent: errors > 0 ? 'text-rose-400' : 'text-indigo-400 dark:text-indigo-300'
    },
    { 
      label: 'KPS', 
      value: kps.toFixed(1), 
      icon: Activity,
      accent: 'text-indigo-400 dark:text-indigo-300'
    },
  ];

  return (
    <div className="w-full flex items-center justify-center pt-1 pb-4">
      <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full max-w-2xl">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label} 
              className={cn(
                "bg-card/70 border border-border/80 rounded-xl px-3 py-2 flex flex-col items-center justify-center transition-all duration-200 hover:border-primary/40 shadow-sm backdrop-blur-xs",
                isActive && "border-primary/20 shadow-[0_0_12px_rgba(99,102,241,0.06)]"
              )}
            >
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                <Icon className="w-3 h-3 opacity-60" />
                <span>{stat.label}</span>
              </div>
              <span className={cn("text-xl sm:text-2xl font-bold font-mono tracking-tight", stat.accent)}>
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
