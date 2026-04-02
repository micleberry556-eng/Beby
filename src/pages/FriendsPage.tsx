import React, { useState } from 'react';
import { Search, UserPlus, UserCheck, MessageCircle, MapPin, Baby, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface FriendData {
  id: string;
  name: string;
  avatar: string;
  week?: number;
  city: string;
  online: boolean;
  status?: string;
}

const allPeople: FriendData[] = [
  { id: 'f1', name: 'Мария Петрова', avatar: '👩‍🦰', week: 32, city: 'Санкт-Петербург', online: true, status: 'Готовлюсь к встрече с малышом' },
  { id: 'f2', name: 'Елена Сидорова', avatar: '👩‍🦱', week: 18, city: 'Казань', online: true, status: 'Первые шевеления!' },
  { id: 'f3', name: 'Ольга Козлова', avatar: '👱‍♀️', week: 28, city: 'Новосибирск', online: false },
  { id: 'f4', name: 'Наталья Морозова', avatar: '👩‍🦳', week: 12, city: 'Екатеринбург', online: false },
  { id: 'f5', name: 'Ирина Волкова', avatar: '🧑‍🦰', week: 36, city: 'Нижний Новгород', online: true, status: 'Сумка в роддом собрана!' },
  { id: 'f6', name: 'Татьяна Лебедева', avatar: '👩', week: 22, city: 'Москва', online: false },
  { id: 'f7', name: 'Анастасия Новикова', avatar: '👧', week: 8, city: 'Ростов-на-Дону', online: true, status: 'Только узнала!' },
  { id: 'f8', name: 'Дарья Попова', avatar: '👩‍🦰', week: 30, city: 'Самара', online: false },
];

const FriendsPage = () => {
  const { user, addFriend, removeFriend } = useAuth();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<'all' | 'my' | 'find'>('all');

  const myFriendIds = user?.friends || [];
  const myFriends = allPeople.filter(p => myFriendIds.includes(p.id));
  const notFriends = allPeople.filter(p => !myFriendIds.includes(p.id));

  const displayList = tab === 'my' ? myFriends : tab === 'find' ? notFriends : allPeople;
  const filtered = displayList.filter(f =>
    !q || f.name.toLowerCase().includes(q.toLowerCase()) || f.city.toLowerCase().includes(q.toLowerCase())
  );

  const isFriend = (id: string) => myFriendIds.includes(id);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Друзья ({myFriends.length})</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Поиск..." value={q} onChange={e => setQ(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border/50 text-sm outline-none" />
      </div>

      <div className="flex gap-2">
        {[
          { key: 'all' as const, label: 'Все' },
          { key: 'my' as const, label: `Мои друзья (${myFriends.length})` },
          { key: 'find' as const, label: 'Найти друзей' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === t.key ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50 text-muted-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Никого не найдено</p>}
        {filtered.map(f => (
          <div key={f.id} className="bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl">{f.avatar}</div>
              {f.online && <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{f.name}</h3>
              {f.status && <p className="text-xs text-muted-foreground truncate mt-0.5">{f.status}</p>}
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{f.city}</span>
                {f.week && <span className="flex items-center gap-1"><Baby className="w-3 h-3" />{f.week} нед.</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {isFriend(f.id) ? (
                <>
                  <button className="p-2 rounded-xl hover:bg-muted"><MessageCircle className="w-5 h-5 text-primary" /></button>
                  <button onClick={() => removeFriend(f.id)} className="p-2 rounded-xl hover:bg-destructive/10" title="Удалить из друзей"><X className="w-5 h-5 text-destructive" /></button>
                </>
              ) : (
                <button onClick={() => addFriend(f.id)} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5" /> Добавить
                </button>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default FriendsPage;
