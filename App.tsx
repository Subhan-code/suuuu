import React, { useState, useEffect } from 'react';
import { Theme, TransitionState, Position } from './types';
import ThemeToggle from './components/ThemeToggle';
import TransitionLayer from './components/TransitionLayer';
import Content from './components/Content';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  
  // We manage the transition state here
  const [transition, setTransition] = useState<TransitionState>({
    isActive: false,
    origin: { x: 0, y: 0 },
    targetTheme: 'dark',
  });

  // Effect to apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Effect for Torch/Spotlight tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleToggle = (pos: Position) => {
    if (transition.isActive) return;

    const nextTheme = theme === 'light' ? 'dark' : 'light';
    
    // Start the transition
    setTransition({
      isActive: true,
      origin: pos,
      targetTheme: nextTheme,
    });
  };

  const handleAnimationComplete = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleTransitionEnd = () => {
    setTransition((prev) => ({ ...prev, isActive: false }));
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-700 ease-in-out ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      
      {/* Torch Light Effect Layer */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: theme === 'dark' 
            ? `radial-gradient(600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(29, 78, 216, 0.15), transparent 40%)`
            : `radial-gradient(600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(0, 0, 0, 0.05), transparent 40%)`
        }}
      />

      {/* The main content of the website */}
      <Content theme={theme} />

      {/* Floating Toggle Button */}
      <ThemeToggle 
        currentTheme={theme} 
        onToggle={handleToggle} 
        disabled={transition.isActive}
      />

      {/* The Overlay that handles the "Gif Zoom" animation */}
      {transition.isActive && (
        <TransitionLayer 
          transition={transition}
          onCovered={handleAnimationComplete}
          onFinished={handleTransitionEnd}
        />
      )}
    </div>
  );
};

export default App;