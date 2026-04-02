import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
const signs = [
  { sign: 'Овен', emoji: '♈', dates: '29 июня — 28 июля', element: 'Огонь', traits: 'Энергичный, смелый, лидер.', color: 'bg-red-500/10 text-red-500' },
  { sign: 'Телец', emoji: '♉', dates: '29 июля — 28 августа', element: 'Земля', traits: 'Спокойный, ласковый.', color: 'bg-green-500/10 text-green-500' },
  { sign: 'Близнецы', emoji: '♊', dates: '29 августа — 29 сентября', element: 'Воздух', traits: 'Общительный, любопытный.', color: 'bg-yellow-500/10 text-yellow-500' },
  { sign: 'Рак', emoji: '♋', dates: '30 сентября — 30 октября', element: 'Вода', traits: 'Чувствительный, заботливый.', color: 'bg-blue-500/10 text-blue-500' },
  { sign: 'Лев', emoji: '♌', dates: '31 октября — 30 ноября', element: 'Огонь', traits: 'Яркий, артистичный.', color: 'bg-orange-500/10 text-orange-500' },
  { sign: 'Дева', emoji: '♍', dates: '1 декабря — 31 декабря', element: 'Земля', traits: 'Аккуратный, внимательный.', color: 'bg-emerald-500/10 text-emerald-500' },
  { sign: 'Весы', emoji: '♎', dates: '1 января — 31 января', element: 'Воздух', traits: 'Гармоничный, дружелюбный.', color: 'bg-pink-500/10 text-pink-500' },
  { sign: 'Скорпион', emoji: '♏', dates: '1 февраля — 1 марта', element: 'Вода', traits: 'Целеустремлённый, сильный.', color: 'bg-purple-500/10 text-purple-500' },
  { sign: 'Стрелец', emoji: '♐', dates: '2 марта — 30 марта', element: 'Огонь', traits: 'Оптимистичный, весёлый.', color: 'bg-indigo-500/10 text-indigo-500' },
  { sign: 'Козерог', emoji: '♑', dates: '31 марта — 29 апреля', element: 'Земля', traits: 'Ответственный, серьёзный.', color: 'bg-stone-500/10 text-stone-500' },
  { sign: 'Водолей', emoji: '♒', dates: '30 апреля — 28 мая', element: 'Воздух', traits: 'Оригинальный, творческий.', color: 'bg-cyan-500/10 text-cyan-500' },
  { sign: 'Рыбы', emoji: '♓', dates: '29 мая — 28 июня', element: 'Вода', traits: 'Мечтательный, интуитивный.', color: 'bg-teal-500/10 text-teal-500' },
];
const HoroscopePage = () => (
  <div className="p-4 lg:p-6 max-w-4xl mx-auto">
    <h1 className="font-heading text-2xl font-bold mb-2">Гороскоп зачатия</h1><p className="text-sm text-muted-foreground mb-6">Знак зодиака малыша по дате зачатия</p>
    <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" />Все знаки зодиака</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{signs.map(z => <motion.div key={z.sign} whileHover={{ scale: 1.02 }} className="bg-card rounded-2xl p-4 border border-border/50"><div className="flex items-center gap-3 mb-2"><div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${z.color}`}>{z.emoji}</div><div><h3 className="font-semibold text-sm">{z.sign}</h3><p className="text-[10px] text-muted-foreground">{z.element}</p></div></div><p className="text-xs text-muted-foreground mb-1">{z.dates}</p><p className="text-xs">{z.traits}</p></motion.div>)}</div>
  </div>
);
export default HoroscopePage;
