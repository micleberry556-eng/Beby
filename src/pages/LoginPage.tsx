import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Введите email'); return; }
    if (!password) { setError('Введите пароль'); return; }
    const result = login(email.trim(), password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Ошибка входа');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl translate-x-1/3 -translate-y-1/3 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/8 blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 w-full max-w-md p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Branding */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-lg shadow-primary/20 mb-4"
            >
              <span className="text-2xl font-bold text-white">M</span>
            </motion.div>
            <h1 className="font-heading text-3xl font-bold text-gradient">МамаХаб</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">Рады видеть вас снова</p>
          </div>

          {/* Form card */}
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-7 sm:p-8 border border-border/40 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="anna@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Ваш пароль"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gradient-primary text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 mt-2"
              >
                <LogIn className="w-4 h-4" />
                Войти
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-border/30">
              <p className="text-center text-sm text-muted-foreground">
                Нет аккаунта?{' '}
                <Link to="/register" className="text-primary font-semibold hover:underline">Зарегистрироваться</Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground/60 mt-5">
            Админ: admin@mamahub.ru / admin123
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
