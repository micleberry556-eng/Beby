import React, { useState, useRef } from 'react';
import {
  Users, Plus, Search, X, Image, LogIn, LogOut, MessageCircle, Send,
  Sprout, Flower2, Cherry, Hospital, Salad, Dumbbell, PenLine, Baby,
  Music, BookOpen, Palette, Heart, Sparkles, ShoppingBag, Star,
  ArrowLeft, ImagePlus, Hash,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/UserAvatar';

/**
 * Map of group icon IDs to Lucide icon components and gradient colors.
 * Replaces the old emoji-based icons with modern styled icons.
 */
const groupIconMap: Record<string, { icon: React.FC<{ className?: string }>; gradient: string }> = {
  sprout:    { icon: Sprout,      gradient: 'from-emerald-400 to-green-500' },
  flower:    { icon: Flower2,     gradient: 'from-pink-400 to-rose-500' },
  cherry:    { icon: Cherry,      gradient: 'from-red-400 to-pink-500' },
  hospital:  { icon: Hospital,    gradient: 'from-blue-400 to-cyan-500' },
  salad:     { icon: Salad,       gradient: 'from-lime-400 to-emerald-500' },
  fitness:   { icon: Dumbbell,    gradient: 'from-orange-400 to-amber-500' },
  pen:       { icon: PenLine,     gradient: 'from-violet-400 to-purple-500' },
  baby:      { icon: Baby,        gradient: 'from-sky-400 to-blue-500' },
  music:     { icon: Music,       gradient: 'from-fuchsia-400 to-pink-500' },
  book:      { icon: BookOpen,    gradient: 'from-amber-400 to-yellow-500' },
  palette:   { icon: Palette,     gradient: 'from-indigo-400 to-violet-500' },
  heart:     { icon: Heart,       gradient: 'from-rose-400 to-red-500' },
  sparkles:  { icon: Sparkles,    gradient: 'from-yellow-400 to-orange-500' },
  shopping:  { icon: ShoppingBag, gradient: 'from-teal-400 to-cyan-500' },
  star:      { icon: Star,        gradient: 'from-amber-400 to-orange-500' },
  chat:      { icon: MessageCircle, gradient: 'from-blue-400 to-indigo-500' },
};

const iconOptionKeys = Object.keys(groupIconMap);

/** Fallback: map old emoji icons to new icon keys */
function resolveIconKey(icon: string): string {
  const emojiMap: Record<string, string> = {
    '💬': 'chat', '🌱': 'sprout', '🌸': 'flower', '🌺': 'cherry',
    '🏥': 'hospital', '🥗': 'salad', '🧘': 'fitness', '📝': 'pen',
    '👶': 'baby', '🎵': 'music', '📚': 'book', '🎨': 'palette',
    '💪': 'fitness', '🧸': 'baby', '🍼': 'baby', '❤️': 'heart',
  };
  if (groupIconMap[icon]) return icon;
  return emojiMap[icon] || 'chat';
}

/** Renders a group icon with gradient background */
const GroupIcon = ({ iconKey, size = 48, imageUrl }: { iconKey: string; size?: number; imageUrl?: string }) => {
  if (imageUrl) {
    const radius = size <= 36 ? '0.5rem' : size <= 48 ? '0.75rem' : '1rem';
    return (
      <div className="shrink-0 overflow-hidden" style={{ width: size, height: size, borderRadius: radius }}>
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }
  const resolved = resolveIconKey(iconKey);
  const entry = groupIconMap[resolved] || groupIconMap.chat;
  const IconComp = entry.icon;
  const iconSize = Math.round(size * 0.45);
  const radius = size <= 36 ? '0.5rem' : size <= 48 ? '0.75rem' : '1rem';

  return (
    <div
      className={`shrink-0 bg-gradient-to-br ${entry.gradient} flex items-center justify-center shadow-sm`}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <IconComp className="text-white" style={{ width: iconSize, height: iconSize }} />
    </div>
  );
};

interface GroupData {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  members: string[];
  creatorId: string;
  messages: GroupMessage[];
}

interface GroupMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

const GROUPS_KEY = 'mamahub_groups';

function getStoredGroups(): GroupData[] {
  try {
    const stored = localStorage.getItem(GROUPS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  const defaults: GroupData[] = [
    { id: 'g1', name: 'Первый триместр', description: '1-12 недель беременности', icon: 'sprout', members: ['seed-1', 'seed-2'], creatorId: 'seed-1', messages: [] },
    { id: 'g2', name: 'Второй триместр', description: '13-26 недель', icon: 'flower', members: ['seed-2', 'seed-3'], creatorId: 'seed-2', messages: [] },
    { id: 'g3', name: 'Третий триместр', description: '27-40 недель', icon: 'cherry', members: ['seed-3'], creatorId: 'seed-3', messages: [] },
    { id: 'g4', name: 'Подготовка к родам', description: 'Всё о родах', icon: 'hospital', members: ['seed-1', 'seed-4'], creatorId: 'seed-4', messages: [] },
    { id: 'g5', name: 'Питание мамы', description: 'Здоровое питание', icon: 'salad', members: ['seed-5'], creatorId: 'seed-5', messages: [] },
    { id: 'g6', name: 'Йога для беременных', description: 'Упражнения и растяжка', icon: 'fitness', members: [], creatorId: 'seed-1', messages: [] },
    { id: 'g7', name: 'Имена для малышей', description: 'Выбираем имя вместе', icon: 'pen', members: [], creatorId: 'seed-2', messages: [] },
    { id: 'g8', name: 'После родов', description: 'Первые месяцы с малышом', icon: 'baby', members: [], creatorId: 'seed-3', messages: [] },
  ];
  localStorage.setItem(GROUPS_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveGroups(groups: GroupData[]) {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

const GroupsPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupData[]>(getStoredGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState('chat');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [chatText, setChatText] = useState('');
  const imgRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setNewImage(ev.target.result as string); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const createGroup = () => {
    if (!user || !newName.trim()) return;
    const group: GroupData = {
      id: 'g-' + Date.now(),
      name: newName.trim(),
      description: newDesc.trim(),
      icon: newIcon,
      imageUrl: newImage || undefined,
      members: [user.id],
      creatorId: user.id,
      messages: [],
    };
    const updated = [group, ...groups];
    setGroups(updated);
    saveGroups(updated);
    setShowCreate(false);
    setNewName(''); setNewDesc(''); setNewIcon('chat'); setNewImage(null);
  };

  const toggleJoin = (groupId: string) => {
    if (!user) return;
    const updated = groups.map(g => {
      if (g.id !== groupId) return g;
      const isMember = g.members.includes(user.id);
      return { ...g, members: isMember ? g.members.filter(id => id !== user.id) : [...g.members, user.id] };
    });
    setGroups(updated);
    saveGroups(updated);
  };

  const sendGroupMessage = () => {
    if (!user || !chatText.trim() || !openGroupId) return;
    const msg: GroupMessage = {
      id: 'gm-' + Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      text: chatText.trim(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = groups.map(g =>
      g.id === openGroupId ? { ...g, messages: [...g.messages, msg] } : g
    );
    setGroups(updated);
    saveGroups(updated);
    setChatText('');
  };

  const filtered = groups.filter(g =>
    !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openGroup = groups.find(g => g.id === openGroupId);

  // ── Group Chat View ──────────────────────────────────────────
  if (openGroup && user) {
    const isMember = openGroup.members.includes(user.id);
    return (
      <div className="p-4 lg:p-6 flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)]">
        {/* Chat header */}
        <div className="bg-card rounded-2xl border border-border/50 p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpenGroupId(null)} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <GroupIcon iconKey={openGroup.icon} size={44} imageUrl={openGroup.imageUrl} />
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-semibold text-base truncate">{openGroup.name}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" /> {openGroup.members.length} участниц
                {openGroup.messages.length > 0 && (
                  <><span className="mx-1 opacity-30">|</span><MessageCircle className="w-3 h-3" /> {openGroup.messages.length} сообщений</>
                )}
              </p>
            </div>
            <button
              onClick={() => toggleJoin(openGroup.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isMember
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  : 'gradient-primary text-white shadow-sm'
              }`}
            >
              {isMember ? <><LogOut className="w-3.5 h-3.5" /> Выйти</> : <><LogIn className="w-3.5 h-3.5" /> Вступить</>}
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
          {openGroup.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">Пока нет сообщений</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Начните общение первыми!</p>
            </div>
          )}
          {openGroup.messages.map(msg => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.authorId === user.id ? 'flex-row-reverse' : ''}`}>
              <UserAvatar name={msg.authorName} size={32} />
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                msg.authorId === user.id
                  ? 'gradient-primary text-white rounded-br-md shadow-sm'
                  : 'bg-muted/60 rounded-bl-md'
              }`}>
                {msg.authorId !== user.id && (
                  <p className="text-[10px] font-bold mb-0.5 opacity-70">{msg.authorName}</p>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.authorId === user.id ? 'text-white/50' : 'text-muted-foreground'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat input */}
        {isMember ? (
          <div className="flex items-center gap-2">
            <input
              value={chatText}
              onChange={e => setChatText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendGroupMessage()}
              placeholder="Написать в группу..."
              className="flex-1 px-4 py-3 rounded-2xl bg-card border border-border/50 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
            <button
              onClick={sendGroupMessage}
              className="w-11 h-11 rounded-xl gradient-primary text-white flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center py-4 bg-muted/40 rounded-2xl text-sm text-muted-foreground border border-border/30">
            Вступите в группу, чтобы писать сообщения
          </div>
        )}
      </div>
    );
  }

  // ── Groups List View ─────────────────────────────────────────
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Группы</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{groups.length} сообществ</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Создать
        </button>
      </div>

      {/* Create group form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-semibold text-lg">Новая группа</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Название</label>
                  <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Название группы"
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Описание</label>
                  <input
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Краткое описание"
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Иконка группы</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptionKeys.map(key => {
                    const entry = groupIconMap[key];
                    const IconComp = entry.icon;
                    const isSelected = newIcon === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setNewIcon(key)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isSelected
                            ? `bg-gradient-to-br ${entry.gradient} ring-2 ring-primary shadow-md scale-110`
                            : 'bg-muted/60 hover:bg-muted border border-border/30'
                        }`}
                      >
                        <IconComp className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <button
                  onClick={() => imgRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/60 border border-border/30 text-sm hover:bg-muted transition-colors"
                >
                  <ImagePlus className="w-4 h-4" /> Обложка
                </button>
                {newImage && (
                  <>
                    <img src={newImage} alt="" className="w-11 h-11 rounded-xl object-cover border border-border/30" />
                    <button onClick={() => setNewImage(null)} className="p-1.5 rounded-lg hover:bg-destructive/10">
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={createGroup}
                  disabled={!newName.trim()}
                  className="px-6 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  Создать группу
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-5 py-2.5 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Найти группу..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border/50 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
        />
      </div>

      {/* Groups grid */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">
          Группы не найдены. Попробуйте другой запрос.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((g, i) => {
          const isMember = user ? g.members.includes(user.id) : false;
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <div className="bg-card rounded-2xl border border-border/50 hover:shadow-lg hover:border-border/80 transition-all overflow-hidden group">
                {/* Card content — clickable */}
                <div className="p-5 cursor-pointer" onClick={() => setOpenGroupId(g.id)}>
                  <div className="flex items-start gap-3.5 mb-4">
                    <GroupIcon iconKey={g.icon} size={52} imageUrl={g.imageUrl} />
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="font-heading font-semibold text-base truncate group-hover:text-primary transition-colors">
                        {g.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">{g.description}</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {g.members.length} участниц
                    </span>
                    {g.messages.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {g.messages.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <div className="px-5 pb-5">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleJoin(g.id); }}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isMember
                        ? 'bg-destructive/10 text-destructive hover:bg-destructive/15'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {isMember ? 'Выйти из группы' : 'Вступить'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupsPage;
