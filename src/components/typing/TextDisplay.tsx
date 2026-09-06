"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TextDisplayProps {
  text: string;
  currentIndex: number;
  userInput: string;
  isActive: boolean;
  isFinished: boolean;
}

interface WordToken {
  wordIndex: number;
  chars: { char: string; index: number }[];
  space?: { char: string; index: number };
}

export default function TextDisplay({ text, currentIndex, userInput, isActive, isFinished }: TextDisplayProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cursorRef = React.useRef<HTMLSpanElement>(null);

  // Parse text into words with their respective character indices to ensure words never break across lines
  const words = useMemo(() => {
    const tokens: WordToken[] = [];
    let currentChars: { char: string; index: number }[] = [];
    let wordCount = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ') {
        tokens.push({
          wordIndex: wordCount++,
          chars: currentChars,
          space: { char: ' ', index: i },
        });
        currentChars = [];
      } else {
        currentChars.push({ char, index: i });
      }
    }

    if (currentChars.length > 0) {
      tokens.push({
        wordIndex: wordCount++,
        chars: currentChars,
        space: undefined,
      });
    }

    return tokens;
  }, [text]);

  // Keep cursor in comfortable view continuously as lines advance
  React.useEffect(() => {
    if (cursorRef.current && containerRef.current) {
      const cursor = cursorRef.current;
      const container = containerRef.current;
      const cursorTop = cursor.offsetTop;
      const containerHeight = container.clientHeight;
      
      // If cursor moves past the 2nd line, smooth scroll container
      if (cursorTop > container.scrollTop + containerHeight * 0.6) {
        container.scrollTo({
          top: cursorTop - containerHeight * 0.35,
          behavior: 'smooth'
        });
      } else if (cursorTop < container.scrollTop) {
        container.scrollTo({
          top: Math.max(0, cursorTop - 40),
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "py-4 px-3 select-none transition-all duration-300 max-h-[220px] overflow-y-auto typing-scroll relative",
        isFinished && "opacity-25 pointer-events-none filter blur-[0.5px]"
      )}
    >
      <div className="font-mono text-xl md:text-[22px] leading-[2.4] tracking-wide flex flex-wrap items-baseline relative">
        {words.map((word) => (
          <span 
            key={word.wordIndex} 
            className="inline-flex items-baseline whitespace-nowrap mr-[0.55em]"
          >
            {/* Characters belonging to this word */}
            {word.chars.map(({ char, index }) => {
              const isTyped = index < currentIndex;
              const isCursor = index === currentIndex;

              let charClass = "text-text-untyped";
              
              if (isTyped) {
                const isCorrect = userInput[index] === char;
                if (isCorrect) {
                  charClass = "text-correct font-medium";
                } else {
                  charClass = "text-incorrect bg-incorrect/25 rounded-[3px] font-semibold";
                }
              }

              return (
                <span 
                  key={index} 
                  className={cn(
                    "relative transition-colors duration-75 inline-block",
                    charClass
                  )}
                >
                  {isCursor && (
                    <span 
                      ref={cursorRef}
                      className={cn(
                        "absolute -left-[1.5px] top-[12%] w-[2.5px] h-[76%] bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.9)] z-10",
                        !isActive && !isFinished ? "cursor-blink" : "opacity-100"
                      )}
                    />
                  )}
                  {char}
                </span>
              );
            })}

            {/* Trailing space tracking for caret and error feedback */}
            {word.space && (
              <span 
                key={word.space.index} 
                className="relative inline-block w-[0.1em]"
              >
                {currentIndex === word.space.index && (
                  <span 
                    ref={cursorRef}
                    className={cn(
                      "absolute -left-[1.5px] top-[12%] w-[2.5px] h-[76%] bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.9)] z-10",
                      !isActive && !isFinished ? "cursor-blink" : "opacity-100"
                    )}
                  />
                )}
                {word.space.index < currentIndex && userInput[word.space.index] !== ' ' && (
                  <span className="text-incorrect font-bold underline text-sm absolute -left-1 text-rose-500">
                    &middot;
                  </span>
                )}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
