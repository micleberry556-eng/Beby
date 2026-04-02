import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-5xl">🤰</span>
          <h1 className="font-heading text-3xl font-bold mt-3 text-gradient">МамаХаб</h1>
          <p className="text-muted-foreground mt-2">Создайте аккаунт</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">{error}</div>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block">Имя</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Анна Иванова"
                className="w-full px-4 py-2.5 rounded-xl bg-muted border-none text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="anna@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-muted border-none text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted border-none text-sm outline-none focus:ring-2 focus:ring-primary/30 pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Подтвердите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                className="w-full px-4 py-2.5 rounded-xl bg-muted border-none text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <UserPlus className="w-4 h-4" />
              Зарегистрироваться
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Войти</Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Админ: admin@mamahub.ru / admin123
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
