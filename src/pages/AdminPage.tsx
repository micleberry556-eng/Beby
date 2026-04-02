import React, { useState } from 'react';
import { themePresets, useTheme } from '@/contexts/ThemeContext';
import { Settings, Palette, Users, BarChart3, FileText, Shield, ChevronRight, Globe, Music, MessageSquare, Check } from 'lucide-react';
import { motion } from 'framer-motion';
const sections = [
  { id: 'themes', label: 'Темы оформления', icon: Palette, count: themePresets.length },
  { id: 'users', label: 'Пользователи', icon: Users, count: 1250 },
  { id: 'content', label: 'Контент', icon: FileText, count: 3400 },
  { id: 'stats', label: 'Статистика', icon: BarChart3 },
  { id: 'moderation', label: 'Модерация', icon: Shield, count: 12 },
  { id: 'settings', label: 'Настройки', icon: Settings },
];
const AdminPage = () => {
  const { currentTheme, setTheme } = useTheme();
  const [active, setActive] = useState('themes');
  const categories = [...new Set(themePresets.map(t => t.category))];
  return (
    <div className="p-4 lg:p-6"><h1 className="font-heading text-2xl font-bold mb-6">Админ-панель</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1"><div className="bg-card rounded-2xl border border-border/50 overflow-hidden">{sections.map(s => <button key={s.id} onClick={() => setActive(s.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${active === s.id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted/50'}`}><s.icon className="w-4 h-4 shrink-0" /><span className="flex-1 text-left">{s.label}</span>{s.count && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{s.count}</span>}<ChevronRight className="w-3.5 h-3.5" /></button>)}</div>
          <div className="bg-card rounded-2xl p-4 border border-border/50 mt-4 space-y-3"><h3 className="text-sm font-semibold">Статистика</h3>{[{ l: 'Онлайн', v: '347', i: Globe }, { l: 'Новых', v: '24', i: Users }, { l: 'Сообщений', v: '1.2K', i: MessageSquare }, { l: 'Треков', v: '156', i: Music }].map(s => <div key={s.l} className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><s.i className="w-4 h-4 text-primary" /></div><div className="flex-1"><p className="text-xs text-muted-foreground">{s.l}</p><p className="text-sm font-bold">{s.v}</p></div></div>)}</div>
        </div>
        <div className="lg:col-span-3">
          {active === 'themes' && <div className="space-y-6"><div className="bg-card rounded-2xl p-5 border border-border/50"><h2 className="font-heading text-xl font-semibold mb-2">Темы оформления</h2><p className="text-sm text-muted-foreground">Текущая: <span className="text-primary font-semibold">{currentTheme.name}</span></p></div>
            {categories.map(cat => <div key={cat}><h3 className="font-semibold text-base mb-3">{cat}</h3><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">{themePresets.filter(t => t.category === cat).map(theme => { const a = currentTheme.id === theme.id; return <motion.button key={theme.id} whileHover={{ scale: 1.03 }} onClick={() => setTheme(theme.id)} className={`relative rounded-xl p-3 border-2 text-left ${a ? 'border-primary shadow-glow' : 'border-border/50 hover:border-border'}`} style={{ background: `hsl(${theme.colors.card})` }}>{a && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-primary-foreground" /></div>}<div className="flex gap-1.5 mb-2"><div className="w-6 h-6 rounded-full" style={{ background: `hsl(${theme.colors.primary})` }} /><div className="w-6 h-6 rounded-full" style={{ background: `hsl(${theme.colors.accent})` }} /><div className="w-6 h-6 rounded-full" style={{ background: `hsl(${theme.colors.muted})` }} /></div><p className="text-xs font-semibold truncate" style={{ color: `hsl(${theme.colors.foreground})` }}>{theme.name}</p></motion.button>; })}</div></div>)}
          </div>}
          {active === 'stats' && <div className="bg-card rounded-2xl p-5 border border-border/50"><h2 className="font-heading text-xl font-semibold mb-4">Аналитика</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[{ l: 'Посещения', v: '2,847', c: '+12%' }, { l: 'Регистрации', v: '156', c: '+8%' }, { l: 'Активные', v: '1,250', c: '+5%' }, { l: 'Музыка', v: '4,320', c: '+23%' }].map(s => <div key={s.l} className="bg-muted/30 rounded-xl p-4"><p className="text-xs text-muted-foreground">{s.l}</p><div className="flex items-end gap-2 mt-1"><span className="text-2xl font-bold">{s.v}</span><span className="text-xs text-green-500 font-medium">{s.c}</span></div></div>)}</div></div>}
          {active !== 'themes' && active !== 'stats' && <div className="bg-card rounded-2xl p-5 border border-border/50"><h2 className="font-heading text-xl font-semibold mb-4">{sections.find(s => s.id === active)?.label}</h2><p className="text-sm text-muted-foreground">Раздел в разработке</p></div>}
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
