import React, { useState, useRef } from 'react';
import { Users, Plus, Search, X, Image, LogIn, LogOut, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

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
    { id: 'g1', name: 'Первый триместр', description: '1-12 недель беременности', icon: '🌱', members: ['seed-1', 'seed-2'], creatorId: 'seed-1', messages: [] },
    { id: 'g2', name: 'Второй триместр', description: '13-26 недель', icon: '🌸', members: ['seed-2', 'seed-3'], creatorId: 'seed-2', messages: [] },
    { id: 'g3', name: 'Третий триместр', description: '27-40 недель', icon: '🌺', members: ['seed-3'], creatorId: 'seed-3', messages: [] },
    { id: 'g4', name: 'Подготовка к родам', description: 'Всё о родах', icon: '🏥', members: ['seed-1', 'seed-4'], creatorId: 'seed-4', messages: [] },
    { id: 'g5', name: 'Питание мамы', description: 'Здоровое питание', icon: '🥗', members: ['seed-5'], creatorId: 'seed-5', messages: [] },
    { id: 'g6', name: 'Йога для беременных', description: 'Упражнения и растяжка', icon: '🧘', members: [], creatorId: 'seed-1', messages: [] },
    { id: 'g7', name: 'Имена для малышей', description: 'Выбираем имя вместе', icon: '📝', members: [], creatorId: 'seed-2', messages: [] },
    { id: 'g8', name: 'После родов', description: 'Первые месяцы с малышом', icon: '👶', members: [], creatorId: 'seed-3', messages: [] },
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
  const [newIcon, setNewIcon] = useState('💬');
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
    setNewName(''); setNewDesc(''); setNewIcon('💬'); setNewImage(null);
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
  const iconOptions = ['💬', '🌱', '🌸', '🌺', '🏥', '🥗', '🧘', '📝', '👶', '🎵', '📚', '🎨', '💪', '🧸', '🍼', '❤️'];

  // Group chat view
  if (openGroup && user) {
    const isMember = openGroup.members.includes(user.id);
    return (
      <div className="p-4 lg:p-6 flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setOpenGroupId(null)} className="p-2 rounded-xl hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
            {openGroup.imageUrl ? <img src={openGroup.imageUrl} alt="" className="w-full h-full rounded-xl object-cover" /> : openGroup.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm truncate">{openGroup.name}</h2>
            <p className="text-xs text-muted-foreground">{openGroup.members.length} участниц</p>
          </div>
          <button
            onClick={() => toggleJoin(openGroup.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${isMember ? 'bg-destructive/10 text-destructive' : 'bg-primary text-primary-foreground'}`}
          >
            {isMember ? <><LogOut className="w-3.5 h-3.5" /> Выйти</> : <><LogIn className="w-3.5 h-3.5" /> Вступить</>}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 bg-card rounded-2xl p-4 border border-border/50">
          {openGroup.messages.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">Пока нет сообщений. Начните общение!</p>
          )}
          {openGroup.messages.map(msg => (
            <div key={msg.id} className={`flex gap-2 ${msg.authorId === user.id ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm shrink-0">{msg.authorAvatar}</div>
              <div className={`max-w-[70%] px-3 py-2 rounded-2xl ${msg.authorId === user.id ? 'gradient-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md'}`}>
                {msg.authorId !== user.id && <p className="text-[10px] font-semibold mb-0.5">{msg.authorName}</p>}
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-0.5 ${msg.authorId === user.id ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        {isMember ? (
          <div className="flex items-center gap-2">
            <input
              value={chatText}
              onChange={e => setChatText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendGroupMessage()}
              placeholder="Написать в группу..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={sendGroupMessage} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center py-3 bg-muted/50 rounded-xl text-sm text-muted-foreground">
            Вступите в группу, чтобы писать сообщения
          </div>
        )}
      </div>
    );
  }

  // Groups list view
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Группы</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Создать
        </button>
      </div>

      {/* Create group form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-card rounded-2xl p-5 border border-border/50 space-y-3 overflow-hidden">
            <h3 className="font-semibold">Новая группа</h3>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Название группы" className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none" />
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Описание..." rows={2} className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none resize-none" />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Иконка группы:</p>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map(ic => (
                  <button key={ic} onClick={() => setNewIcon(ic)} className={`text-2xl p-1.5 rounded-lg ${newIcon === ic ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'}`}>{ic}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button onClick={() => imgRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm"><Image className="w-4 h-4" /> Обложка</button>
              {newImage && <img src={newImage} alt="" className="w-12 h-12 rounded-lg object-cover" />}
              {newImage && <button onClick={() => setNewImage(null)}><X className="w-4 h-4 text-destructive" /></button>}
            </div>
            <div className="flex gap-2">
              <button onClick={createGroup} disabled={!newName.trim()} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">Создать</button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl bg-muted text-sm">Отмена</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Найти группу..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/50 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((g, i) => {
          const isMember = user ? g.members.includes(user.id) : false;
          return (
            <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-2xl border border-border/50 hover:shadow-md transition-shadow overflow-hidden">
              {/* Clickable area to open group */}
              <div className="p-5 cursor-pointer" onClick={() => setOpenGroupId(g.id)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl overflow-hidden shrink-0">
                    {g.imageUrl ? <img src={g.imageUrl} alt="" className="w-full h-full object-cover" /> : g.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{g.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{g.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{g.members.length} участниц</span>
                  </div>
                  {g.messages.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{g.messages.length}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Join/Leave button */}
              <div className="px-5 pb-4">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleJoin(g.id); }}
                  className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${isMember ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                >
                  {isMember ? 'Выйти из группы' : 'Вступить'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupsPage;
