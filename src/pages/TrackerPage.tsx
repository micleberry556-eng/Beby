import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Ruler } from 'lucide-react';
const weekData: Record<number, { size: string; emoji: string; weight: string; length: string; desc: string; tips: string[] }> = {
  4: { size: 'Маковое зёрнышко', emoji: '🌰', weight: '< 1 г', length: '1 мм', desc: 'Эмбрион имплантируется в стенку матки.', tips: ['Начните приём фолиевой кислоты'] },
  12: { size: 'Лайм', emoji: '🍋', weight: '14 г', length: '5.4 см', desc: 'Все органы сформированы!', tips: ['Пройдите первый скрининг'] },
  20: { size: 'Банан', emoji: '🍌', weight: '300 г', length: '25 см', desc: 'Экватор беременности!', tips: ['Пройдите второй скрининг'] },
  24: { size: 'Початок кукурузы', emoji: '🌽', weight: '600 г', length: '30 см', desc: 'Малыш слышит ваш голос!', tips: ['Слушайте музыку для малыша'] },
  28: { size: 'Баклажан', emoji: '🍆', weight: '1 кг', length: '37 см', desc: 'Малыш может моргать!', tips: ['Начните собирать сумку в роддом'] },
  32: { size: 'Дыня', emoji: '🍈', weight: '1.7 кг', length: '42 см', desc: 'Малыш набирает вес.', tips: ['Определитесь с роддомом'] },
  36: { size: 'Арбуз', emoji: '🍉', weight: '2.6 кг', length: '47 см', desc: 'Малыш принимает позу для родов.', tips: ['Сумка должна быть собрана'] },
  40: { size: 'Тыква', emoji: '🎃', weight: '3.4 кг', length: '51 см', desc: 'Малыш готов к рождению!', tips: ['Будьте готовы к поездке в роддом'] },
};
const allWeeks = Object.keys(weekData).map(Number);
const TrackerPage = () => {
  const [sel, setSel] = useState(24);
  const d = weekData[sel];
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-2">Трекер беременности</h1><p className="text-sm text-muted-foreground mb-6">Развитие малыша по неделям</p>
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-6">{Array.from({ length: 40 }, (_, i) => i + 1).map(wk => { const has = allWeeks.includes(wk); const near = allWeeks.reduce((p, c) => Math.abs(c - wk) < Math.abs(p - wk) ? c : p); return <button key={wk} onClick={() => setSel(has ? wk : near)} className={`shrink-0 w-10 h-10 rounded-full text-xs font-bold transition-all ${sel === wk ? 'bg-primary text-primary-foreground shadow-glow' : has ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{wk}</button>; })}</div>
      {d && <motion.div key={sel} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="bg-card rounded-2xl p-6 border border-border/50 text-center"><div className="text-6xl mb-3">{d.emoji}</div><h2 className="font-heading text-xl font-bold">Неделя {sel}</h2><p className="text-primary font-semibold mt-1">{d.size}</p><div className="flex justify-center gap-6 mt-4"><div className="text-center"><Scale className="w-5 h-5 text-muted-foreground mx-auto mb-1" /><p className="text-sm font-bold">{d.weight}</p><p className="text-[10px] text-muted-foreground">Вес</p></div><div className="text-center"><Ruler className="w-5 h-5 text-muted-foreground mx-auto mb-1" /><p className="text-sm font-bold">{d.length}</p><p className="text-[10px] text-muted-foreground">Длина</p></div></div></div>
        <div className="bg-card rounded-2xl p-5 border border-border/50"><h3 className="font-semibold mb-2">Что происходит</h3><p className="text-sm text-muted-foreground">{d.desc}</p></div>
        <div className="bg-card rounded-2xl p-5 border border-border/50"><h3 className="font-semibold mb-3">Советы</h3><ul className="space-y-2">{d.tips.map((t, i) => <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="text-primary mt-0.5">•</span>{t}</li>)}</ul></div>
      </motion.div>}
    </div>
  );
};
export default TrackerPage;
