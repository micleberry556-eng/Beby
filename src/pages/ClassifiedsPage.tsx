import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Heart, MessageCircle, Clock, Plus, Image, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Listing {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  price: string;
  city: string;
  category: string;
  image: string;
  imageUrl?: string;
  time: string;
  saved: boolean;
}

const LISTINGS_KEY = 'mamahub_listings';

function getStoredListings(): Listing[] {
  try {
    const stored = localStorage.getItem(LISTINGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  const defaults: Listing[] = [
    { id: 'l1', authorId: 's1', authorName: 'Мария П.', title: 'Коляска Bugaboo Fox 3', description: 'Идеальное состояние', price: '45 000', city: 'Москва', category: 'strollers', image: '🛒', time: '2 часа назад', saved: false },
    { id: 'l2', authorId: 's2', authorName: 'Елена С.', title: 'Комплект одежды 0-3 мес (20 вещей)', description: 'Всё в отличном состоянии', price: '3 500', city: 'Санкт-Петербург', category: 'clothes', image: '👕', time: '4 часа назад', saved: false },
    { id: 'l3', authorId: 's3', authorName: 'Ольга К.', title: 'Кроватка с маятником + матрас', description: 'Почти новая', price: '12 000', city: 'Казань', category: 'furniture', image: '🛏️', time: '5 часов назад', saved: false },
    { id: 'l4', authorId: 's4', authorName: 'Наталья М.', title: 'Набор игрушек Fisher-Price', description: 'Развивающие игрушки', price: '2 800', city: 'Новосибирск', category: 'toys', image: '🧸', time: '6 часов назад', saved: false },
    { id: 'l5', authorId: 's5', authorName: 'Ирина В.', title: 'Молокоотсос Medela Swing Maxi', description: 'Использовался 2 месяца', price: '8 500', city: 'Екатеринбург', category: 'feeding', image: '🍶', time: 'вчера', saved: false },
    { id: 'l6', authorId: 's6', authorName: 'Анна И.', title: 'Подушка для беременных U-образная', description: 'Очень удобная', price: '2 200', city: 'Москва', category: 'maternity', image: '🛋️', time: 'вчера', saved: false },
  ];
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(defaults));
  return defaults;
}

const categories = [
  { id: 'all', label: 'Все', emoji: '📋' },
  { id: 'strollers', label: 'Коляски', emoji: '🍼' },
  { id: 'clothes', label: 'Одежда', emoji: '👶' },
  { id: 'furniture', label: 'Мебель', emoji: '🛏️' },
  { id: 'toys', label: 'Игрушки', emoji: '🧸' },
  { id: 'feeding', label: 'Кормление', emoji: '🍶' },
  { id: 'maternity', label: 'Для мамы', emoji: '👗' },
  { id: 'other', label: 'Другое', emoji: '📦' },
];

const ClassifiedsPage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>(getStoredListings);
  const [q, setQ] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCat, setNewCat] = useState('other');
  const [newImage, setNewImage] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setNewImage(ev.target.result as string); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const createListing = () => {
    if (!user || !newTitle.trim() || !newPrice.trim()) return;
    const listing: Listing = {
      id: 'l-' + Date.now(),
      authorId: user.id,
      authorName: user.name,
      title: newTitle.trim(),
      description: newDesc.trim(),
      price: newPrice.trim(),
      city: newCity.trim() || user.city || 'Не указан',
      category: newCat,
      image: categories.find(c => c.id === newCat)?.emoji || '📦',
      imageUrl: newImage || undefined,
      time: 'только что',
      saved: false,
    };
    const updated = [listing, ...listings];
    setListings(updated);
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(updated));
    setShowCreate(false);
    setNewTitle(''); setNewDesc(''); setNewPrice(''); setNewCity(''); setNewCat('other'); setNewImage(null);
  };

  const toggleSave = (id: string) => {
    const updated = listings.map(l => l.id === id ? { ...l, saved: !l.saved } : l);
    setListings(updated);
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(updated));
  };

  const filtered = listings.filter(l => {
    if (selectedCat !== 'all' && l.category !== selectedCat) return false;
    if (q && !l.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Объявления</h1>
          <p className="text-sm text-muted-foreground">Детские товары от мам</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
          <Plus className="w-4 h-4" /> Подать
        </button>
      </div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-card rounded-2xl p-5 border border-border/50 mb-4 space-y-3">
          <h3 className="font-semibold">Новое объявление</h3>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Название товара" className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none" />
          <div className="flex gap-3">
            <input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Цена, ₽" className="flex-1 px-4 py-2.5 rounded-xl bg-muted text-sm outline-none" />
            <input value={newCity} onChange={e => setNewCity(e.target.value)} placeholder="Город" className="flex-1 px-4 py-2.5 rounded-xl bg-muted text-sm outline-none" />
          </div>
          <select value={newCat} onChange={e => setNewCat(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none">
            {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </select>
          <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Описание..." rows={2} className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm outline-none resize-none" />
          <div className="flex gap-3 items-center">
            <button onClick={() => imgRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm"><Image className="w-4 h-4" /> Фото</button>
            {newImage && <img src={newImage} alt="" className="w-16 h-16 rounded-lg object-cover" />}
            {newImage && <button onClick={() => setNewImage(null)}><X className="w-4 h-4 text-destructive" /></button>}
            <button onClick={createListing} disabled={!newTitle.trim() || !newPrice.trim()} className="ml-auto px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50">Опубликовать</button>
          </div>
        </motion.div>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Поиск товаров..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm outline-none" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium ${selectedCat === cat.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50 text-muted-foreground'}`}>
            <span>{cat.emoji}</span><span>{cat.label}</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-3">Найдено: {filtered.length}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(item => (
          <motion.div key={item.id} whileHover={{ scale: 1.01 }} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="h-32 bg-muted/50 flex items-center justify-center text-5xl overflow-hidden">
              {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : item.image}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold leading-tight line-clamp-2">{item.title}</h3>
                <button onClick={() => toggleSave(item.id)} className="shrink-0">
                  <Heart className={`w-5 h-5 ${item.saved ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                </button>
              </div>
              {item.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{item.description}</p>}
              <p className="text-lg font-bold text-primary mb-2">{item.price} ₽</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" /><span>{item.city}</span><span>·</span><Clock className="w-3 h-3" /><span>{item.time}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                <span className="text-xs text-muted-foreground">{item.authorName}</span>
                <button className="flex items-center gap-1 text-xs text-primary font-medium"><MessageCircle className="w-3.5 h-3.5" /> Написать</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClassifiedsPage;
