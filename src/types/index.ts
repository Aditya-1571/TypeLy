export type TextMode = 'common' | 'quotes' | 'code' | 'numbers' | 'paragraphs';

export type Duration = 15 | 30 | 60 | 120 | 300 | 600;

export const DURATIONS: { label: string; value: Duration }[] = [
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: '2m', value: 120 },
  { label: '5m', value: 300 },
  { label: '10m', value: 600 },
];

export const TEXT_MODES: { label: string; value: TextMode }[] = [
  { label: 'Common', value: 'common' },
  { label: 'Quotes', value: 'quotes' },
  { label: 'Code', value: 'code' },
  { label: 'Numbers', value: 'numbers' },
  { label: 'Paragraphs', value: 'paragraphs' },
];

export interface TypingState {
  text: string;
  userInput: string;
  currentIndex: number;
  errors: number;
  correctChars: number;
  totalKeystrokes: number;
  startTime: number | null;
  isActive: boolean;
  isFinished: boolean;
  wpmHistory: WpmDataPoint[];
}

export interface WpmDataPoint {
  second: number;
  wpm: number;
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  errors: number;
  kps: number;
  duration: number;
  textMode: TextMode;
  wpmData: WpmDataPoint[];
  completedAt: Date;
}

export interface KeyState {
  key: string;
  isPressed: boolean;
  isCorrect: boolean | null;
}
