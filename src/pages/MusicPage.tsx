import React, { useState, useRef } from 'react';
import { Play, Pause, Plus, Shuffle, Upload, Trash2 } from 'lucide-react';
import { useMusicPlayer, Track } from '@/contexts/MusicPlayerContext';
import { motion } from 'framer-motion';

const MusicPage = () => {
  const { currentTrack, isPlaying, play, pause, queue, addToQueue, removeFromQueue } = useMusicPlayer();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    let pending = files.length;

    Array.from(files).forEach(file => {
      const blobUrl = URL.createObjectURL(file);
      const title = file.name.replace(/\.[^.]+$/, '');

      // Read as dataURL for persistence
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;

        // Get duration
        const audio = new Audio(blobUrl);
        audio.addEventListener('loadedmetadata', () => {
          const track: Track = {
            id: 'upload-' + Date.now() + '-' + Math.random().toString(36).slice(2),
            title,
            artist: 'Загруженный трек',
            album: 'Мои треки',
            cover: '🎶',
            duration: Math.floor(audio.duration),
            url: dataUrl,
          };
          addToQueue(track);
          pending--;
          if (pending <= 0) setUploading(false);
          URL.revokeObjectURL(blobUrl);
        });
        audio.addEventListener('error', () => {
          const track: Track = {
            id: 'upload-' + Date.now() + '-' + Math.random().toString(36).slice(2),
            title,
            artist: 'Загруженный трек',
            album: 'Мои треки',
            cover: '🎶',
            duration: 0,
            url: dataUrl,
          };
          addToQueue(track);
          pending--;
          if (pending <= 0) setUploading(false);
          URL.revokeObjectURL(blobUrl);
        });
      };
      reader.onerror = () => {
        pending--;
        if (pending <= 0) setUploading(false);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const playlists = [
    { id: '1', name: 'Для беременных', icon: '🤰', tracks: 24, color: 'from-pink-500/20 to-rose-500/20' },
    { id: '2', name: 'Колыбельные', icon: '🌙', tracks: 18, color: 'from-indigo-500/20 to-purple-500/20' },
    { id: '3', name: 'Медитация', icon: '🧘', tracks: 32, color: 'from-emerald-500/20 to-teal-500/20' },
    { id: '4', name: 'Звуки природы', icon: '🌿', tracks: 45, color: 'from-green-500/20 to-lime-500/20' },
    { id: '5', name: 'Классика', icon: '🎻', tracks: 60, color: 'from-amber-500/20 to-orange-500/20' },
    { id: '6', name: 'Для малыша', icon: '👶', tracks: 28, color: 'from-sky-500/20 to-blue-500/20' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <input ref={fileInputRef} type="file" accept="audio/*" multiple className="hidden" onChange={handleUpload} />

      <div className="gradient-primary rounded-3xl p-6 sm:p-8 text-primary-foreground">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-2">Музыка</h1>
        <p className="text-sm opacity-80">Расслабьтесь и наслаждайтесь музыкой вместе с малышом</p>
        <div className="flex items-center gap-3 mt-4">
          <button className="px-5 py-2 rounded-xl bg-card/20 backdrop-blur-sm text-sm font-semibold flex items-center gap-2"><Shuffle className="w-4 h-4" /> Перемешать</button>
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-5 py-2 rounded-xl bg-card/20 backdrop-blur-sm text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
            <Upload className="w-4 h-4" /> {uploading ? 'Загрузка...' : 'Загрузить MP3'}
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-xl font-semibold mb-4">Плейлисты</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {playlists.map(pl => (
            <motion.div key={pl.id} whileHover={{ scale: 1.03 }} className={`bg-gradient-to-br ${pl.color} rounded-2xl p-4 cursor-pointer border border-border/30`}>
              <span className="text-3xl">{pl.icon}</span>
              <p className="text-sm font-semibold mt-2">{pl.name}</p>
              <p className="text-xs text-muted-foreground">{pl.tracks} треков</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-semibold">Все треки ({queue.length})</h2>
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="text-xs text-primary font-medium flex items-center gap-1 disabled:opacity-50">
            <Plus className="w-3.5 h-3.5" /> {uploading ? 'Загрузка...' : 'Загрузить'}
          </button>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/50">
          {queue.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">Нет треков. Загрузите MP3 файлы!</p>
            </div>
          )}
          {queue.map((track, idx) => {
            const active = currentTrack?.id === track.id;
            return (
              <div key={track.id} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 ${active ? 'bg-primary/5' : ''}`}>
                <span className="text-xs text-muted-foreground w-6 text-right">{active && isPlaying ? <span className="text-primary text-lg">♫</span> : idx + 1}</span>
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0" onClick={() => active && isPlaying ? pause() : play(track)}>{track.cover}</div>
                <div className="flex-1 min-w-0" onClick={() => active && isPlaying ? pause() : play(track)}>
                  <p className={`text-sm font-medium truncate ${active ? 'text-primary' : ''}`}>{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist} · {track.album}</p>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">{track.duration > 0 ? fmt(track.duration) : '--:--'}</span>
                {track.url && (
                  <button onClick={() => removeFromQueue(track.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Удалить">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => active && isPlaying ? pause() : play(track)} className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 hover:bg-primary/20">
                  {active && isPlaying ? <Pause className="w-3.5 h-3.5 text-primary" /> : <Play className="w-3.5 h-3.5 text-primary ml-0.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
