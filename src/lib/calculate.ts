export function calculateWPM(correctChars: number, timeElapsedSeconds: number): number {
  if (timeElapsedSeconds === 0) return 0;
  const words = correctChars / 5;
  const minutes = timeElapsedSeconds / 60;
  return Math.max(0, Math.round(words / minutes));
}

export function calculateAccuracy(correctChars: number, totalKeystrokes: number): number {
  if (totalKeystrokes === 0) return 100;
  return Math.max(0, Math.min(100, Math.round((correctChars / totalKeystrokes) * 100)));
}

export function calculateKPS(totalKeystrokes: number, timeElapsedSeconds: number): number {
  if (timeElapsedSeconds === 0) return 0;
  return Number(Math.max(0, totalKeystrokes / timeElapsedSeconds).toFixed(2));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  
  if (m > 0 && s > 0) return `${m}m ${s}s`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}
