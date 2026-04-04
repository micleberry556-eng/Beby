import React, { useState, useRef, useMemo } from 'react';
import { themePresets, useTheme } from '@/contexts/ThemeContext';
import { useMusicPlayer, Track } from '@/contexts/MusicPlayerContext';
import { Settings, Palette, Users, BarChart3, FileText, Shield, ChevronRight, Globe, Music, MessageSquare, Check, Plus, Trash2, Upload, Video, Image, UserCog, Search, Sparkles, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import UserAvatar from '@/components/UserAvatar';

const GROUPS_KEY = 'mamahub_groups';
const VIDEOS_KEY = 'mamahub_videos';
const USERS_KEY = 'mamahub_users';

function getFromStorage(key: string): any[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

const sections = [
  { id: 'themes', label: 'Темы оформления', icon: Palette },
  { id: 'music', label: 'Управление музыкой', icon: Music },
  { id: 'videos', label: 'Управление видео', icon: Video },
  { id: 'groups', label: 'Управление группами', icon: Users },
  { id: 'users', label: 'Пользователи', icon: UserCog },
  { id: 'stats', label: 'Статистика', icon: BarChart3 },
  { id: 'settings', label: 'Настройки', icon: Settings },
];

const AdminPage = () => {
  const { currentTheme, setTheme } = useTheme();
  const { queue, addToQueue, removeFromQueue } = useMusicPlayer();
  const [active, setActive] = useState('themes');
  const categories = useMemo(() => [...new Set(themePresets.map(t => t.category))], []);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [themeSearch, setThemeSearch] = useState('');
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);

  const filteredThemes = useMemo(() => {
    let themes = themePresets;
    if (activeCategory) {
      themes = themes.filter(t => t.category === activeCategory);
    }
    if (themeSearch.trim()) {
      const q = themeSearch.toLowerCase();
      themes = themes.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    return themes;
  }, [activeCategory, themeSearch]);

  const filteredCategories = useMemo(() => {
    const cats = [...new Set(filteredThemes.map(t => t.category))];
    return categories.filter(c => cats.includes(c));
  }, [filteredThemes, categories]);

  const musicFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const videoThumbRef = useRef<HTMLInputElement>(null);
  const groupImgRef = useRef<HTMLInputElement>(null);

  // Music upload
  const [uploading, setUploading] = useState(false);
  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    let pending = files.length;
    Array.from(files).forEach(file => {
      const blobUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const audio = new Audio(blobUrl);
        const onReady = () => {
          addToQueue({
            id: 'admin-' + Date.now() + '-' + Math.random().toString(36).slice(2),
            title: file.name.replace(/\.[^.]+$/, ''),
            artist: 'Админ загрузка',
            album: 'Библиотека',
            cover: '🎵',
            duration: Math.floor(audio.duration || 0),
            url: dataUrl,
          });
          pending--;
          if (pending <= 0) { setUploading(false); toast.success('Музыка загружена!'); }
          URL.revokeObjectURL(blobUrl);
        };
        audio.addEventListener('loadedmetadata', onReady);
        audio.addEventListener('error', onReady);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Video management
  const [videos, setVideos] = useState<any[]>(() => getFromStorage(VIDEOS_KEY));
  const [newVideoDesc, setNewVideoDesc] = useState('');
  const [newVideoThumb, setNewVideoThumb] = useState<string | null>(null);
  const [newVideoData, setNewVideoData] = useState<string | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);

  const handleAdminVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    if (file.size <= 10 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => { setNewVideoData(ev.target?.result as string); setVideoUploading(false); };
      reader.readAsDataURL(file);
    } else {
      setNewVideoData(null);
      setVideoUploading(false);
    }
    // Auto thumbnail
    const vid = document.createElement('video');
    vid.src = URL.createObjectURL(file);
    vid.addEventListener('loadeddata', () => { vid.currentTime = 1; });
    vid.addEventListener('seeked', () => {
      const c = document.createElement('canvas');
      c.width = vid.videoWidth; c.height = vid.videoHeight;
      c.getContext('2d')?.drawImage(vid, 0, 0);
      try { if (!newVideoThumb) setNewVideoThumb(c.toDataURL('image/jpeg', 0.7)); } catch {}
    });
    e.target.value = '';
  };

  const handleAdminThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setNewVideoThumb(ev.target.result as string); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const publishAdminVideo = () => {
    if (!newVideoDesc.trim()) return;
    const gradients = ['from-violet-600 via-purple-500 to-fuchsia-500', 'from-rose-500 via-pink-500 to-red-400', 'from-emerald-500 via-teal-500 to-cyan-500'];
    const v = {
      id: 'av-' + Date.now(),
      authorId: 'admin-1',
      authorName: 'Администратор',
      authorAvatar: '👩‍💼',
      description: newVideoDesc.trim(),
      likes: 0, likedBy: [], comments: [],
      emoji: '🎬',
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      videoDataUrl: newVideoData || undefined,
      thumbnailDataUrl: newVideoThumb || undefined,
    };
    const updated = [v, ...videos];
    setVideos(updated);
    try { localStorage.setItem(VIDEOS_KEY, JSON.stringify(updated)); } catch {}
    setNewVideoDesc(''); setNewVideoData(null); setNewVideoThumb(null);
    toast.success('Видео опубликовано!');
  };

  const deleteVideo = (id: string) => {
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    try { localStorage.setItem(VIDEOS_KEY, JSON.stringify(updated)); } catch {}
    toast.success('Видео удалено');
  };

  // Groups management
  const [groups, setGroups] = useState<any[]>(() => getFromStorage(GROUPS_KEY));
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupIcon, setNewGroupIcon] = useState('💬');
  const [newGroupImg, setNewGroupImg] = useState<string | null>(null);

  const handleGroupImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setNewGroupImg(ev.target.result as string); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const createAdminGroup = () => {
    if (!newGroupName.trim()) return;
    const g = {
      id: 'ag-' + Date.now(),
      name: newGroupName.trim(),
      description: newGroupDesc.trim(),
      icon: newGroupIcon,
      imageUrl: newGroupImg || undefined,
      members: ['admin-1'],
      creatorId: 'admin-1',
      messages: [],
    };
    const updated = [g, ...groups];
    setGroups(updated);
    localStorage.setItem(GROUPS_KEY, JSON.stringify(updated));
    setNewGroupName(''); setNewGroupDesc(''); setNewGroupIcon('💬'); setNewGroupImg(null);
    toast.success('Группа создана!');
  };

  const deleteGroup = (id: string) => {
    const updated = groups.filter(g => g.id !== id);
    setGroups(updated);
    localStorage.setItem(GROUPS_KEY, JSON.stringify(updated));
    toast.success('Группа удалена');
  };

  // Users
  const users = getFromStorage(USERS_KEY);

  const iconOptions = ['💬', '🌱', '🌸', '🌺', '🏥', '🥗', '🧘', '📝', '👶', '🎵', '📚', '🎨'];

  return (
    <div className="p-4 lg:p-6">
      <input ref={musicFileRef} type="file" accept="audio/*" multiple className="hidden" onChange={handleMusicUpload} />
      <input ref={videoFileRef} type="file" accept="video/*" className="hidden" onChange={handleAdminVideoUpload} />
      <input ref={videoThumbRef} type="file" accept="image/*" className="hidden" onChange={handleAdminThumbUpload} />
      <input ref={groupImgRef} type="file" accept="image/*" className="hidden" onChange={handleGroupImgUpload} />

      <h1 className="font-heading text-2xl font-bold mb-6">Админ-панель</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${active === s.id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/50'}`}>
                <s.icon className="w-4 h-4 shrink-0" /><span className="flex-1 text-left">{s.label}</span><ChevronRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/50 mt-4 space-y-3">
            <h3 className="text-sm font-semibold">Сводка</h3>
            {[
              { l: 'Пользователей', v: String(users.length), i: Users },
              { l: 'Групп', v: String(groups.length), i: Globe },
              { l: 'Треков', v: String(queue.length), i: Music },
              { l: 'Видео', v: String(videos.length), i: Video },
            ].map(s => (
              <div key={s.l} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><s.i className="w-4 h-4 text-primary" /></div>
                <div className="flex-1"><p className="text-xs text-muted-foreground">{s.l}</p><p className="text-sm font-bold">{s.v}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* THEMES */}
          {active === 'themes' && (
            <div className="space-y-5">
              {/* Header with current theme info and search */}
              <div className="bg-card rounded-2xl p-5 border border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h2 className="font-heading text-xl font-semibold">Темы оформления</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Активная: <span className="text-primary font-semibold">{currentTheme.name}</span>
                      <span className="mx-1.5 opacity-40">|</span>
                      <span className="opacity-70">{themePresets.length} тем доступно</span>
                    </p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={themeSearch}
                      onChange={e => setThemeSearch(e.target.value)}
                      placeholder="Поиск темы..."
                      className="pl-9 pr-4 py-2 rounded-xl bg-muted text-sm outline-none w-full sm:w-56 focus:ring-2 focus:ring-primary/30 transition-shadow"
                    />
                  </div>
                </div>
              </div>

              {/* Category filter tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === null
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Все
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeCategory === cat
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Live preview panel */}
              <AnimatePresence>
                {previewThemeId && (() => {
                  const pt = themePresets.find(t => t.id === previewThemeId);
                  if (!pt) return null;
                  return (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-2xl border-2 border-primary/30 p-5 space-y-3" style={{ background: `hsl(${pt.colors.background})` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" style={{ color: `hsl(${pt.colors.primary})` }} />
                            <span className="text-sm font-semibold" style={{ color: `hsl(${pt.colors.foreground})` }}>
                              Предпросмотр: {pt.name}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setTheme(pt.id); setPreviewThemeId(null); toast.success(`Тема "${pt.name}" применена!`); }}
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                              style={{ background: `hsl(${pt.colors.primary})` }}
                            >
                              Применить
                            </button>
                            <button
                              onClick={() => setPreviewThemeId(null)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold"
                              style={{ color: `hsl(${pt.colors.foreground})`, background: `hsl(${pt.colors.muted})` }}
                            >
                              Закрыть
                            </button>
                          </div>
                        </div>
                        {/* Mini app preview */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="rounded-xl p-3 space-y-2" style={{ background: `hsl(${pt.colors.card})` }}>
                            <div className="h-2 w-3/4 rounded-full" style={{ background: `hsl(${pt.colors.primary})` }} />
                            <div className="h-2 w-full rounded-full" style={{ background: `hsl(${pt.colors.muted})` }} />
                            <div className="h-2 w-1/2 rounded-full" style={{ background: `hsl(${pt.colors.muted})` }} />
                          </div>
                          <div className="rounded-xl p-3 space-y-2" style={{ background: `hsl(${pt.colors.card})` }}>
                            <div className="h-8 w-full rounded-lg" style={{ background: `hsl(${pt.colors.primary} / 0.15)` }} />
                            <div className="h-2 w-2/3 rounded-full" style={{ background: `hsl(${pt.colors.accent})` }} />
                          </div>
                          <div className="rounded-xl p-3 flex flex-col items-center justify-center gap-2" style={{ background: `hsl(${pt.colors.card})` }}>
                            <div className="w-8 h-8 rounded-full" style={{ background: `hsl(${pt.colors.primary})` }} />
                            <div className="h-2 w-2/3 rounded-full" style={{ background: `hsl(${pt.colors.muted})` }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              {/* Theme cards by category */}
              {filteredThemes.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Темы не найдены. Попробуйте другой запрос.
                </div>
              )}
              {filteredCategories.map(cat => (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-border/50" />
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{cat}</h3>
                    <span className="text-xs text-muted-foreground/60">
                      {filteredThemes.filter(t => t.category === cat).length}
                    </span>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {filteredThemes.filter(t => t.category === cat).map(theme => {
                      const isActive = currentTheme.id === theme.id;
                      const isPreviewing = previewThemeId === theme.id;
                      return (
                        <motion.div
                          key={theme.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setTheme(theme.id)}
                            className={`relative w-full rounded-2xl p-3.5 border-2 text-left transition-shadow ${
                              isActive
                                ? 'border-primary shadow-glow ring-1 ring-primary/20'
                                : isPreviewing
                                  ? 'border-primary/40 shadow-md'
                                  : 'border-transparent hover:border-border/60 shadow-sm hover:shadow-md'
                            }`}
                            style={{ background: `hsl(${theme.colors.background})` }}
                          >
                            {/* Active badge */}
                            {isActive && (
                              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                <Check className="w-3.5 h-3.5 text-primary-foreground" />
                              </div>
                            )}

                            {/* Color palette strip */}
                            <div className="flex gap-1 mb-3">
                              <div className="flex-1 h-6 rounded-l-lg" style={{ background: `hsl(${theme.colors.primary})` }} />
                              <div className="flex-1 h-6" style={{ background: `hsl(${theme.colors.accent})` }} />
                              <div className="flex-1 h-6" style={{ background: `hsl(${theme.colors.card})` }} />
                              <div className="flex-1 h-6 rounded-r-lg" style={{ background: `hsl(${theme.colors.muted})` }} />
                            </div>

                            {/* Mini UI mockup */}
                            <div className="rounded-lg p-2 mb-2.5 space-y-1.5" style={{ background: `hsl(${theme.colors.card})` }}>
                              <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${theme.colors.primary})` }} />
                                <div className="h-1.5 flex-1 rounded-full" style={{ background: `hsl(${theme.colors.muted})` }} />
                              </div>
                              <div className="h-1.5 w-3/4 rounded-full" style={{ background: `hsl(${theme.colors.muted})` }} />
                            </div>

                            {/* Theme name */}
                            <p className="text-xs font-bold truncate" style={{ color: `hsl(${theme.colors.foreground})` }}>
                              {theme.name}
                            </p>

                            {/* Preview button */}
                            <button
                              onClick={(e) => { e.stopPropagation(); setPreviewThemeId(isPreviewing ? null : theme.id); }}
                              className="absolute bottom-2.5 right-2.5 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                              style={{ background: `hsl(${theme.colors.muted})` }}
                              title="Предпросмотр"
                            >
                              <Eye className="w-3 h-3" style={{ color: `hsl(${theme.colors.foreground})` }} />
                            </button>
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MUSIC */}
          {active === 'music' && (
            <div className="space-y-4">
              <div className="bg-card rounded-2xl p-5 border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl font-semibold">Управление музыкой ({queue.length} треков)</h2>
                  <button onClick={() => musicFileRef.current?.click()} disabled={uploading} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
                    <Upload className="w-4 h-4" /> {uploading ? 'Загрузка...' : 'Загрузить MP3'}
                  </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {queue.map((track, idx) => (
                    <div key={track.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <span className="text-lg">{track.cover}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground">{track.artist} · {track.album}</p>
                      </div>
                      {track.url && (
                        <button onClick={() => removeFromQueue(track.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIDEOS */}
          {active === 'videos' && (
            <div className="space-y-4">
              <div className="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
                <h2 className="font-heading text-xl font-semibold">Загрузить видео</h2>
                <textarea value={newVideoDesc} onChange={e => setNewVideoDesc(e.target.value)} placeholder="Описание видео..." rows={2} className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none resize-none" />
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => videoFileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm"><Video className="w-4 h-4" /> {newVideoData ? 'Видео выбрано' : 'Выбрать видео'}</button>
                  <button onClick={() => videoThumbRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm"><Image className="w-4 h-4" /> Обложка</button>
                  <button onClick={publishAdminVideo} disabled={!newVideoDesc.trim() || videoUploading} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">Опубликовать</button>
                </div>
                {newVideoThumb && <img src={newVideoThumb} alt="" className="w-32 h-20 rounded-lg object-cover" />}
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border/50">
                <h2 className="font-heading text-xl font-semibold mb-4">Все видео ({videos.length})</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {videos.map(v => (
                    <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl overflow-hidden shrink-0">
                        {v.thumbnailDataUrl ? <img src={v.thumbnailDataUrl} alt="" className="w-full h-full object-cover" /> : v.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{v.description}</p>
                        <p className="text-xs text-muted-foreground">{v.authorName} · {v.likes} лайков · {(v.comments?.length || 0)} комментариев</p>
                      </div>
                      <button onClick={() => deleteVideo(v.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GROUPS */}
          {active === 'groups' && (
            <div className="space-y-4">
              <div className="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
                <h2 className="font-heading text-xl font-semibold">Создать группу</h2>
                <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Название группы" className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none" />
                <textarea value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} placeholder="Описание..." rows={2} className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none resize-none" />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Иконка:</p>
                  <div className="flex flex-wrap gap-2">
                    {iconOptions.map(ic => <button key={ic} onClick={() => setNewGroupIcon(ic)} className={`text-xl p-1.5 rounded-lg ${newGroupIcon === ic ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'}`}>{ic}</button>)}
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <button onClick={() => groupImgRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm"><Image className="w-4 h-4" /> Обложка</button>
                  {newGroupImg && <img src={newGroupImg} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                  <button onClick={createAdminGroup} disabled={!newGroupName.trim()} className="ml-auto px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">Создать</button>
                </div>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border/50">
                <h2 className="font-heading text-xl font-semibold mb-4">Все группы ({groups.length})</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {groups.map(g => (
                    <div key={g.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl overflow-hidden shrink-0">
                        {g.imageUrl ? <img src={g.imageUrl} alt="" className="w-full h-full object-cover" /> : g.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{g.name}</p>
                        <p className="text-xs text-muted-foreground">{g.members?.length || 0} участниц · {g.messages?.length || 0} сообщений</p>
                      </div>
                      <button onClick={() => deleteGroup(g.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {active === 'users' && (
            <div className="bg-card rounded-2xl p-5 border border-border/50">
              <h2 className="font-heading text-xl font-semibold mb-4">Пользователи ({users.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border/50"><th className="text-left py-3 px-2">Имя</th><th className="text-left py-3 px-2">Email</th><th className="text-left py-3 px-2">Роль</th><th className="text-left py-3 px-2">Друзей</th></tr></thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u.id} className="border-b border-border/30 hover:bg-muted/30">
                        <td className="py-3 px-2 font-medium"><span className="inline-flex items-center gap-2"><UserAvatar name={u.name || 'U'} size={28} />{u.name}</span></td>
                        <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-2"><span className={`text-xs px-2 py-0.5 rounded-full ${u.isAdmin ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{u.isAdmin ? 'Админ' : 'Пользователь'}</span></td>
                        <td className="py-3 px-2">{u.friends?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STATS */}
          {active === 'stats' && (
            <div className="bg-card rounded-2xl p-5 border border-border/50">
              <h2 className="font-heading text-xl font-semibold mb-4">Статистика</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { l: 'Пользователей', v: String(users.length) },
                  { l: 'Групп', v: String(groups.length) },
                  { l: 'Треков в библиотеке', v: String(queue.length) },
                  { l: 'Видео', v: String(videos.length) },
                ].map(s => (
                  <div key={s.l} className="bg-muted/30 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">{s.l}</p>
                    <span className="text-2xl font-bold">{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {active === 'settings' && (
            <div className="bg-card rounded-2xl p-5 border border-border/50 space-y-4">
              <h2 className="font-heading text-xl font-semibold">Настройки сайта</h2>
              <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                <h3 className="text-sm font-semibold text-destructive mb-2">Очистить все данные</h3>
                <p className="text-xs text-muted-foreground mb-3">Удалит все посты, сообщения, видео и группы из localStorage</p>
                <button onClick={() => {
                  if (confirm('Вы уверены? Все данные будут удалены!')) {
                    ['mamahub_posts', 'mamahub_messages', 'mamahub_videos', 'mamahub_groups', 'mamahub_listings'].forEach(k => localStorage.removeItem(k));
                    toast.success('Данные очищены. Перезагрузите страницу.');
                  }
                }} className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold">
                  Очистить данные
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
