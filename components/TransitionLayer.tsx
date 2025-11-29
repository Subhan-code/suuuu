import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TransitionState } from '../types';

interface TransitionLayerProps {
  transition: TransitionState;
  onCovered: () => void;
  onFinished: () => void;
}

const TransitionLayer: React.FC<TransitionLayerProps> = ({ transition, onCovered, onFinished }) => {
  const containerControls = useAnimation();
  const imageControls = useAnimation();
  const { targetTheme } = transition;

  const isTargetDark = targetTheme === 'dark'; 
  
  const gifStyle: React.CSSProperties = {
    // Smoother filters: Reduced contrast and removed pixelated rendering
    filter: isTargetDark 
      ? 'grayscale(100%) brightness(0.7) contrast(110%)'  // Soft Dark
      : 'grayscale(100%) invert(1) brightness(1.2) contrast(110%)', // Soft White
      
    // Multiply blends darks into light bg; Screen blends lights into dark bg
    mixBlendMode: isTargetDark ? 'multiply' : 'screen',
  };

  useEffect(() => {
    const sequence = async () => {
      // 1. Initial State
      await containerControls.set({
        opacity: 0,
        zIndex: 9999,
      });
      await imageControls.set({ scale: 0, opacity: 0 });

      // 2. REVEAL
      const revealDuration = 0.3; 
      const smoothOut: [number, number, number, number] = [0.16, 1, 0.3, 1]; 
      
      const revealContainer = containerControls.start({
        opacity: 1,
        transition: { duration: revealDuration }
      });
      
      const revealImage = imageControls.start({
        scale: 1,
        opacity: 1, 
        transition: { duration: revealDuration, ease: smoothOut }
      });

      await Promise.all([revealContainer, revealImage]);

      // 3. WAIT
      await new Promise((resolve) => setTimeout(resolve, 600));

      // 4. ZOOM IN
      const zoomDuration = 0.3;
      const warpEase: [number, number, number, number] = [0.7, 0, 0.84, 0]; 

      const zoomImage = imageControls.start({
        scale: 50, 
        opacity: 0, 
        transition: { duration: zoomDuration, ease: warpEase }
      });

      // Trigger theme change at 70% of zoom duration
      setTimeout(() => {
        onCovered();
      }, zoomDuration * 1000 * 0.7);

      await zoomImage;

      // 5. Cleanup
      await containerControls.start({
        opacity: 0,
        transition: { duration: 0.1 }
      });

      onFinished();
    };

    sequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={containerControls}
      className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
    >
      <motion.div
        animate={imageControls}
        className="relative w-[500px] h-[500px] md:w-[800px] md:h-[800px] flex items-center justify-center"
      >
        <img 
          src="https://www.abhinavexists.xyz/shigure-ui-dance.gif"
          alt="Transition Animation"
          className="w-full h-full object-contain"
          style={gifStyle}
        />
      </motion.div>
    </motion.div>
  );
};

export default TransitionLayer;