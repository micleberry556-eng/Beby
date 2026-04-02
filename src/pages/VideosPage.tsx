import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Plus, Upload, X, Video, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface VideoComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

interface VideoData {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  description: string;
  likes: number;
  likedBy: string[];
  comments: VideoComment[];
  emoji: string;
  gradient: string;
  videoDataUrl?: string;
  thumbnailDataUrl?: string;
}

const VIDEOS_KEY = 'mamahub_videos';

function getStoredVideos(): VideoData[] {
  try {
    const stored = localStorage.getItem(VIDEOS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  const defaults: VideoData[] = [
    { id: 'v1', authorId: 's1', authorName: 'Мария Петрова', authorAvatar: '👩‍🦰', description: 'Утренняя йога для беременных', likes: 4200, likedBy: [], comments: [], emoji: '🧘‍♀️', gradient: 'from-violet-600 via-purple-500 to-fuchsia-500' },
    { id: 'v2', authorId: 's2', authorName: 'Елена Сидорова', authorAvatar: '👩‍🦱', description: 'Реакция мужа на УЗИ', likes: 15800, likedBy: [], comments: [], emoji: '😂', gradient: 'from-rose-500 via-pink-500 to-red-400' },
    { id: 'v3', authorId: 's3', authorName: 'Ольга Козлова', authorAvatar: '👱‍♀️', description: 'Собираю сумку в роддом!', likes: 8900, likedBy: [], comments: [], emoji: '🎒', gradient: 'from-emerald-500 via-teal-500 to-cyan-500' },
    { id: 'v4', authorId: 's4', authorName: 'Наталья Морозова', authorAvatar: '👩‍🦳', description: 'Полезные перекусы для беременных', likes: 3400, likedBy: [], comments: [], emoji: '🥗', gradient: 'from-amber-500 via-orange-500 to-yellow-500' },
  ];
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveVideos(videos: VideoData[]) {
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
}

const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
const gradients = ['from-violet-600 via-purple-500 to-fuchsia-500', 'from-rose-500 via-pink-500 to-red-400', 'from-emerald-500 via-teal-500 to-cyan-500', 'from-amber-500 via-orange-500 to-yellow-500', 'from-sky-500 via-blue-500 to-indigo-500'];

const VideosPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoData[]>(getStoredVideos);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadVideoPreview, setUploadVideoPreview] = useState<string | null>(null);
  const [uploadVideoDataUrl, setUploadVideoDataUrl] = useState<string | null>(null);
  const [uploadThumb, setUploadThumb] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show preview immediately with blob URL
    setUploadVideoPreview(URL.createObjectURL(file));
    setUploading(true);
    // Convert to dataURL for persistence (limit ~10MB)
    if (file.size > 10 * 1024 * 1024) {
      // Too large for localStorage, keep blob URL (session only)
      setUploadVideoDataUrl(null);
      setUploading(false);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setUploadVideoDataUrl(ev.target.result as string);
        setUploading(false);
      };
      reader.onerror = () => setUploading(false);
      reader.readAsDataURL(file);
    }
    // Auto-generate thumbnail from video
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.addEventListener('loadeddata', () => {
      video.currentTime = 1;
    });
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      try {
        const thumb = canvas.toDataURL('image/jpeg', 0.7);
        if (!uploadThumb) setUploadThumb(thumb);
      } catch { /* cross-origin or other error */ }
    });
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
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      description: uploadDesc.trim(),
      likes: 0,
      likedBy: [],
      comments: [],
      emoji: '🎬',
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      videoDataUrl: uploadVideoDataUrl || undefined,
      thumbnailDataUrl: uploadThumb || undefined,
    };
    const updated = [newVideo, ...videos];
    setVideos(updated);
    try { saveVideos(updated); } catch { /* localStorage full -- still show in session */ }
    setShowUpload(false);
    setUploadDesc('');
    setUploadVideoPreview(null);
    setUploadVideoDataUrl(null);
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
    try { saveVideos(updated); } catch { /* ignore */ }
  };

  const addComment = (videoId: string) => {
    if (!user || !commentText.trim()) return;
    const comment: VideoComment = {
      id: 'vc-' + Date.now(),
      authorName: user.name,
      authorAvatar: user.avatar,
      text: commentText.trim(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = videos.map(v =>
      v.id === videoId ? { ...v, comments: [...v.comments, comment] } : v
    );
    setVideos(updated);
    try { saveVideos(updated); } catch { /* ignore */ }
    setCommentText('');
  };

  return (
    <div className="p-4 lg:p-6">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
      <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} />

      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-2xl font-bold">Клипы ({videos.length})</h1>
        <button onClick={() => setShowUpload(!showUpload)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Загрузить
        </button>
      </div>

      {/* Upload form */}
      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-card rounded-2xl p-5 border border-border/50 mb-4 space-y-3 overflow-hidden">
            <h3 className="font-semibold">Новый клип</h3>
            <textarea value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} placeholder="Описание клипа..." rows={2} className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none resize-none" />
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm">
                <Video className="w-4 h-4" /> {uploadVideoPreview ? 'Видео выбрано' : 'Выбрать видео'}
              </button>
              <button onClick={() => thumbRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm">
                <Upload className="w-4 h-4" /> Своя обложка
              </button>
              <button onClick={publishVideo} disabled={!uploadDesc.trim() || uploading} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">
                {uploading ? 'Загрузка...' : 'Опубликовать'}
              </button>
            </div>
            {/* Preview */}
            <div className="flex gap-3">
              {uploadVideoPreview && (
                <div className="relative">
                  <video src={uploadVideoPreview} className="w-40 h-24 rounded-lg object-cover" controls muted />
                  <button onClick={() => { setUploadVideoPreview(null); setUploadVideoDataUrl(null); }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"><X className="w-3 h-3" /></button>
                </div>
              )}
              {uploadThumb && (
                <div className="relative">
                  <img src={uploadThumb} alt="" className="w-24 h-24 rounded-lg object-cover" />
                  <button onClick={() => setUploadThumb(null)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"><X className="w-3 h-3" /></button>
                  <span className="absolute bottom-1 left-1 text-[9px] bg-black/50 text-white px-1 rounded">обложка</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Videos grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map(v => {
          const liked = user ? v.likedBy.includes(user.id) : false;
          const commentsOpen = openComments === v.id;
          return (
            <motion.div key={v.id} className="rounded-2xl overflow-hidden border border-border/50">
              <div className={`h-64 bg-gradient-to-br ${v.gradient} flex items-center justify-center relative`}>
                {v.videoDataUrl ? (
                  <video src={v.videoDataUrl} className="absolute inset-0 w-full h-full object-cover" controls />
                ) : v.thumbnailDataUrl ? (
                  <img src={v.thumbnailDataUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span className="text-7xl">{v.emoji}</span>
                )}
                <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">{v.authorAvatar}</div>
                    <span className="text-white text-sm font-bold drop-shadow">{v.authorName}</span>
                  </div>
                  <p className="text-white text-xs drop-shadow">{v.description}</p>
                </div>
                {!v.videoDataUrl && <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />}
              </div>
              <div className="p-3 bg-card">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleLike(v.id)} className={`flex items-center gap-1 text-xs ${liked ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Heart className={`w-4 h-4 ${liked ? 'fill-primary' : ''}`} /> {fmt(v.likes)}
                  </button>
                  <button onClick={() => setOpenComments(commentsOpen ? null : v.id)} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="w-4 h-4" /> {v.comments.length}
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground"><Share2 className="w-4 h-4" /> Поделиться</button>
                  <button className="ml-auto text-muted-foreground"><Bookmark className="w-4 h-4" /></button>
                </div>

                {/* Comments */}
                <AnimatePresence>
                  {commentsOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                        {v.comments.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">Нет комментариев</p>}
                        {v.comments.map(c => (
                          <div key={c.id} className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs shrink-0">{c.authorAvatar}</div>
                            <div className="bg-muted/50 rounded-xl px-2.5 py-1.5 flex-1">
                              <span className="text-[10px] font-semibold">{c.authorName}</span>
                              <p className="text-xs">{c.text}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addComment(v.id)}
                            placeholder="Комментарий..."
                            className="flex-1 px-3 py-1.5 rounded-xl bg-muted text-xs outline-none"
                          />
                          <button onClick={() => addComment(v.id)} className="px-2.5 py-1.5 rounded-xl bg-primary text-primary-foreground">
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VideosPage;
