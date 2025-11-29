export type Theme = 'light' | 'dark';

export interface Position {
  x: number;
  y: number;
}

export interface TransitionState {
  isActive: boolean;
  origin: Position;
  targetTheme: Theme;
}