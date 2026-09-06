"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface KeyboardProps {
  pressedKeys: Set<string>;
  lastKeyCorrect: boolean | null;
}

interface KeyDef {
  key: string;
  display: string;
  sub?: string;
  width?: string;
}

const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { key: "`", display: "~", sub: "`", width: "w-10" },
    { key: "1", display: "!", sub: "1", width: "w-10" },
    { key: "2", display: "@", sub: "2", width: "w-10" },
    { key: "3", display: "#", sub: "3", width: "w-10" },
    { key: "4", display: "$", sub: "4", width: "w-10" },
    { key: "5", display: "%", sub: "5", width: "w-10" },
    { key: "6", display: "^", sub: "6", width: "w-10" },
    { key: "7", display: "&", sub: "7", width: "w-10" },
    { key: "8", display: "*", sub: "8", width: "w-10" },
    { key: "9", display: "(", sub: "9", width: "w-10" },
    { key: "0", display: ")", sub: "0", width: "w-10" },
    { key: "-", display: "-", width: "w-10" },
    { key: "=", display: "+", sub: "=", width: "w-10" },
    { key: "backspace", display: "Backspace", width: "w-24" },
  ],
  [
    { key: "tab", display: "Tab", width: "w-16" },
    { key: "q", display: "Q", width: "w-10" },
    { key: "w", display: "W", width: "w-10" },
    { key: "e", display: "E", width: "w-10" },
    { key: "r", display: "R", width: "w-10" },
    { key: "t", display: "T", width: "w-10" },
    { key: "y", display: "Y", width: "w-10" },
    { key: "u", display: "U", width: "w-10" },
    { key: "i", display: "I", width: "w-10" },
    { key: "o", display: "O", width: "w-10" },
    { key: "p", display: "P", width: "w-10" },
    { key: "[", display: "{", width: "w-10" },
    { key: "]", display: "}", width: "w-10" },
    { key: "\\", display: "|", width: "w-10" },
  ],
  [
    { key: "capslock", display: "Caps Lock", width: "w-20" },
    { key: "a", display: "A", width: "w-10" },
    { key: "s", display: "S", width: "w-10" },
    { key: "d", display: "D", width: "w-10" },
    { key: "f", display: "F", width: "w-10" },
    { key: "g", display: "G", width: "w-10" },
    { key: "h", display: "H", width: "w-10" },
    { key: "j", display: "J", width: "w-10" },
    { key: "k", display: "K", width: "w-10" },
    { key: "l", display: "L", width: "w-10" },
    { key: ";", display: ";", sub: ":", width: "w-10" },
    { key: "'", display: "'", sub: "\"", width: "w-10" },
    { key: "enter", display: "Enter", width: "w-20" },
  ],
  [
    { key: "shift", display: "Shift", width: "w-24" },
    { key: "z", display: "Z", width: "w-10" },
    { key: "x", display: "X", width: "w-10" },
    { key: "c", display: "C", width: "w-10" },
    { key: "v", display: "V", width: "w-10" },
    { key: "b", display: "B", width: "w-10" },
    { key: "n", display: "N", width: "w-10" },
    { key: "m", display: "M", width: "w-10" },
    { key: ",", display: "<", sub: ",", width: "w-10" },
    { key: ".", display: ">", sub: ".", width: "w-10" },
    { key: "/", display: "?", sub: "/", width: "w-10" },
    { key: "shift", display: "Shift", width: "w-24" },
  ],
  [
    { key: "control", display: "Ctrl", width: "w-16" },
    { key: "alt", display: "Alt", width: "w-16" },
    { key: " ", display: "Space", width: "w-64" },
    { key: "alt", display: "Alt", width: "w-16" },
    { key: "control", display: "Ctrl", width: "w-16" },
  ],
];

export default function Keyboard({ pressedKeys, lastKeyCorrect }: KeyboardProps) {
  return (
    <div className="hidden md:block w-full bg-keyboard-bg border-t border-border mt-auto pt-6 pb-8 transition-colors">
      <div className="max-w-3xl mx-auto py-4 px-4">
        {/* Header */}
        <div className="text-xs text-muted-foreground mb-4 font-semibold tracking-wider flex items-center justify-center gap-2 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
          Keyboard Activity
        </div>

        {/* Keyboard rows */}
        <div className="flex flex-col gap-1.5 items-center">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row gap-1.5 justify-center">
              {row.map((keyDef, keyIndex) => {
                const isPressed = pressedKeys.has(keyDef.key.toLowerCase());
                const isLetter = keyDef.key.length === 1 && /[a-z]/i.test(keyDef.key);
                const isSpecial = ["tab", "capslock", "shift", "enter", "backspace", "control", "alt"].includes(keyDef.key);

                return (
                  <div
                    key={`${rowIndex}-${keyIndex}`}
                    className={cn(
                      "h-11 flex flex-col items-center justify-center rounded-lg border text-xs font-medium transition-all duration-75 select-none",
                      keyDef.width || "w-10",
                      isPressed
                        ? lastKeyCorrect === false
                          ? "bg-rose-500 text-white border-rose-400 scale-[0.96] shadow-[0_0_15px_rgba(244,63,94,0.6)] translate-y-[1px]"
                          : "bg-primary text-primary-foreground border-primary scale-[0.96] shadow-[0_0_15px_rgba(99,102,241,0.6)] translate-y-[1px]"
                        : "bg-key-bg text-key-text border-key-border shadow-[0_2px_0_rgba(0,0,0,0.35)] dark:shadow-[0_2px_0_rgba(0,0,0,0.6)] hover:border-primary/40",
                      keyDef.key === " " && "text-muted-foreground/60"
                    )}
                  >
                    {keyDef.sub && !isLetter ? (
                      <>
                        <span className="text-[9px] leading-none text-key-shift">{keyDef.display}</span>
                        <span className="text-[12px] leading-none mt-0.5 font-semibold">{keyDef.sub}</span>
                      </>
                    ) : isSpecial ? (
                      <span className="text-[11px] font-semibold">{keyDef.display}</span>
                    ) : (
                      <span className="text-[14px] font-bold">{keyDef.display}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
