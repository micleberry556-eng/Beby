import React from 'react';
import { Play, Pause, Plus, Shuffle, Heart } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { motion } from 'framer-motion';
const playlists = [
  { id: '1', name: 'Для беременных', icon: '🤰', tracks: 24, color: 'from-pink-500/20 to-rose-500/20' },
  { id: '2', name: 'Колыбельные', icon: '🌙', tracks: 18, color: 'from-indigo-500/20 to-purple-500/20' },
  { id: '3', name: 'Медитация', icon: '🧘', tracks: 32, color: 'from-emerald-500/20 to-teal-500/20' },
  { id: '4', name: 'Звуки природы', icon: '🌿', tracks: 45, color: 'from-green-500/20 to-lime-500/20' },
  { id: '5', name: 'Классика', icon: '🎻', tracks: 60, color: 'from-amber-500/20 to-orange-500/20' },
  { id: '6', name: 'Для малыша', icon: '👶', tracks: 28, color: 'from-sky-500/20 to-blue-500/20' },
];
const MusicPage = () => {
  const { currentTrack, isPlaying, play, pause, queue } = useMusicPlayer();
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="gradient-primary rounded-3xl p-6 sm:p-8 text-primary-foreground"><h1 className="font-heading text-2xl sm:text-3xl font-bold mb-2">Музыка</h1><p className="text-sm opacity-80">Расслабьтесь и наслаждайтесь музыкой вместе с малышом</p><div className="flex items-center gap-3 mt-4"><button className="px-5 py-2 rounded-xl bg-card/20 backdrop-blur-sm text-sm font-semibold flex items-center gap-2"><Shuffle className="w-4 h-4" /> Перемешать</button></div></div>
      <div><h2 className="font-heading text-xl font-semibold mb-4">Плейлисты</h2><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">{playlists.map(pl => <motion.div key={pl.id} whileHover={{ scale: 1.03 }} className={`bg-gradient-to-br ${pl.color} rounded-2xl p-4 cursor-pointer border border-border/30`}><span className="text-3xl">{pl.icon}</span><p className="text-sm font-semibold mt-2">{pl.name}</p><p className="text-xs text-muted-foreground">{pl.tracks} треков</p></motion.div>)}</div></div>
      <div><div className="flex items-center justify-between mb-4"><h2 className="font-heading text-xl font-semibold">Все треки</h2></div>
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/50">
          {queue.map((track, idx) => { const active = currentTrack?.id === track.id; return (
            <div key={track.id} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 ${active ? 'bg-primary/5' : ''}`} onClick={() => active && isPlaying ? pause() : play(track)}>
              <span className="text-xs text-muted-foreground w-6 text-right">{active && isPlaying ? <span className="text-primary text-lg">♫</span> : idx + 1}</span>
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">{track.cover}</div>
              <div className="flex-1 min-w-0"><p className={`text-sm font-medium truncate ${active ? 'text-primary' : ''}`}>{track.title}</p><p className="text-xs text-muted-foreground truncate">{track.artist} · {track.album}</p></div>
              <span className="text-xs text-muted-foreground hidden sm:block">{fmt(track.duration)}</span>
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 hover:bg-primary/20">{active && isPlaying ? <Pause className="w-3.5 h-3.5 text-primary" /> : <Play className="w-3.5 h-3.5 text-primary ml-0.5" />}</button>
            </div>); })}
        </div>
      </div>
    </div>
  );
};
export default MusicPage;
