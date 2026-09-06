import { useState, useEffect, useCallback, useRef } from 'react';
import { TypingState, TextMode, TestResult, WpmDataPoint } from '@/types';
import { getTextForMode } from '@/lib/texts';
import { calculateWPM, calculateAccuracy, calculateKPS } from '@/lib/calculate';

interface UseTypingTestProps {
  duration: number;
  textMode: TextMode;
  onComplete: (result: TestResult) => void;
}

const initialState: TypingState = {
  text: '',
  userInput: '',
  currentIndex: 0,
  errors: 0,
  correctChars: 0,
  totalKeystrokes: 0,
  startTime: null,
  isActive: false,
  isFinished: false,
  wpmHistory: [],
};

export function useTypingTest({ duration, textMode, onComplete }: UseTypingTestProps) {
  const [state, setState] = useState<TypingState>(initialState);
  const wpmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);
  const stateRef = useRef(state);
  const durationRef = useRef(duration);
  const textModeRef = useRef(textMode);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    stateRef.current = state;
    durationRef.current = duration;
    textModeRef.current = textMode;
  }, [onComplete, state, duration, textMode]);

  const reset = useCallback((newTextMode?: TextMode) => {
    hasFinishedRef.current = false;
    const mode = newTextMode || textModeRef.current;
    setState({
      ...initialState,
      text: getTextForMode(mode),
    });
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  const timeElapsed = state.startTime && !state.isFinished 
    ? (Date.now() - state.startTime) / 1000 
    : 0;

  const wpm = calculateWPM(state.correctChars, timeElapsed);
  const accuracy = calculateAccuracy(state.correctChars, state.totalKeystrokes);
  const kps = calculateKPS(state.totalKeystrokes, timeElapsed);

  const finishTest = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    
    const finalState = stateRef.current;
    if (finalState.isFinished) return;
    
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    
    const finalTimeElapsed = finalState.startTime 
      ? (Date.now() - finalState.startTime) / 1000 
      : 0;
      
    setState(prev => ({ ...prev, isFinished: true, isActive: false }));
    
    onCompleteRef.current({
      wpm: calculateWPM(finalState.correctChars, finalTimeElapsed),
      accuracy: calculateAccuracy(finalState.correctChars, finalState.totalKeystrokes),
      errors: finalState.errors,
      kps: calculateKPS(finalState.totalKeystrokes, finalTimeElapsed),
      duration: durationRef.current,
      textMode: textModeRef.current,
      wpmData: finalState.wpmHistory,
      completedAt: new Date()
    });
  }, []);

  useEffect(() => {
    if (state.isActive && !state.isFinished) {
      wpmIntervalRef.current = setInterval(() => {
        const currentState = stateRef.current;
        if (!currentState.isActive) return;
        
        const seconds = Math.floor((Date.now() - currentState.startTime!) / 1000);
        const currentWpm = calculateWPM(currentState.correctChars, seconds);
        
        setState(prev => {
          if (prev.wpmHistory.length > 0 && prev.wpmHistory[prev.wpmHistory.length - 1].second === seconds) {
             return prev;
          }
          return {
            ...prev,
            wpmHistory: [...prev.wpmHistory, { second: seconds, wpm: currentWpm }]
          };
        });
      }, 1000);
    }
    return () => {
      if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    };
  }, [state.isActive, state.isFinished]);

  const handleKeyDown = useCallback((e: KeyboardEvent, onKeyResult?: (key: string, isCorrect: boolean) => void) => {
    if (stateRef.current.isFinished) return;
    
    if (e.key.length > 1 && e.key !== 'Backspace') return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    
    e.preventDefault();
    
    setState(prev => {
      if (prev.isFinished) return prev;
      
      const newState = { ...prev };
      
      if (!prev.isActive && e.key !== 'Backspace') {
        newState.isActive = true;
        newState.startTime = Date.now();
      }
      
      if (e.key === 'Backspace') {
        if (prev.currentIndex > 0) {
          newState.currentIndex = prev.currentIndex - 1;
          newState.userInput = prev.userInput.slice(0, -1);
          const wasCorrect = prev.userInput[prev.currentIndex - 1] === prev.text[prev.currentIndex - 1];
          if (wasCorrect) {
            newState.correctChars = Math.max(0, prev.correctChars - 1);
          } else {
            newState.errors = Math.max(0, prev.errors - 1);
          }
        }
      } else {
        const expectedChar = prev.text[prev.currentIndex];
        const isCorrect = e.key === expectedChar;
        
        newState.userInput += e.key;
        newState.totalKeystrokes += 1;
        newState.currentIndex += 1;
        
        if (isCorrect) {
          newState.correctChars += 1;
        } else {
          newState.errors += 1;
        }
        
        if (onKeyResult) {
            onKeyResult(e.key, isCorrect);
        }
        
        if (newState.currentIndex >= prev.text.length) {
           setTimeout(finishTest, 0);
        }
      }
      return newState;
    });
  }, [finishTest]);

  return { state, wpm, accuracy, kps, timeElapsed, handleKeyDown, reset, finishTest };
}
