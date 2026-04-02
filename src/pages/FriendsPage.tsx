import React, { useState } from 'react';
import { Search, UserPlus, MessageCircle, MapPin, Baby } from 'lucide-react';
import { motion } from 'framer-motion';
const friends = [
  { id: '1', name: 'Мария Петрова', avatar: '👩‍🦰', week: 32, city: 'Санкт-Петербург', online: true, status: 'Готовлюсь к встрече с малышом' },
  { id: '2', name: 'Елена Сидорова', avatar: '👩‍🦱', week: 18, city: 'Казань', online: true, status: 'Первые шевеления!' },
  { id: '3', name: 'Ольга Козлова', avatar: '👱‍♀️', week: 28, city: 'Новосибирск', online: false },
  { id: '4', name: 'Наталья Морозова', avatar: '👩‍🦳', week: 12, city: 'Екатеринбург', online: false },
  { id: '5', name: 'Ирина Волкова', avatar: '🧑‍🦰', week: 36, city: 'Нижний Новгород', online: true, status: 'Сумка в роддом собрана!' },
];
const FriendsPage = () => {
  const [q, setQ] = useState('');
  const filtered = friends.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between"><h1 className="font-heading text-2xl font-bold">Друзья</h1><button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"><UserPlus className="w-4 h-4" /> Найти друзей</button></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" placeholder="Поиск друзей..." value={q} onChange={e => setQ(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border/50 text-sm outline-none" /></div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        {filtered.map(f => <div key={f.id} className="bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-3">
          <div className="relative shrink-0"><div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl">{f.avatar}</div>{f.online && <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />}</div>
          <div className="flex-1 min-w-0"><h3 className="font-semibold text-sm truncate">{f.name}</h3>{f.status && <p className="text-xs text-muted-foreground truncate mt-0.5">{f.status}</p>}<div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{f.city}</span>{f.week && <span className="flex items-center gap-1"><Baby className="w-3 h-3" />{f.week} нед.</span>}</div></div>
          <button className="p-2 rounded-xl hover:bg-muted"><MessageCircle className="w-5 h-5 text-primary" /></button>
        </div>)}
      </motion.div>
    </div>
  );
};
export default FriendsPage;
