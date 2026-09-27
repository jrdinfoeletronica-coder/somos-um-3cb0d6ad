import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="animate-bounce mb-4">
        <h1 className="text-5xl font-black text-foreground tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-accent to-gold">
          SOMOS UM
        </h1>
      </div>
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-75"></div>
        <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-150"></div>
        <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  );
}
