import React from 'react';
import { currentUser, mockPosts } from '@/data/mockData';
import { MapPin, Calendar, Users, Edit3 } from 'lucide-react';
const ProfilePage = () => (
  <div className="p-4 lg:p-6 space-y-6">
    <div className="bg-card rounded-3xl overflow-hidden border border-border/50">
      <div className="h-32 sm:h-44 relative"><div className="absolute inset-0 gradient-primary" /></div>
      <div className="px-5 pb-5 -mt-12 sm:-mt-16"><div className="flex items-end gap-4">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-card border-4 border-card flex items-center justify-center text-5xl shadow-md">{currentUser.avatar}</div>
        <div className="flex-1 pb-2"><div className="flex items-center justify-between flex-wrap gap-2"><div><h1 className="font-heading text-xl sm:text-2xl font-bold">{currentUser.name}</h1><p className="text-sm text-muted-foreground">{currentUser.status}</p></div><button className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold flex items-center gap-2"><Edit3 className="w-4 h-4" /> Редактировать</button></div></div>
      </div>
      <div className="flex items-center gap-4 mt-4 flex-wrap text-sm text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {currentUser.city}</span><span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {currentUser.week} неделя</span><span className="flex items-center gap-1"><Users className="w-4 h-4" /> {currentUser.friends} друзей</span></div>
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">{[{ label: 'Публикации', value: '28' }, { label: 'Подписчики', value: '156' }, { label: 'Подписки', value: '89' }].map(s => <div key={s.label} className="bg-muted/50 rounded-xl py-3"><div className="text-xl font-bold text-gradient">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>)}</div>
      </div>
    </div>
    <div><h2 className="font-heading text-xl font-semibold mb-4">Мои публикации</h2><div className="space-y-4">{mockPosts.slice(0, 3).map(p => <div key={p.id} className="bg-card rounded-2xl p-4 border border-border/50"><p className="text-sm">{p.content}</p><p className="text-xs text-muted-foreground mt-2">{p.timestamp}</p></div>)}</div></div>
  </div>
);
export default ProfilePage;
