import React, { useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme, Position } from '../types';

interface ThemeToggleProps {
  currentTheme: Theme;
  onToggle: (pos: Position) => void;
  disabled: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onToggle, disabled }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    
    // Calculate center of the button for the zoom origin
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : e.clientX;
    const y = rect ? rect.top + rect.height / 2 : e.clientY;

    onToggle({ x, y });
  };

  const isLight = currentTheme === 'light';

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={disabled}
        className={`
          group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full 
          transition-all duration-500 ease-out
          hover:scale-105 active:scale-95 no-tap-highlight
          border-2 shadow-xl
          ${
            isLight
              ? 'bg-white border-black text-black hover:bg-black hover:text-white hover:border-black'
              : 'bg-black border-white text-white hover:bg-white hover:text-black hover:border-white'
          }
        `}
        aria-label="Toggle Theme"
      >
        <div className="relative w-6 h-6 md:w-7 md:h-7">
          {/* Sun Icon */}
          <div className={`absolute inset-0 transition-all duration-500 ${isLight ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
             <Sun className="w-full h-full fill-current" strokeWidth={2} />
          </div>
          
          {/* Moon Icon */}
          <div className={`absolute inset-0 transition-all duration-500 ${!isLight ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}>
             <Moon className="w-full h-full fill-current" strokeWidth={2} />
          </div>
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;