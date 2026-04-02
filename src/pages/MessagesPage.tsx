import React, { useState } from 'react';
import { Send, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  messages: Message[];
  online: boolean;
}

const MESSAGES_KEY = 'mamahub_messages';

function getConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  const defaults: Conversation[] = [
    { id: 'conv-1', name: 'Мария Петрова', avatar: '👩‍🦰', online: true, messages: [
      { id: 'm1', senderId: 'conv-1', text: 'Привет! Как проходит беременность?', timestamp: '10:30' },
      { id: 'm2', senderId: 'me', text: 'Всё отлично! Малыш активно пинается', timestamp: '10:32' },
    ]},
    { id: 'conv-2', name: 'Елена Сидорова', avatar: '👩‍🦱', online: true, messages: [
      { id: 'm3', senderId: 'conv-2', text: 'Спасибо за совет с кремом!', timestamp: '09:15' },
    ]},
    { id: 'conv-3', name: 'Ольга Козлова', avatar: '👱‍♀️', online: false, messages: [
      { id: 'm4', senderId: 'conv-3', text: 'Давай встретимся на курсах', timestamp: 'вчера' },
    ]},
    { id: 'conv-4', name: 'Наталья Морозова', avatar: '👩‍🦳', online: false, messages: [
      { id: 'm5', senderId: 'conv-4', text: 'Видела новую статью про питание?', timestamp: 'вчера' },
    ]},
    { id: 'conv-5', name: 'Ирина Волкова', avatar: '🧑‍🦰', online: true, messages: [
      { id: 'm6', senderId: 'conv-5', text: 'Скоро увидимся!', timestamp: '2 дня назад' },
    ]},
  ];
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(defaults));
  return defaults;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(getConversations);
  const [selected, setSelected] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;
    const msg: Message = {
      id: 'm-' + Date.now(),
      senderId: 'me',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = conversations.map((c, i) =>
      i === selected ? { ...c, messages: [...c.messages, msg] } : c
    );
    setConversations(updated);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    setNewMessage('');

    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = ['Отлично!', 'Как мило!', 'Согласна!', 'Расскажи подробнее', 'Здорово!', 'Обязательно!'];
      const reply: Message = {
        id: 'm-reply-' + Date.now(),
        senderId: conversations[selected].id,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setConversations(prev => {
        const u = prev.map((c, i) => i === selected ? { ...c, messages: [...c.messages, reply] } : c);
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(u));
        return u;
      });
    }, 1500);
  };

  const filtered = conversations.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const conv = conversations[selected];

  return (
    <div className="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
      <div className="w-full sm:w-80 border-r border-border/50 flex flex-col bg-card">
        <div className="p-4">
          <h2 className="font-heading text-xl font-bold mb-3">Сообщения</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Поиск..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted text-sm outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((c, i) => {
            const origIdx = conversations.indexOf(c);
            const lastMsg = c.messages[c.messages.length - 1];
            return (
              <div key={c.id} onClick={() => setSelected(origIdx)} className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${selected === origIdx ? 'bg-primary/5' : 'hover:bg-muted/50'}`}>
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-xl">{c.avatar}</div>
                  {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">{lastMsg?.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{lastMsg?.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:flex flex-1 flex-col">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg">{conv?.avatar}</div>
          <div>
            <p className="text-sm font-semibold">{conv?.name}</p>
            <p className={`text-[10px] ${conv?.online ? 'text-green-500' : 'text-muted-foreground'}`}>{conv?.online ? 'онлайн' : 'не в сети'}</p>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {conv?.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 text-sm rounded-2xl ${msg.senderId === 'me' ? 'gradient-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md'}`}>
                {msg.text}
                <div className={`text-[10px] mt-1 ${msg.senderId === 'me' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{msg.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Написать сообщение..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={sendMessage} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
