import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
const videos = [
  { id: '1', author: 'Мария Петрова', avatar: '👩‍🦰', desc: 'Утренняя йога для беременных', likes: 4200, comments: 186, emoji: '🧘‍♀️', gradient: 'from-violet-600 via-purple-500 to-fuchsia-500' },
  { id: '2', author: 'Елена Сидорова', avatar: '👩‍🦱', desc: 'Реакция мужа на УЗИ', likes: 15800, comments: 923, emoji: '😂', gradient: 'from-rose-500 via-pink-500 to-red-400' },
  { id: '3', author: 'Ольга Козлова', avatar: '👱‍♀️', desc: 'Собираю сумку в роддом!', likes: 8900, comments: 445, emoji: '🎒', gradient: 'from-emerald-500 via-teal-500 to-cyan-500' },
  { id: '4', author: 'Наталья Морозова', avatar: '👩‍🦳', desc: 'Полезные перекусы для беременных', likes: 3400, comments: 156, emoji: '🥗', gradient: 'from-amber-500 via-orange-500 to-yellow-500' },
];
const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
const VideosPage = () => (
  <div className="p-4 lg:p-6"><h1 className="font-heading text-2xl font-bold mb-4">Клипы</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{videos.map(v => <motion.div key={v.id} whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden border border-border/50">
      <div className={`h-64 bg-gradient-to-br ${v.gradient} flex items-center justify-center relative`}><span className="text-7xl">{v.emoji}</span><div className="absolute bottom-3 left-3 right-3"><div className="flex items-center gap-2 mb-1"><div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">{v.avatar}</div><span className="text-white text-sm font-bold">{v.author}</span></div><p className="text-white text-xs">{v.desc}</p></div></div>
      <div className="p-3 bg-card flex items-center gap-4"><button className="flex items-center gap-1 text-xs text-muted-foreground"><Heart className="w-4 h-4" /> {fmt(v.likes)}</button><button className="flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle className="w-4 h-4" /> {fmt(v.comments)}</button><button className="flex items-center gap-1 text-xs text-muted-foreground"><Share2 className="w-4 h-4" /> Поделиться</button><button className="ml-auto text-muted-foreground"><Bookmark className="w-4 h-4" /></button></div>
    </motion.div>)}</div>
  </div>
);
export default VideosPage;
