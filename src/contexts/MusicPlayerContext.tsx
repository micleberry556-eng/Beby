import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: number;
  url?: string; // dataURL or blob URL for uploaded files
}

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  queue: Track[];
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  setProgress: (p: number) => void;
  setVolume: (v: number) => void;
  next: () => void;
  prev: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (id: string) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const mockTracks: Track[] = [
  { id: '1', title: 'Колыбельная для малыша', artist: 'Нежные мелодии', album: 'Для беременных', cover: '🎵', duration: 245 },
  { id: '2', title: 'Звуки природы', artist: 'Релакс', album: 'Медитация', cover: '🌿', duration: 320 },
  { id: '3', title: 'Классика для двоих', artist: 'Моцарт', album: 'Пренатальная музыка', cover: '🎻', duration: 280 },
  { id: '4', title: 'Утренняя йога', artist: 'Гармония', album: 'Йога', cover: '🧘', duration: 360 },
  { id: '5', title: 'Спокойной ночи', artist: 'Лунный свет', album: 'Сон', cover: '🌙', duration: 290 },
  { id: '6', title: 'Весенний дождь', artist: 'Природа', album: 'Звуки', cover: '🌧', duration: 210 },
  { id: '7', title: 'Детский смех', artist: 'Счастье', album: 'Радость', cover: '👶', duration: 180 },
  { id: '8', title: 'Морской бриз', artist: 'Океан', album: 'Релакс', cover: '🌊', duration: 340 },
  { id: '9', title: 'Первые шаги', artist: 'Нежность', album: 'Материнство', cover: '👣', duration: 220 },
  { id: '10', title: 'Сердцебиение', artist: 'Жизнь', album: 'Чудо', cover: '💗', duration: 195 },
];

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [queue, setQueue] = useState<Track[]>(mockTracks);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element once
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;
    return () => { audioRef.current?.pause(); };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // Track progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onEnded = () => {
      // Auto-play next
      if (currentTrack) {
        const idx = queue.findIndex(t => t.id === currentTrack.id);
        if (idx < queue.length - 1) {
          playTrack(queue[idx + 1]);
        } else {
          playTrack(queue[0]);
        }
      }
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack, queue]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setProgress(0);
    const audio = audioRef.current;
    if (audio && track.url) {
      audio.src = track.url;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(true));
    } else {
      // No real audio file -- just simulate
      setIsPlaying(true);
    }
  };

  const play = (track: Track) => playTrack(track);

  const pause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  const resume = () => {
    setIsPlaying(true);
    if (audioRef.current?.src) {
      audioRef.current.play().catch(() => {});
    }
  };

  const handleSetProgress = (p: number) => {
    setProgress(p);
    const audio = audioRef.current;
    if (audio && audio.duration > 0) {
      audio.currentTime = (p / 100) * audio.duration;
    }
  };

  const next = () => {
    if (!currentTrack) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    playTrack(idx < queue.length - 1 ? queue[idx + 1] : queue[0]);
  };

  const prev = () => {
    if (!currentTrack) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    playTrack(idx > 0 ? queue[idx - 1] : queue[queue.length - 1]);
  };

  const addToQueue = (track: Track) => {
    setQueue(q => [...q, track]);
  };

  const removeFromQueue = (id: string) => {
    setQueue(q => q.filter(t => t.id !== id));
    if (currentTrack?.id === id) {
      pause();
      setCurrentTrack(null);
    }
  };

  return (
    <MusicPlayerContext.Provider value={{
      currentTrack, isPlaying, progress, volume, queue,
      play, pause, resume,
      setProgress: handleSetProgress, setVolume,
      next, prev, addToQueue, removeFromQueue, audioRef,
    }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return ctx;
};
