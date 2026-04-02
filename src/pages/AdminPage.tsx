import React, { useState, useRef } from 'react';
import { themePresets, useTheme } from '@/contexts/ThemeContext';
import { useMusicPlayer, Track } from '@/contexts/MusicPlayerContext';
import { Settings, Palette, Users, BarChart3, FileText, Shield, ChevronRight, Globe, Music, MessageSquare, Check, Plus, Trash2, Upload, Video, Image, UserCog } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
  const categories = [...new Set(themePresets.map(t => t.category))];
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
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-5 border border-border/50">
                <h2 className="font-heading text-xl font-semibold mb-2">Темы оформления</h2>
                <p className="text-sm text-muted-foreground">Текущая: <span className="text-primary font-semibold">{currentTheme.name}</span></p>
              </div>
              {categories.map(cat => (
                <div key={cat}>
                  <h3 className="font-semibold text-base mb-3">{cat}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {themePresets.filter(t => t.category === cat).map(theme => {
                      const a = currentTheme.id === theme.id;
                      return (
                        <motion.button key={theme.id} whileHover={{ scale: 1.03 }} onClick={() => setTheme(theme.id)} className={`relative rounded-xl p-3 border-2 text-left ${a ? 'border-primary shadow-glow' : 'border-border/50 hover:border-border'}`} style={{ background: `hsl(${theme.colors.card})` }}>
                          {a && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-primary-foreground" /></div>}
                          <div className="flex gap-1.5 mb-2">
                            <div className="w-6 h-6 rounded-full" style={{ background: `hsl(${theme.colors.primary})` }} />
                            <div className="w-6 h-6 rounded-full" style={{ background: `hsl(${theme.colors.accent})` }} />
                            <div className="w-6 h-6 rounded-full" style={{ background: `hsl(${theme.colors.muted})` }} />
                          </div>
                          <p className="text-xs font-semibold truncate" style={{ color: `hsl(${theme.colors.foreground})` }}>{theme.name}</p>
                        </motion.button>
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
                        <td className="py-3 px-2 font-medium"><span className="mr-2">{u.avatar}</span>{u.name}</td>
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
