import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Plus, Play, Upload, X, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface VideoData {
  id: string;
  authorName: string;
  authorAvatar: string;
  description: string;
  likes: number;
  likedBy: string[];
  comments: number;
  emoji: string;
  gradient: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

const VIDEOS_KEY = 'mamahub_videos';

function getStoredVideos(): VideoData[] {
  try {
    const stored = localStorage.getItem(VIDEOS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  const defaults: VideoData[] = [
    { id: 'v1', authorName: 'Мария Петрова', authorAvatar: '👩‍🦰', description: 'Утренняя йога для беременных', likes: 4200, likedBy: [], comments: 186, emoji: '🧘‍♀️', gradient: 'from-violet-600 via-purple-500 to-fuchsia-500' },
    { id: 'v2', authorName: 'Елена Сидорова', authorAvatar: '👩‍🦱', description: 'Реакция мужа на УЗИ', likes: 15800, likedBy: [], comments: 923, emoji: '😂', gradient: 'from-rose-500 via-pink-500 to-red-400' },
    { id: 'v3', authorName: 'Ольга Козлова', authorAvatar: '👱‍♀️', description: 'Собираю сумку в роддом!', likes: 8900, likedBy: [], comments: 445, emoji: '🎒', gradient: 'from-emerald-500 via-teal-500 to-cyan-500' },
    { id: 'v4', authorName: 'Наталья Морозова', authorAvatar: '👩‍🦳', description: 'Полезные перекусы для беременных', likes: 3400, likedBy: [], comments: 156, emoji: '🥗', gradient: 'from-amber-500 via-orange-500 to-yellow-500' },
  ];
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(defaults));
  return defaults;
}

const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
const gradients = ['from-violet-600 via-purple-500 to-fuchsia-500', 'from-rose-500 via-pink-500 to-red-400', 'from-emerald-500 via-teal-500 to-cyan-500', 'from-amber-500 via-orange-500 to-yellow-500', 'from-sky-500 via-blue-500 to-indigo-500'];

const VideosPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoData[]>(getStoredVideos);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadFile, setUploadFile] = useState<string | null>(null);
  const [uploadThumb, setUploadThumb] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadFile(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setUploadThumb(ev.target.result as string); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const publishVideo = () => {
    if (!user || !uploadDesc.trim()) return;
    const newVideo: VideoData = {
      id: 'v-' + Date.now(),
      authorName: user.name,
      authorAvatar: user.avatar,
      description: uploadDesc.trim(),
      likes: 0,
      likedBy: [],
      comments: 0,
      emoji: '🎬',
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      videoUrl: uploadFile || undefined,
      thumbnailUrl: uploadThumb || undefined,
    };
    const updated = [newVideo, ...videos];
    setVideos(updated);
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(updated));
    setShowUpload(false);
    setUploadDesc('');
    setUploadFile(null);
    setUploadThumb(null);
  };

  const toggleLike = (id: string) => {
    if (!user) return;
    const updated = videos.map(v => {
      if (v.id !== id) return v;
      const liked = v.likedBy.includes(user.id);
      return { ...v, likedBy: liked ? v.likedBy.filter(x => x !== user.id) : [...v.likedBy, user.id], likes: v.likes + (liked ? -1 : 1) };
    });
    setVideos(updated);
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(updated));
  };

  return (
    <div className="p-4 lg:p-6">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
      <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} />

      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-2xl font-bold">Клипы</h1>
        <button onClick={() => setShowUpload(!showUpload)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Загрузить
        </button>
      </div>

      {showUpload && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-card rounded-2xl p-5 border border-border/50 mb-4 space-y-3">
          <h3 className="font-semibold">Новый клип</h3>
          <textarea value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} placeholder="Описание клипа..." rows={2} className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none resize-none" />
          <div className="flex gap-3">
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm">
              <Video className="w-4 h-4" /> {uploadFile ? 'Видео выбрано' : 'Выбрать видео'}
            </button>
            <button onClick={() => thumbRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm">
              <Upload className="w-4 h-4" /> Обложка
            </button>
            <button onClick={publishVideo} disabled={!uploadDesc.trim()} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">Опубликовать</button>
          </div>
          {uploadThumb && <img src={uploadThumb} alt="" className="w-32 h-20 rounded-lg object-cover" />}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map(v => {
          const liked = user ? v.likedBy.includes(user.id) : false;
          return (
            <motion.div key={v.id} whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden border border-border/50">
              <div className={`h-64 bg-gradient-to-br ${v.gradient} flex items-center justify-center relative`}>
                {v.videoUrl ? (
                  <video src={v.videoUrl} className="absolute inset-0 w-full h-full object-cover" controls />
                ) : v.thumbnailUrl ? (
                  <img src={v.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span className="text-7xl">{v.emoji}</span>
                )}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">{v.authorAvatar}</div>
                    <span className="text-white text-sm font-bold drop-shadow">{v.authorName}</span>
                  </div>
                  <p className="text-white text-xs drop-shadow">{v.description}</p>
                </div>
                {!v.videoUrl && <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />}
              </div>
              <div className="p-3 bg-card flex items-center gap-4">
                <button onClick={() => toggleLike(v.id)} className={`flex items-center gap-1 text-xs ${liked ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Heart className={`w-4 h-4 ${liked ? 'fill-primary' : ''}`} /> {fmt(v.likes)}
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle className="w-4 h-4" /> {fmt(v.comments)}</button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground"><Share2 className="w-4 h-4" /> Поделиться</button>
                <button className="ml-auto text-muted-foreground"><Bookmark className="w-4 h-4" /></button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VideosPage;
