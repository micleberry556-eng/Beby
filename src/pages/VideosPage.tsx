import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Plus, Upload, X, Video, Send, Play } from 'lucide-react';
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
  videoDataUrl?: string;      // dataURL for small files (persists in localStorage)
  videoBlobUrl?: string;      // blob URL for large files (session only)
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
  // Strip blob URLs before saving (they don't persist)
  const toSave = videos.map(v => {
    const { videoBlobUrl, ...rest } = v;
    return rest;
  });
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(toSave));
}

const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
const gradients = ['from-violet-600 via-purple-500 to-fuchsia-500', 'from-rose-500 via-pink-500 to-red-400', 'from-emerald-500 via-teal-500 to-cyan-500', 'from-amber-500 via-orange-500 to-yellow-500', 'from-sky-500 via-blue-500 to-indigo-500'];

const VideoPlayer = ({ src }: { src: string }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        playsInline
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        controls
      />
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 z-10"
        >
          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </button>
      )}
    </div>
  );
};

const VideosPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoData[]>(getStoredVideos);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadVideoPreview, setUploadVideoPreview] = useState<string | null>(null);
  const [uploadVideoDataUrl, setUploadVideoDataUrl] = useState<string | null>(null);
  const [uploadVideoBlobUrl, setUploadVideoBlobUrl] = useState<string | null>(null);
  const [uploadThumb, setUploadThumb] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setUploadVideoPreview(blobUrl);
    setUploadVideoBlobUrl(blobUrl);
    setUploading(true);

    // Try to convert to dataURL for localStorage persistence
    // For files >5MB, keep only blob URL (works in current session)
    if (file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setUploadVideoDataUrl(ev.target.result as string);
        setUploading(false);
      };
      reader.onerror = () => {
        setUploadVideoDataUrl(null);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      // Large file -- blob URL only (session playback)
      setUploadVideoDataUrl(null);
      setUploading(false);
    }

    // Auto-generate thumbnail
    const video = document.createElement('video');
    video.src = blobUrl;
    video.muted = true;
    video.addEventListener('loadeddata', () => { video.currentTime = 1; });
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      try {
        const thumb = canvas.toDataURL('image/jpeg', 0.7);
        setUploadThumb(prev => prev || thumb);
      } catch { /* ignore */ }
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
    if (!uploadVideoDataUrl && !uploadVideoBlobUrl) return;

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
      videoBlobUrl: !uploadVideoDataUrl ? (uploadVideoBlobUrl || undefined) : undefined,
      thumbnailDataUrl: uploadThumb || undefined,
    };
    const updated = [newVideo, ...videos];
    setVideos(updated);
    try { saveVideos(updated); } catch { /* localStorage full */ }
    setShowUpload(false);
    setUploadDesc('');
    setUploadVideoPreview(null);
    setUploadVideoDataUrl(null);
    setUploadVideoBlobUrl(null);
    setUploadThumb(null);
  };

  const getVideoSrc = (v: VideoData): string | null => {
    return v.videoDataUrl || v.videoBlobUrl || null;
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
              <button onClick={publishVideo} disabled={!uploadDesc.trim() || uploading || (!uploadVideoDataUrl && !uploadVideoBlobUrl)} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">
                {uploading ? 'Обработка...' : 'Опубликовать'}
              </button>
            </div>
            {/* Preview */}
            <div className="flex gap-3 flex-wrap">
              {uploadVideoPreview && (
                <div className="relative">
                  <video src={uploadVideoPreview} className="w-48 h-28 rounded-lg object-contain bg-black" controls muted playsInline />
                  <button onClick={() => { setUploadVideoPreview(null); setUploadVideoDataUrl(null); setUploadVideoBlobUrl(null); }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"><X className="w-3 h-3" /></button>
                </div>
              )}
              {uploadThumb && (
                <div className="relative">
                  <img src={uploadThumb} alt="" className="w-28 h-28 rounded-lg object-cover" />
                  <button onClick={() => setUploadThumb(null)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"><X className="w-3 h-3" /></button>
                  <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 rounded">обложка</span>
                </div>
              )}
            </div>
            {!uploadVideoDataUrl && uploadVideoBlobUrl && (
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                Видео большое (&gt;5МБ) -- будет доступно только в текущей сессии браузера.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Videos grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map(v => {
          const liked = user ? v.likedBy.includes(user.id) : false;
          const commentsOpen = openComments === v.id;
          const videoSrc = getVideoSrc(v);

          return (
            <div key={v.id} className="rounded-2xl overflow-hidden border border-border/50">
              {/* Video area */}
              <div className={`h-72 bg-gradient-to-br ${v.gradient} flex items-center justify-center relative`}>
                {videoSrc ? (
                  <VideoPlayer src={videoSrc} />
                ) : v.thumbnailDataUrl ? (
                  <img src={v.thumbnailDataUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span className="text-7xl">{v.emoji}</span>
                )}

                {/* Author info overlay -- only show when no video playing */}
                {!videoSrc && (
                  <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">{v.authorAvatar}</div>
                      <span className="text-white text-sm font-bold drop-shadow">{v.authorName}</span>
                    </div>
                    <p className="text-white text-xs drop-shadow">{v.description}</p>
                  </div>
                )}
                {!videoSrc && <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />}
              </div>

              {/* Info bar */}
              <div className="p-3 bg-card">
                {videoSrc && (
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{v.authorAvatar}</span>
                      <span className="text-sm font-semibold">{v.authorName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{v.description}</p>
                  </div>
                )}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideosPage;
