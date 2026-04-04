import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Calendar, Users, Edit3, Camera, Save, X, Heart, Mail, Phone, FileText, Sparkles, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from '@/components/UserAvatar';
import { toast } from 'sonner';

const interestOptions = [
  'Здоровье', 'Питание', 'Фитнес', 'Йога', 'Медитация',
  'Кулинария', 'Путешествия', 'Чтение', 'Музыка', 'Рукоделие',
  'Фотография', 'Садоводство', 'Дизайн', 'Психология', 'Мода',
];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editCity, setEditCity] = useState(user?.city || '');
  const [editStatus, setEditStatus] = useState(user?.status || '');
  const [editWeek, setEditWeek] = useState(String(user?.week || ''));
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editBirthday, setEditBirthday] = useState(user?.birthday || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editInterests, setEditInterests] = useState<string[]>(user?.interests || []);
  const photoRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        updateProfile({ photo: ev.target.result as string });
        toast.success('Фото обновлено!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const saveProfile = () => {
    updateProfile({
      name: editName.trim() || user?.name,
      city: editCity.trim(),
      status: editStatus.trim(),
      week: parseInt(editWeek) || user?.week,
      bio: editBio.trim(),
      birthday: editBirthday,
      phone: editPhone.trim(),
      interests: editInterests,
    });
    setEditing(false);
    toast.success('Профиль сохранён!');
  };

  const startEditing = () => {
    setEditName(user?.name || '');
    setEditCity(user?.city || '');
    setEditStatus(user?.status || '');
    setEditWeek(String(user?.week || ''));
    setEditBio(user?.bio || '');
    setEditBirthday(user?.birthday || '');
    setEditPhone(user?.phone || '');
    setEditInterests(user?.interests || []);
    setEditing(true);
  };

  const toggleInterest = (interest: string) => {
    setEditInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-3xl mx-auto">
      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

      {/* Profile Header Card */}
      <div className="bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm">
        {/* Cover gradient */}
        <div className="h-36 sm:h-48 relative">
          <div className="absolute inset-0 gradient-primary opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
        </div>

        {/* Avatar + basic info */}
        <div className="px-5 sm:px-7 pb-6 -mt-14 sm:-mt-18">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Avatar with upload */}
            <div className="relative group cursor-pointer" onClick={() => photoRef.current?.click()}>
              <UserAvatar name={user.name} photo={user.photo} size={112} className="border-4 border-card shadow-xl" />
              <div className="absolute inset-0 rounded-2xl bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="flex-1 sm:pb-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold">{user.name}</h1>
                  {user.status && (
                    <p className="text-sm text-muted-foreground mt-0.5">{user.status}</p>
                  )}
                </div>
                {!editing && (
                  <button
                    onClick={startEditing}
                    className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold flex items-center gap-2 hover:bg-primary/20 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" /> Редактировать
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick info badges */}
          {!editing && (
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              {user.city && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  <MapPin className="w-3.5 h-3.5" /> {user.city}
                </span>
              )}
              {user.week && (
                <span className="flex items-center gap-1.5 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full font-medium">
                  <Calendar className="w-3.5 h-3.5" /> {user.week} неделя
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <Users className="w-3.5 h-3.5" /> {user.friends.length} друзей
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Edit form */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card rounded-3xl p-5 sm:p-7 border border-border/50 shadow-sm space-y-5">
              <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary" /> Редактирование профиля
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Имя</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Ваше имя" className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Город</label>
                  <input value={editCity} onChange={e => setEditCity(e.target.value)} placeholder="Ваш город" className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Статус</label>
                  <input value={editStatus} onChange={e => setEditStatus(e.target.value)} placeholder="Ваш статус" className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Неделя беременности</label>
                  <input value={editWeek} onChange={e => setEditWeek(e.target.value)} placeholder="1-42" type="number" min="1" max="42" className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Дата рождения</label>
                  <input value={editBirthday} onChange={e => setEditBirthday(e.target.value)} type="date" className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Телефон</label>
                  <input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+7 (999) 123-45-67" className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">О себе</label>
                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Расскажите о себе..." rows={3} className="w-full px-4 py-2.5 rounded-xl bg-muted/60 border border-border/30 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none" />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                  <Tag className="w-4 h-4" /> Интересы
                </label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        editInterests.includes(interest)
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted border border-border/30'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={saveProfile} className="px-6 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4" /> Сохранить
                </button>
                <button onClick={() => setEditing(false)} className="px-6 py-2.5 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition-colors">
                  Отмена
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info cards grid */}
      {!editing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bio card */}
          <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm sm:col-span-2">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary" /> О себе
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {user.bio || 'Нажмите "Редактировать", чтобы рассказать о себе'}
            </p>
          </div>

          {/* Stats cards */}
          <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" /> Информация
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Телефон</p>
                    <p className="text-sm font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
              {user.birthday && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Дата рождения</p>
                    <p className="text-sm font-medium">{new Date(user.birthday).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Участник с</p>
                  <p className="text-sm font-medium">{memberSince}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats numbers */}
          <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-primary" /> Статистика
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Друзья', value: String(user.friends.length) },
                { label: 'Неделя', value: String(user.week || '?') },
                { label: 'Интересы', value: String(user.interests?.length || 0) },
                { label: 'Город', value: user.city || '?' },
              ].map(stat => (
                <div key={stat.label} className="bg-muted/40 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-gradient truncate">{stat.value}</div>
                  <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm sm:col-span-2">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-primary" /> Интересы
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map(interest => (
                  <span key={interest} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
