import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
export interface ThemePreset { id: string; name: string; category: string; colors: { primary: string; accent: string; background: string; foreground: string; card: string; muted: string; }; }
export const themePresets: ThemePreset[] = [
  // ── Нежные (Soft) ──────────────────────────────────────────────
  { id: 'rose-dawn', name: 'Розовый рассвет', category: 'Нежные', colors: { primary: '340 65% 55%', accent: '24 80% 60%', background: '30 30% 98%', foreground: '240 10% 10%', card: '30 25% 97%', muted: '30 20% 94%' }},
  { id: 'lavender-mist', name: 'Лавандовый туман', category: 'Нежные', colors: { primary: '270 50% 60%', accent: '300 40% 65%', background: '270 20% 98%', foreground: '270 15% 10%', card: '270 20% 97%', muted: '270 15% 94%' }},
  { id: 'mint-fresh', name: 'Мятная свежесть', category: 'Нежные', colors: { primary: '160 50% 45%', accent: '140 45% 55%', background: '150 20% 97%', foreground: '160 15% 10%', card: '150 18% 96%', muted: '150 15% 93%' }},
  { id: 'peach-blossom', name: 'Персиковый цвет', category: 'Нежные', colors: { primary: '18 75% 62%', accent: '35 80% 65%', background: '25 35% 97%', foreground: '20 12% 12%', card: '25 30% 96%', muted: '25 22% 93%' }},
  { id: 'baby-blue', name: 'Нежно-голубой', category: 'Нежные', colors: { primary: '205 65% 60%', accent: '190 55% 58%', background: '205 25% 97%', foreground: '210 15% 10%', card: '205 22% 96%', muted: '205 18% 93%' }},
  { id: 'cotton-candy', name: 'Сахарная вата', category: 'Нежные', colors: { primary: '320 55% 65%', accent: '280 45% 68%', background: '310 25% 97%', foreground: '320 12% 12%', card: '310 22% 96%', muted: '310 18% 93%' }},

  // ── Тёплые (Warm) ─────────────────────────────────────────────
  { id: 'coral-sunset', name: 'Коралловый закат', category: 'Тёплые', colors: { primary: '5 70% 58%', accent: '25 85% 55%', background: '15 30% 97%', foreground: '10 15% 10%', card: '15 25% 96%', muted: '15 18% 93%' }},
  { id: 'golden-honey', name: 'Золотой мёд', category: 'Тёплые', colors: { primary: '40 80% 50%', accent: '30 75% 55%', background: '40 30% 97%', foreground: '40 15% 10%', card: '40 25% 96%', muted: '40 18% 93%' }},
  { id: 'terracotta', name: 'Терракота', category: 'Тёплые', colors: { primary: '15 55% 48%', accent: '28 60% 52%', background: '20 22% 96%', foreground: '15 12% 12%', card: '20 18% 95%', muted: '20 14% 92%' }},
  { id: 'amber-glow', name: 'Янтарное сияние', category: 'Тёплые', colors: { primary: '35 90% 52%', accent: '45 85% 55%', background: '38 28% 97%', foreground: '35 15% 10%', card: '38 24% 96%', muted: '38 18% 93%' }},
  { id: 'cinnamon', name: 'Корица', category: 'Тёплые', colors: { primary: '20 60% 42%', accent: '12 55% 48%', background: '18 20% 96%', foreground: '20 14% 12%', card: '18 16% 95%', muted: '18 12% 92%' }},

  // ── Тёмные (Dark) ─────────────────────────────────────────────
  { id: 'midnight', name: 'Полночь', category: 'Тёмные', colors: { primary: '260 50% 60%', accent: '280 45% 65%', background: '240 15% 8%', foreground: '240 10% 90%', card: '240 12% 11%', muted: '240 10% 16%' }},
  { id: 'dark-rose', name: 'Тёмная роза', category: 'Тёмные', colors: { primary: '340 60% 55%', accent: '350 55% 60%', background: '340 10% 7%', foreground: '340 8% 90%', card: '340 8% 10%', muted: '340 6% 15%' }},
  { id: 'obsidian', name: 'Обсидиан', category: 'Тёмные', colors: { primary: '220 45% 55%', accent: '200 40% 50%', background: '220 12% 6%', foreground: '220 8% 88%', card: '220 10% 9%', muted: '220 8% 14%' }},
  { id: 'dark-forest', name: 'Тёмный лес', category: 'Тёмные', colors: { primary: '150 45% 42%', accent: '130 40% 48%', background: '150 12% 6%', foreground: '150 8% 88%', card: '150 10% 9%', muted: '150 8% 14%' }},
  { id: 'charcoal-ember', name: 'Угольный жар', category: 'Тёмные', colors: { primary: '10 65% 50%', accent: '25 60% 55%', background: '10 8% 6%', foreground: '10 6% 88%', card: '10 6% 9%', muted: '10 5% 14%' }},
  { id: 'dark-amethyst', name: 'Тёмный аметист', category: 'Тёмные', colors: { primary: '280 55% 55%', accent: '300 50% 60%', background: '280 12% 7%', foreground: '280 8% 90%', card: '280 10% 10%', muted: '280 8% 15%' }},

  // ── Яркие (Vibrant) ───────────────────────────────────────────
  { id: 'cherry-pop', name: 'Вишнёвый поп', category: 'Яркие', colors: { primary: '350 80% 50%', accent: '10 85% 55%', background: '350 15% 97%', foreground: '350 15% 10%', card: '350 12% 96%', muted: '350 8% 93%' }},
  { id: 'electric-violet', name: 'Электрический фиолет', category: 'Яркие', colors: { primary: '270 85% 58%', accent: '290 80% 62%', background: '270 18% 97%', foreground: '270 15% 10%', card: '270 15% 96%', muted: '270 10% 93%' }},
  { id: 'neon-lime', name: 'Неоновый лайм', category: 'Яркие', colors: { primary: '85 80% 42%', accent: '100 75% 48%', background: '90 18% 97%', foreground: '90 15% 10%', card: '90 15% 96%', muted: '90 10% 93%' }},
  { id: 'hot-magenta', name: 'Горячая маджента', category: 'Яркие', colors: { primary: '325 85% 52%', accent: '340 80% 56%', background: '325 15% 97%', foreground: '325 14% 10%', card: '325 12% 96%', muted: '325 8% 93%' }},
  { id: 'tropical-orange', name: 'Тропический апельсин', category: 'Яркие', colors: { primary: '25 90% 52%', accent: '15 85% 55%', background: '25 20% 97%', foreground: '25 15% 10%', card: '25 16% 96%', muted: '25 12% 93%' }},

  // ── Природные (Nature) ────────────────────────────────────────
  { id: 'sage-green', name: 'Шалфейный', category: 'Природные', colors: { primary: '140 25% 48%', accent: '120 30% 55%', background: '140 15% 96%', foreground: '140 12% 10%', card: '140 12% 95%', muted: '140 8% 92%' }},
  { id: 'ocean-breeze', name: 'Морской бриз', category: 'Природные', colors: { primary: '195 60% 45%', accent: '180 55% 50%', background: '195 20% 97%', foreground: '195 15% 10%', card: '195 16% 96%', muted: '195 12% 93%' }},
  { id: 'autumn-leaves', name: 'Осенние листья', category: 'Природные', colors: { primary: '25 65% 45%', accent: '40 60% 50%', background: '30 18% 96%', foreground: '25 14% 12%', card: '30 15% 95%', muted: '30 10% 92%' }},
  { id: 'cherry-blossom', name: 'Сакура', category: 'Природные', colors: { primary: '340 50% 65%', accent: '350 45% 70%', background: '340 22% 97%', foreground: '340 12% 12%', card: '340 18% 96%', muted: '340 14% 93%' }},
  { id: 'northern-lights', name: 'Северное сияние', category: 'Природные', colors: { primary: '170 60% 45%', accent: '200 55% 50%', background: '180 18% 97%', foreground: '180 14% 10%', card: '180 15% 96%', muted: '180 10% 93%' }},
  { id: 'desert-sand', name: 'Пустынный песок', category: 'Природные', colors: { primary: '35 45% 52%', accent: '25 40% 55%', background: '35 22% 96%', foreground: '35 14% 12%', card: '35 18% 95%', muted: '35 14% 92%' }},

  // ── Классические (Classic) ────────────────────────────────────
  { id: 'emerald', name: 'Изумруд', category: 'Классические', colors: { primary: '155 55% 38%', accent: '145 50% 45%', background: '155 12% 96%', foreground: '155 10% 10%', card: '155 10% 95%', muted: '155 6% 92%' }},
  { id: 'royal-blue', name: 'Королевский синий', category: 'Классические', colors: { primary: '225 70% 48%', accent: '215 65% 52%', background: '225 15% 97%', foreground: '225 14% 10%', card: '225 12% 96%', muted: '225 8% 93%' }},
  { id: 'burgundy', name: 'Бургунди', category: 'Классические', colors: { primary: '345 55% 38%', accent: '355 50% 42%', background: '345 12% 96%', foreground: '345 10% 10%', card: '345 10% 95%', muted: '345 6% 92%' }},
  { id: 'ivory-gold', name: 'Слоновая кость и золото', category: 'Классические', colors: { primary: '42 70% 48%', accent: '35 65% 52%', background: '42 25% 97%', foreground: '42 14% 10%', card: '42 20% 96%', muted: '42 15% 93%' }},

  // ── Неон и Киберпанк (Neon & Cyberpunk) ───────────────────────
  { id: 'cyber-pink', name: 'Кибер-розовый', category: 'Неон', colors: { primary: '330 90% 55%', accent: '300 85% 58%', background: '260 15% 6%', foreground: '260 8% 92%', card: '260 12% 9%', muted: '260 10% 14%' }},
  { id: 'neon-cyan', name: 'Неоновый циан', category: 'Неон', colors: { primary: '185 90% 48%', accent: '170 85% 52%', background: '200 15% 6%', foreground: '200 8% 92%', card: '200 12% 9%', muted: '200 10% 14%' }},
  { id: 'matrix-green', name: 'Матрица', category: 'Неон', colors: { primary: '120 85% 42%', accent: '140 80% 48%', background: '120 12% 5%', foreground: '120 8% 88%', card: '120 10% 8%', muted: '120 8% 13%' }},
  { id: 'synthwave', name: 'Синтвейв', category: 'Неон', colors: { primary: '280 80% 58%', accent: '320 75% 55%', background: '260 18% 7%', foreground: '260 8% 92%', card: '260 14% 10%', muted: '260 10% 15%' }},
  { id: 'laser-red', name: 'Лазерный красный', category: 'Неон', colors: { primary: '0 85% 52%', accent: '350 80% 55%', background: '0 10% 6%', foreground: '0 6% 90%', card: '0 8% 9%', muted: '0 6% 14%' }},

  // ── Пастельные (Pastel) ───────────────────────────────────────
  { id: 'pastel-dream', name: 'Пастельная мечта', category: 'Пастельные', colors: { primary: '280 40% 68%', accent: '320 35% 72%', background: '280 25% 97%', foreground: '280 12% 15%', card: '280 22% 96%', muted: '280 18% 93%' }},
  { id: 'pastel-sky', name: 'Пастельное небо', category: 'Пастельные', colors: { primary: '200 45% 65%', accent: '220 40% 68%', background: '200 25% 97%', foreground: '200 12% 15%', card: '200 22% 96%', muted: '200 18% 93%' }},
  { id: 'pastel-rose', name: 'Пастельная роза', category: 'Пастельные', colors: { primary: '345 45% 68%', accent: '355 40% 72%', background: '345 25% 97%', foreground: '345 12% 15%', card: '345 22% 96%', muted: '345 18% 93%' }},
  { id: 'pastel-mint', name: 'Пастельная мята', category: 'Пастельные', colors: { primary: '160 40% 62%', accent: '140 35% 65%', background: '155 22% 97%', foreground: '155 12% 15%', card: '155 18% 96%', muted: '155 14% 93%' }},
  { id: 'pastel-lemon', name: 'Пастельный лимон', category: 'Пастельные', colors: { primary: '50 55% 58%', accent: '40 50% 62%', background: '48 28% 97%', foreground: '48 14% 14%', card: '48 24% 96%', muted: '48 18% 93%' }},

  // ── Градиентные (Gradient-inspired) ───────────────────────────
  { id: 'aurora', name: 'Аврора', category: 'Градиентные', colors: { primary: '170 65% 48%', accent: '260 60% 58%', background: '200 18% 97%', foreground: '200 14% 10%', card: '200 15% 96%', muted: '200 10% 93%' }},
  { id: 'sunset-gradient', name: 'Градиент заката', category: 'Градиентные', colors: { primary: '15 80% 55%', accent: '340 75% 58%', background: '10 22% 97%', foreground: '10 14% 10%', card: '10 18% 96%', muted: '10 12% 93%' }},
  { id: 'ocean-depth', name: 'Глубина океана', category: 'Градиентные', colors: { primary: '210 70% 48%', accent: '240 65% 55%', background: '220 15% 6%', foreground: '220 8% 90%', card: '220 12% 9%', muted: '220 10% 14%' }},
  { id: 'fire-ice', name: 'Огонь и лёд', category: 'Градиентные', colors: { primary: '5 75% 52%', accent: '200 70% 55%', background: '0 10% 97%', foreground: '0 8% 10%', card: '0 8% 96%', muted: '0 5% 93%' }},

  // ── Минималистичные (Minimalist) ──────────────────────────────
  { id: 'mono-light', name: 'Моно светлый', category: 'Минималистичные', colors: { primary: '0 0% 20%', accent: '0 0% 35%', background: '0 0% 98%', foreground: '0 0% 8%', card: '0 0% 97%', muted: '0 0% 93%' }},
  { id: 'mono-dark', name: 'Моно тёмный', category: 'Минималистичные', colors: { primary: '0 0% 80%', accent: '0 0% 65%', background: '0 0% 6%', foreground: '0 0% 92%', card: '0 0% 9%', muted: '0 0% 14%' }},
  { id: 'paper-ink', name: 'Бумага и чернила', category: 'Минималистичные', colors: { primary: '220 15% 30%', accent: '220 10% 45%', background: '40 15% 96%', foreground: '220 12% 12%', card: '40 12% 95%', muted: '40 8% 92%' }},
  { id: 'zen-stone', name: 'Дзен камень', category: 'Минималистичные', colors: { primary: '200 8% 42%', accent: '180 6% 50%', background: '200 6% 95%', foreground: '200 8% 12%', card: '200 5% 94%', muted: '200 4% 91%' }},
];
interface ThemeContextType { currentTheme: ThemePreset; setTheme: (themeId: string) => void; }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(themePresets[0]);
  const setTheme = (themeId: string) => { const theme = themePresets.find(t => t.id === themeId); if (theme) { setCurrentTheme(theme); localStorage.setItem('mamahub-theme', themeId); } };
  useEffect(() => { const saved = localStorage.getItem('mamahub-theme'); if (saved) { const theme = themePresets.find(t => t.id === saved); if (theme) setCurrentTheme(theme); } }, []);
  useEffect(() => { const root = document.documentElement; const c = currentTheme.colors; root.style.setProperty('--primary', c.primary); root.style.setProperty('--background', c.background); root.style.setProperty('--foreground', c.foreground); root.style.setProperty('--card', c.card); root.style.setProperty('--muted', c.muted); root.style.setProperty('--accent', c.primary); root.style.setProperty('--ring', c.primary); }, [currentTheme]);
  return (<ThemeContext.Provider value={{ currentTheme, setTheme }}>{children}</ThemeContext.Provider>);
};
export const useTheme = () => { const ctx = useContext(ThemeContext); if (!ctx) throw new Error('useTheme must be used within ThemeProvider'); return ctx; };
