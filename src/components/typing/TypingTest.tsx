"use client";

import React, { useState, useEffect, useRef } from 'react';
import { TextMode, TestResult } from '@/types';
import ModeSelector from './ModeSelector';
import StatsBar from './StatsBar';
import TextDisplay from './TextDisplay';
import Keyboard from '@/components/typing/Keyboard';
import ResultsScreen from '@/components/typing/ResultsScreen';
import { useTypingTest } from '@/hooks/useTypingTest';
import { useTimer } from '@/hooks/useTimer';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useSession } from 'next-auth/react';

export default function TypingTest() {
  const [duration, setDuration] = useState<number>(60);
  const [textMode, setTextMode] = useState<TextMode>('common');
  const [customDuration, setCustomDuration] = useState<string>('');
  
  const [showResults, setShowResults] = useState(false);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  
  const inputRef = useRef<HTMLDivElement>(null);
  const isSavingResultRef = useRef(false);
  const { data: session } = useSession();

  const handleComplete = async (result: TestResult) => {
    if (isSavingResultRef.current) return;
    isSavingResultRef.current = true;

    setLastResult(result);
    setShowResults(true);

    const localHistory = JSON.parse(localStorage.getItem('typely_results') || '[]');
    localHistory.push({ ...result, createdAt: new Date().toISOString() });
    localStorage.setItem('typely_results', JSON.stringify(localHistory));

    if (session?.user) {
      try {
        await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result)
        });
      } catch (error) {
        console.error('Failed to save result', error);
      }
    }
  };

  const { state, wpm, accuracy, kps, handleKeyDown, reset, finishTest } = useTypingTest({
    duration,
    textMode,
    onComplete: handleComplete
  });

  const { timeLeft, isRunning, startTimer, resetTimer } = useTimer(duration, finishTest);
  
  const { handleKeyDown: recordKey, pressedKeys, lastKeyCorrect } = useKeyboard();

  useEffect(() => {
    if (state.isActive && !isRunning && !state.isFinished) {
      startTimer();
    }
  }, [state.isActive, isRunning, state.isFinished, startTimer]);

  useEffect(() => {
    if (inputRef.current && !showResults) {
      inputRef.current.focus();
    }
  }, [duration, textMode, showResults]);

  const onDurationChange = (d: number) => {
    isSavingResultRef.current = false;
    setDuration(d);
    setCustomDuration('');
    reset();
    resetTimer();
  };

  const onCustomDurationChange = (val: string) => {
    setCustomDuration(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      isSavingResultRef.current = false;
      setDuration(parsed);
      reset();
      resetTimer();
    }
  };

  const onTextModeChange = (mode: TextMode) => {
    isSavingResultRef.current = false;
    setTextMode(mode);
    reset(mode);
    resetTimer();
  };

  const handleGlobalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    handleKeyDown(e.nativeEvent, recordKey);
  };

  const handleRetry = () => {
    isSavingResultRef.current = false;
    setShowResults(false);
    reset(textMode);
    resetTimer();
    setTimeout(() => {
        if(inputRef.current) inputRef.current.focus();
    }, 10);
  };

  return (
    <div 
      ref={inputRef}
      tabIndex={0}
      onKeyDown={handleGlobalKeyDown}
      className="outline-none flex-1 flex flex-col"
    >
      {/* Main content area */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 px-4 py-4 flex-1">
        <ModeSelector 
          duration={duration}
          textMode={textMode}
          customDuration={customDuration}
          onDurationChange={onDurationChange}
          onTextModeChange={onTextModeChange}
          onCustomDurationChange={onCustomDurationChange}
          disabled={state.isActive || showResults}
        />

        {showResults && lastResult ? (
          <ResultsScreen result={lastResult} onRetry={handleRetry} onNewTest={handleRetry} />
        ) : (
          <>
            <StatsBar 
              wpm={wpm} 
              accuracy={accuracy} 
              timeLeft={timeLeft} 
              errors={state.errors} 
              kps={kps}
              isActive={state.isActive}
            />
            
            <TextDisplay 
              text={state.text}
              currentIndex={state.currentIndex}
              userInput={state.userInput}
              isActive={state.isActive}
              isFinished={state.isFinished}
            />
          </>
        )}
      </div>

      {/* Keyboard section — full-width separate panel */}
      {!showResults && (
        <Keyboard pressedKeys={pressedKeys} lastKeyCorrect={lastKeyCorrect} />
      )}
    </div>
  );
}
