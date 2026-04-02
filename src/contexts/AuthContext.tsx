import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  week?: number;
  city?: string;
  status?: string;
  isAdmin: boolean;
  friends: string[];
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'mamahub_users';
const CURRENT_USER_KEY = 'mamahub_current_user';

interface StoredUser extends UserProfile {
  password: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch { return []; }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Seed default admin if no users exist
function seedDefaults() {
  const users = getStoredUsers();
  if (users.length === 0) {
    const admin: StoredUser = {
      id: 'admin-1',
      name: 'Администратор',
      email: 'admin@mamahub.ru',
      password: 'admin123',
      avatar: '👩‍💼',
      isAdmin: true,
      friends: [],
      city: 'Москва',
      status: 'Администратор МамаХаб',
      createdAt: new Date().toISOString(),
    };
    saveStoredUsers([admin]);
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    seedDefaults();
    const savedId = localStorage.getItem(CURRENT_USER_KEY);
    if (savedId) {
      const users = getStoredUsers();
      const found = users.find(u => u.id === savedId);
      if (found) {
        const { password, ...profile } = found;
        setUser(profile);
      }
    }
  }, []);

  const login = (email: string, pwd: string) => {
    const users = getStoredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pwd);
    if (!found) return { success: false, error: 'Неверный email или пароль' };
    const { password, ...profile } = found;
    setUser(profile);
    localStorage.setItem(CURRENT_USER_KEY, profile.id);
    return { success: true };
  };

  const register = (name: string, email: string, pwd: string) => {
    const users = getStoredUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }
    const newUser: StoredUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      password: pwd,
      avatar: '🤰',
      isAdmin: false,
      friends: [],
      city: '',
      status: '',
      week: 1,
      createdAt: new Date().toISOString(),
    };
    saveStoredUsers([...users, newUser]);
    const { password, ...profile } = newUser;
    setUser(profile);
    localStorage.setItem(CURRENT_USER_KEY, profile.id);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      saveStoredUsers(users);
    }
  };

  const addFriend = (friendId: string) => {
    if (!user) return;
    if (user.friends.includes(friendId)) return;
    const newFriends = [...user.friends, friendId];
    updateProfile({ friends: newFriends });
  };

  const removeFriend = (friendId: string) => {
    if (!user) return;
    const newFriends = user.friends.filter(id => id !== friendId);
    updateProfile({ friends: newFriends });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile,
      addFriend,
      removeFriend,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
