import { useState, useRef, useEffect, useCallback } from 'react';

export function useTimer(duration: number, onComplete: () => void) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const timeLeftRef = useRef(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    timeLeftRef.current = duration;
    setTimeLeft(duration);
  }, [duration]);

  const startTimer = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      timeLeftRef.current -= 1;

      if (timeLeftRef.current <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsRunning(false);
        setTimeLeft(0);
        onCompleteRef.current();
      } else {
        setTimeLeft(timeLeftRef.current);
      }
    }, 1000);
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    timeLeftRef.current = duration;
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { timeLeft, isRunning, startTimer, resetTimer };
}
