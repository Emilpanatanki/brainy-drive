import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Level } from '@/data/levels';
import { GameWorld } from './GameWorld';

interface Game3DProps {
  level: Level;
  onComplete: (results: { junction: number; correct: boolean; answer: string }[]) => void;
  onRestart: () => void;
}

export const Game3D = ({ level, onComplete, onRestart }: Game3DProps) => {
  return (
    <div className="w-full h-screen relative">
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 100%)' }}
      >
        <Suspense fallback={null}>
          <GameWorld level={level} onComplete={onComplete} onRestart={onRestart} />
        </Suspense>
      </Canvas>
      
      {/* Mobile Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 md:hidden">
        <button
          className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg active:scale-95 touch-manipulation"
          onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))}
          onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }))}
        >
          ←
        </button>
        <button
          className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg active:scale-95 touch-manipulation"
          onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))}
          onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }))}
        >
          ▲
        </button>
        <button
          className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg active:scale-95 touch-manipulation"
          onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))}
          onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }))}
        >
          →
        </button>
      </div>
      
      {/* Desktop Controls Hint */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm hidden md:block">
        <p>Arrow Keys / WASD to steer</p>
        <p>Drive toward the correct answer!</p>
      </div>
    </div>
  );
};
