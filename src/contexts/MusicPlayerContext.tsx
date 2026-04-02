import React, { createContext, useContext, useState, ReactNode } from 'react';
export interface Track { id: string; title: string; artist: string; album: string; cover: string; duration: number; url?: string; }
interface MusicPlayerContextType { currentTrack: Track | null; isPlaying: boolean; progress: number; volume: number; queue: Track[]; play: (track: Track) => void; pause: () => void; resume: () => void; setProgress: (p: number) => void; setVolume: (v: number) => void; next: () => void; prev: () => void; addToQueue: (track: Track) => void; }
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
  const play = (track: Track) => { setCurrentTrack(track); setIsPlaying(true); setProgress(0); };
  const pause = () => setIsPlaying(false);
  const resume = () => setIsPlaying(true);
  const next = () => { if (!currentTrack) return; const idx = queue.findIndex(t => t.id === currentTrack.id); if (idx < queue.length - 1) play(queue[idx + 1]); else play(queue[0]); };
  const prev = () => { if (!currentTrack) return; const idx = queue.findIndex(t => t.id === currentTrack.id); if (idx > 0) play(queue[idx - 1]); else play(queue[queue.length - 1]); };
  const addToQueue = (track: Track) => setQueue(q => [...q, track]);
  return (<MusicPlayerContext.Provider value={{ currentTrack, isPlaying, progress, volume, queue, play, pause, resume, setProgress, setVolume, next, prev, addToQueue }}>{children}</MusicPlayerContext.Provider>);
};
export const useMusicPlayer = () => { const ctx = useContext(MusicPlayerContext); if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider'); return ctx; };
