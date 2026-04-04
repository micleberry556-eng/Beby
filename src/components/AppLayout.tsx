import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Music, MessageCircle, User, Settings, Menu, X, Baby, Heart, Search, Bell, Video, UserPlus, Activity, Sparkles, ShoppingBag, LogOut } from 'lucide-react';
import { MusicPlayerBar } from './MusicPlayerBar';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/UserAvatar';

const navItems = [
  { path: '/', icon: Home, label: 'Лента' },
  { path: '/friends', icon: UserPlus, label: 'Друзья' },
  { path: '/videos', icon: Video, label: 'Клипы' },
  { path: '/groups', icon: Users, label: 'Группы' },
  { path: '/music', icon: Music, label: 'Музыка' },
  { path: '/messages', icon: MessageCircle, label: 'Сообщения' },
  { path: '/classifieds', icon: ShoppingBag, label: 'Объявления' },
  { path: '/tracker', icon: Activity, label: 'Трекер' },
  { path: '/horoscope', icon: Sparkles, label: 'Гороскоп' },
  { path: '/profile', icon: User, label: 'Профиль' },
];

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const allNav = user?.isAdmin ? [...navItems, { path: '/admin', icon: Settings, label: 'Админ' }] : navItems;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14 lg:h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">M</span>
              </div>
              <span className="font-heading text-xl font-bold text-gradient hidden sm:inline">МамаХаб</span>
            </Link>
          </div>
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Поиск..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted border-none outline-none text-sm focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-muted transition-colors"><Bell className="w-5 h-5 text-muted-foreground" /><span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" /></button>
            <Link to="/profile" className="hidden sm:flex items-center gap-2 pl-2">
              <UserAvatar name={user?.name || 'U'} photo={user?.photo} size={32} />
            </Link>
            <button onClick={logout} className="p-2 rounded-xl hover:bg-muted transition-colors" title="Выйти">
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <aside className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          <nav className="flex flex-col gap-1">
            {allNav.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary text-primary-foreground shadow-glow' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <item.icon className="w-5 h-5" /><span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 p-4 rounded-2xl gradient-soft">
            <div className="flex items-center gap-2 mb-2"><Baby className="w-5 h-5 text-primary" /><span className="font-semibold text-sm">{user?.week || '?'} неделя</span></div>
            <p className="text-xs text-muted-foreground leading-relaxed">{user?.name || 'Пользователь'}</p>
          </div>
        </aside>

        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
              <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed left-0 top-14 bottom-0 w-72 bg-card z-50 p-4 shadow-lg lg:hidden overflow-y-auto">
                <nav className="flex flex-col gap-1">
                  {allNav.map(item => {
                    const active = location.pathname === item.path;
                    return (<Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}><item.icon className="w-5 h-5" /><span>{item.label}</span></Link>);
                  })}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 min-w-0 pb-36 lg:pb-24">{children}</main>
      </div>

      <MusicPlayerBar />

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-14">
          {allNav.slice(0, 5).map(item => {
            const active = location.pathname === item.path;
            return (<Link key={item.path} to={item.path} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}><item.icon className="w-5 h-5" /><span className="text-[10px] font-medium">{item.label}</span></Link>);
          })}
        </div>
      </nav>
    </div>
  );
};
