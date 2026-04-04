import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Sparkles, Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Heart, text: 'Общайтесь с другими мамами' },
  { icon: Sparkles, text: 'Отслеживайте беременность' },
  { icon: Shield, text: 'Безопасное сообщество' },
];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Введите имя'); return; }
    if (!email.trim()) { setError('Введите email'); return; }
    if (password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return; }
    if (password !== confirmPassword) { setError('Пароли не совпадают'); return; }
    const result = register(name.trim(), email.trim(), password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/8 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/8 blur-3xl translate-x-1/3 translate-y-1/3" />

      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl font-bold mb-4 text-gradient leading-tight">
              МамаХаб
            </h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Присоединяйтесь к сообществу будущих мам. Делитесь опытом, находите поддержку и наслаждайтесь каждым моментом.
            </p>
            <div className="space-y-5">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile branding */}
          <div className="text-center mb-8 lg:hidden">
            <h1 className="font-heading text-3xl font-bold text-gradient">МамаХаб</h1>
            <p className="text-muted-foreground mt-1 text-sm">Создайте аккаунт</p>
          </div>

          <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-7 sm:p-8 border border-border/40 shadow-xl">
            <div className="hidden lg:block mb-6">
              <h2 className="font-heading text-2xl font-bold">Создать аккаунт</h2>
              <p className="text-sm text-muted-foreground mt-1">Заполните данные для регистрации</p>
            </div>

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
                <label className="text-sm font-medium mb-1.5 block">Имя</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Анна Иванова"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                  />
                </div>
              </div>

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
                    placeholder="Минимум 6 символов"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Подтвердите пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Повторите пароль"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gradient-primary text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                Зарегистрироваться
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-border/30">
              <p className="text-center text-sm text-muted-foreground">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">Войти</Link>
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

export default RegisterPage;
