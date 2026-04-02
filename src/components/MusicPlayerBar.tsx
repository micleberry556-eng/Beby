import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { motion, AnimatePresence } from 'framer-motion';

export const MusicPlayerBar = () => {
  const { currentTrack, isPlaying, progress, pause, resume, next, prev, volume, setVolume, setProgress } = useMusicPlayer();
  if (!currentTrack) return null;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  return (
    <AnimatePresence>
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className="fixed bottom-14 lg:bottom-0 left-0 right-0 z-50 player-bar border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-0 w-1/4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg shrink-0">{currentTrack.cover}</div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'hsl(var(--player-foreground))' }}>{currentTrack.title}</p>
              <p className="text-xs truncate" style={{ color: 'hsl(var(--player-foreground) / 0.6)' }}>{currentTrack.artist}</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <button onClick={prev} className="p-1 opacity-70 hover:opacity-100"><SkipBack className="w-4 h-4" style={{ color: 'hsl(var(--player-foreground))' }} /></button>
              <button onClick={isPlaying ? pause : resume} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'hsl(var(--player-accent))' }}>
                {isPlaying ? <Pause className="w-4 h-4" style={{ color: 'hsl(var(--player-foreground))' }} /> : <Play className="w-4 h-4 ml-0.5" style={{ color: 'hsl(var(--player-foreground))' }} />}
              </button>
              <button onClick={next} className="p-1 opacity-70 hover:opacity-100"><SkipForward className="w-4 h-4" style={{ color: 'hsl(var(--player-foreground))' }} /></button>
            </div>
            <div className="hidden sm:flex items-center gap-2 w-full max-w-md">
              <span className="text-[10px]" style={{ color: 'hsl(var(--player-foreground) / 0.5)' }}>{formatTime(progress * currentTrack.duration / 100)}</span>
              <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(Number(e.target.value))} className="flex-1 h-1 appearance-none rounded-full cursor-pointer" style={{ accentColor: 'hsl(var(--player-accent))' }} />
              <span className="text-[10px]" style={{ color: 'hsl(var(--player-foreground) / 0.5)' }}>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 w-1/6 justify-end">
            <Volume2 className="w-4 h-4 shrink-0" style={{ color: 'hsl(var(--player-foreground) / 0.6)' }} />
            <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-20 h-1 appearance-none rounded-full cursor-pointer" style={{ accentColor: 'hsl(var(--player-accent))' }} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
