import { useState, useEffect, useRef } from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MetronomeProps {
  bpm: number;
}

export function Metronome({ bpm }: MetronomeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && bpm > 0) {
      const intervalMs = (60 / bpm) * 1000;
      timerRef.current = window.setInterval(() => {
        setBeat((prev) => (prev + 1) % 4);
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm]);

  if (!bpm) return null;

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-card border border-border rounded-xl">
      <div className="flex items-center justify-between w-full">
        <span className="font-medium text-muted-foreground text-sm">Metrônomo</span>
        <span className="font-display font-bold text-lg text-accent">{bpm} BPM</span>
      </div>
      
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "w-4 h-4 rounded-full transition-all duration-75",
              isPlaying && beat === i
                ? i === 0 ? "bg-accent scale-125 shadow-[0_0_10px_rgba(201,168,106,0.8)]" : "bg-gold scale-110 shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                : "bg-white/10"
            )}
          />
        ))}
      </div>

      <Button
        variant={isPlaying ? "destructive" : "gold"}
        size="sm"
        className="w-full mt-2 h-8 text-xs font-semibold"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? (
          <>
            <Square className="w-3 h-3 mr-2" />
            Parar
          </>
        ) : (
          <>
            <Play className="w-3 h-3 mr-2" />
            Tocar
          </>
        )}
      </Button>
    </div>
  );
}
