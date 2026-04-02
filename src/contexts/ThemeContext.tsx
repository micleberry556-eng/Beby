import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
export interface ThemePreset { id: string; name: string; category: string; colors: { primary: string; accent: string; background: string; foreground: string; card: string; muted: string; }; }
export const themePresets: ThemePreset[] = [
  { id: 'rose-dawn', name: 'Розовый рассвет', category: 'Нежные', colors: { primary: '340 65% 55%', accent: '24 80% 60%', background: '30 30% 98%', foreground: '240 10% 10%', card: '30 25% 97%', muted: '30 20% 94%' }},
  { id: 'lavender-mist', name: 'Лавандовый туман', category: 'Нежные', colors: { primary: '270 50% 60%', accent: '300 40% 65%', background: '270 20% 98%', foreground: '270 15% 10%', card: '270 20% 97%', muted: '270 15% 94%' }},
  { id: 'mint-fresh', name: 'Мятная свежесть', category: 'Нежные', colors: { primary: '160 50% 45%', accent: '140 45% 55%', background: '150 20% 97%', foreground: '160 15% 10%', card: '150 18% 96%', muted: '150 15% 93%' }},
  { id: 'coral-sunset', name: 'Коралловый закат', category: 'Тёплые', colors: { primary: '5 70% 58%', accent: '25 85% 55%', background: '15 30% 97%', foreground: '10 15% 10%', card: '15 25% 96%', muted: '15 18% 93%' }},
  { id: 'golden-honey', name: 'Золотой мёд', category: 'Тёплые', colors: { primary: '40 80% 50%', accent: '30 75% 55%', background: '40 30% 97%', foreground: '40 15% 10%', card: '40 25% 96%', muted: '40 18% 93%' }},
  { id: 'midnight', name: 'Полночь', category: 'Тёмные', colors: { primary: '260 50% 60%', accent: '280 45% 65%', background: '240 15% 8%', foreground: '240 10% 90%', card: '240 12% 11%', muted: '240 10% 16%' }},
  { id: 'dark-rose', name: 'Тёмная роза', category: 'Тёмные', colors: { primary: '340 60% 55%', accent: '350 55% 60%', background: '340 10% 7%', foreground: '340 8% 90%', card: '340 8% 10%', muted: '340 6% 15%' }},
  { id: 'cherry-pop', name: 'Вишнёвый поп', category: 'Яркие', colors: { primary: '350 80% 50%', accent: '10 85% 55%', background: '350 15% 97%', foreground: '350 15% 10%', card: '350 12% 96%', muted: '350 8% 93%' }},
  { id: 'sage-green', name: 'Шалфейный', category: 'Природные', colors: { primary: '140 25% 48%', accent: '120 30% 55%', background: '140 15% 96%', foreground: '140 12% 10%', card: '140 12% 95%', muted: '140 8% 92%' }},
  { id: 'emerald', name: 'Изумруд', category: 'Классические', colors: { primary: '155 55% 38%', accent: '145 50% 45%', background: '155 12% 96%', foreground: '155 10% 10%', card: '155 10% 95%', muted: '155 6% 92%' }},
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
