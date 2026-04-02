import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Heart, MessageCircle, Clock, Plus } from 'lucide-react';
const listings = [
  { id: '1', title: 'Коляска Bugaboo Fox 3', price: '45 000', city: 'Москва', author: 'Мария П.', time: '2 часа назад', image: '🛒', saved: false },
  { id: '2', title: 'Комплект одежды 0-3 мес', price: '3 500', city: 'Санкт-Петербург', author: 'Елена С.', time: '4 часа назад', image: '👕', saved: true },
  { id: '3', title: 'Кроватка с маятником', price: '12 000', city: 'Казань', author: 'Ольга К.', time: '5 часов назад', image: '🛏️', saved: false },
  { id: '4', title: 'Набор игрушек Fisher-Price', price: '2 800', city: 'Новосибирск', author: 'Наталья М.', time: '6 часов назад', image: '🧸', saved: false },
  { id: '5', title: 'Молокоотсос Medela', price: '8 500', city: 'Екатеринбург', author: 'Ирина В.', time: 'вчера', image: '🍶', saved: true },
  { id: '6', title: 'Подушка для беременных', price: '2 200', city: 'Москва', author: 'Анна И.', time: 'вчера', image: '🛋️', saved: false },
];
const ClassifiedsPage = () => {
  const [q, setQ] = useState('');
  const [items, setItems] = useState(listings);
  const filtered = items.filter(l => !q || l.title.toLowerCase().includes(q.toLowerCase()));
  const toggleSave = (id: string) => setItems(prev => prev.map(l => l.id === id ? { ...l, saved: !l.saved } : l));
  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4"><div><h1 className="font-heading text-2xl font-bold">Объявления</h1><p className="text-sm text-muted-foreground">Детские товары от мам</p></div><button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"><Plus className="w-4 h-4" /> Подать</button></div>
      <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Поиск товаров..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm outline-none" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{filtered.map(item => <motion.div key={item.id} whileHover={{ scale: 1.01 }} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="h-32 bg-muted/50 flex items-center justify-center text-5xl">{item.image}</div>
        <div className="p-4"><div className="flex items-start justify-between gap-2 mb-2"><h3 className="text-sm font-semibold leading-tight line-clamp-2">{item.title}</h3><button onClick={() => toggleSave(item.id)}><Heart className={`w-5 h-5 ${item.saved ? 'fill-primary text-primary' : 'text-muted-foreground'}`} /></button></div>
          <p className="text-lg font-bold text-primary mb-2">{item.price} ₽</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="w-3 h-3" /><span>{item.city}</span><span>·</span><Clock className="w-3 h-3" /><span>{item.time}</span></div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30"><span className="text-xs text-muted-foreground">{item.author}</span><button className="flex items-center gap-1 text-xs text-primary font-medium"><MessageCircle className="w-3.5 h-3.5" /> Написать</button></div>
        </div>
      </motion.div>)}</div>
    </div>
  );
};
export default ClassifiedsPage;
