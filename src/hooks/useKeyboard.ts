import { useState, useEffect, useCallback } from 'react';

export function useKeyboard() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKeyCorrect, setLastKeyCorrect] = useState<boolean | null>(null);

  const handleKeyDown = useCallback((key: string, isCorrect: boolean) => {
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(key.toLowerCase());
      return newSet;
    });
    setLastKeyCorrect(isCorrect);
  }, []);

  const handleKeyUp = useCallback((key: string) => {
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key.toLowerCase());
      return newSet;
    });
  }, []);

  useEffect(() => {
    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      handleKeyUp(e.key);
    };

    window.addEventListener('keyup', handleGlobalKeyUp);
    return () => {
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [handleKeyUp]);

  return { pressedKeys, lastKeyCorrect, handleKeyDown, handleKeyUp };
}
