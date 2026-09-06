"use client";

import React from 'react';
import { TextMode, DURATIONS, TEXT_MODES } from '@/types';
import { cn } from '@/lib/utils';
import { BookOpen, Quote, Code2, Hash, AlignLeft } from 'lucide-react';

interface ModeSelectorProps {
  duration: number;
  textMode: TextMode;
  customDuration: string;
  onDurationChange: (duration: number) => void;
  onTextModeChange: (mode: TextMode) => void;
  onCustomDurationChange: (val: string) => void;
  disabled?: boolean;
}

const MODE_ICONS: Record<TextMode, React.ComponentType<{ className?: string }>> = {
  common: BookOpen,
  quotes: Quote,
  code: Code2,
  numbers: Hash,
  paragraphs: AlignLeft,
};

export default function ModeSelector({
  duration,
  textMode,
  customDuration,
  onDurationChange,
  onTextModeChange,
  onCustomDurationChange,
  disabled
}: ModeSelectorProps) {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className={cn(
        "flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-medium transition-opacity",
        disabled && "opacity-40 pointer-events-none"
      )}>
        {/* Duration pills */}
        <div className="flex items-center gap-1 bg-card/60 p-1 rounded-full border border-border/70 backdrop-blur-xs shadow-inner">
          {DURATIONS.map(d => (
            <button
              key={d.value}
              onClick={() => onDurationChange(d.value)}
              className={cn(
                "px-3 py-1 rounded-full transition-all duration-150 text-xs sm:text-sm font-medium",
                duration === d.value
                  ? "bg-primary text-primary-foreground font-semibold shadow-[0_0_10px_rgba(99,102,241,0.35)] scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              {d.label}
            </button>
          ))}
          <input
            type="number"
            placeholder="Custom"
            value={customDuration}
            onChange={(e) => onCustomDurationChange(e.target.value)}
            className="w-14 px-1.5 py-0.5 bg-transparent text-center border-l border-border/80 outline-none text-xs text-muted-foreground focus:text-foreground transition-colors placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Text mode pills with modern icons */}
        <div className="flex items-center gap-1 bg-card/60 p-1 rounded-full border border-border/70 backdrop-blur-xs shadow-inner">
          {TEXT_MODES.map(m => {
            const Icon = MODE_ICONS[m.value];
            return (
              <button
                key={m.value}
                onClick={() => onTextModeChange(m.value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full transition-all duration-150 text-xs sm:text-sm font-medium capitalize",
                  textMode === m.value
                    ? "bg-primary text-primary-foreground font-semibold shadow-[0_0_10px_rgba(99,102,241,0.35)] scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5 opacity-80" />}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtle separator line matching reference */}
      <div className="w-full max-w-2xl h-px bg-border/60" />
    </div>
  );
}
