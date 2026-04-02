import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Calendar, Users, Edit3, Camera, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const avatarOptions = ['🤰', '👩', '👩‍🦰', '👩‍🦱', '👱‍♀️', '👩‍🦳', '🧕', '👧', '🧑‍🦰', '👸', '👩‍💼', '🧑'];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editCity, setEditCity] = useState(user?.city || '');
  const [editStatus, setEditStatus] = useState(user?.status || '');
  const [editWeek, setEditWeek] = useState(String(user?.week || ''));
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setProfilePhoto(ev.target.result as string); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const saveProfile = () => {
    updateProfile({
      name: editName.trim() || user?.name,
      city: editCity.trim(),
      status: editStatus.trim(),
      week: parseInt(editWeek) || user?.week,
    });
    setEditing(false);
  };

  const selectAvatar = (emoji: string) => {
    updateProfile({ avatar: emoji });
    setProfilePhoto(null);
    setShowAvatarPicker(false);
  };

  if (!user) return null;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={() => setShowAvatarPicker(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-card rounded-3xl p-6 m-4 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg">Выберите аватар</h3>
                <button onClick={() => setShowAvatarPicker(false)} className="p-2 rounded-xl hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-6 gap-3 mb-4">
                {avatarOptions.map(a => (
                  <button key={a} onClick={() => selectAvatar(a)} className={`text-3xl p-2 rounded-xl transition-all ${user.avatar === a && !profilePhoto ? 'bg-primary/10 ring-2 ring-primary scale-110' : 'hover:bg-muted'}`}>{a}</button>
                ))}
              </div>
              <button onClick={() => { photoRef.current?.click(); setShowAvatarPicker(false); }} className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2">
                <Camera className="w-4 h-4" /> Загрузить фото
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <div className="bg-card rounded-3xl overflow-hidden border border-border/50">
        <div className="h-32 sm:h-44 relative"><div className="absolute inset-0 gradient-primary" /></div>
        <div className="px-5 pb-5 -mt-12 sm:-mt-16">
          <div className="flex items-end gap-4">
            <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
              {profilePhoto ? (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-card overflow-hidden shadow-md">
                  <img src={profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-card border-4 border-card flex items-center justify-center text-5xl shadow-md">{user.avatar}</div>
              )}
              <div className="absolute inset-0 rounded-2xl bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex-1 pb-2">
              {editing ? (
                <div className="space-y-2">
                  <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Имя" className="w-full px-3 py-2 rounded-xl bg-muted text-sm outline-none" />
                  <input value={editCity} onChange={e => setEditCity(e.target.value)} placeholder="Город" className="w-full px-3 py-2 rounded-xl bg-muted text-sm outline-none" />
                  <input value={editStatus} onChange={e => setEditStatus(e.target.value)} placeholder="Статус" className="w-full px-3 py-2 rounded-xl bg-muted text-sm outline-none" />
                  <input value={editWeek} onChange={e => setEditWeek(e.target.value)} placeholder="Неделя беременности" type="number" min="1" max="42" className="w-full px-3 py-2 rounded-xl bg-muted text-sm outline-none" />
                  <div className="flex gap-2">
                    <button onClick={saveProfile} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"><Save className="w-4 h-4" /> Сохранить</button>
                    <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl bg-muted text-sm">Отмена</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h1 className="font-heading text-xl sm:text-2xl font-bold">{user.name}</h1>
                    <p className="text-sm text-muted-foreground">{user.status || 'Нет статуса'}</p>
                  </div>
                  <button onClick={() => { setEditName(user.name); setEditCity(user.city || ''); setEditStatus(user.status || ''); setEditWeek(String(user.week || '')); setEditing(true); }} className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold flex items-center gap-2">
                    <Edit3 className="w-4 h-4" /> Редактировать
                  </button>
                </div>
              )}
            </div>
          </div>
          {!editing && (
            <>
              <div className="flex items-center gap-4 mt-4 flex-wrap text-sm text-muted-foreground">
                {user.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user.city}</span>}
                {user.week && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {user.week} неделя</span>}
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {user.friends.length} друзей</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                {[
                  { label: 'Друзья', value: String(user.friends.length) },
                  { label: 'Email', value: user.email },
                  { label: 'Неделя', value: String(user.week || '?') },
                ].map(stat => (
                  <div key={stat.label} className="bg-muted/50 rounded-xl py-3">
                    <div className="text-sm font-bold text-gradient truncate px-2">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
