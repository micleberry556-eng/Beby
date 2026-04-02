import React from 'react';
import { Send, Search } from 'lucide-react';
import { mockUsers } from '@/data/mockData';
const conversations = mockUsers.map((u, i) => ({ user: u, lastMessage: ['Как ты себя чувствуешь?', 'Спасибо за совет!', 'Давай встретимся на курсах', 'Видела новую статью?', 'Скоро увидимся!'][i], time: ['2 мин', '15 мин', '1 ч', '3 ч', 'вчера'][i], unread: [2, 0, 1, 0, 0][i] }));
const MessagesPage = () => {
  const [selected, setSelected] = React.useState(0);
  return (
    <div className="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
      <div className="w-full sm:w-80 border-r border-border/50 flex flex-col bg-card">
        <div className="p-4"><h2 className="font-heading text-xl font-bold mb-3">Сообщения</h2><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" placeholder="Поиск..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted text-sm outline-none" /></div></div>
        <div className="flex-1 overflow-y-auto">{conversations.map((c, i) => <div key={c.user.id} onClick={() => setSelected(i)} className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${selected === i ? 'bg-primary/5' : 'hover:bg-muted/50'}`}><div className="relative"><div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-xl">{c.user.avatar}</div>{i < 3 && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />}</div><div className="flex-1 min-w-0"><div className="flex items-center justify-between"><span className="text-sm font-semibold truncate">{c.user.name}</span><span className="text-[10px] text-muted-foreground">{c.time}</span></div><p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p></div>{c.unread > 0 && <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">{c.unread}</span>}</div>)}</div>
      </div>
      <div className="hidden sm:flex flex-1 flex-col">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg">{conversations[selected].user.avatar}</div><div><p className="text-sm font-semibold">{conversations[selected].user.name}</p><p className="text-[10px] text-green-500">онлайн</p></div></div>
        <div className="flex-1 p-4 overflow-y-auto space-y-3"><div className="flex justify-start"><div className="max-w-xs bg-muted rounded-2xl rounded-bl-md px-4 py-2 text-sm">Привет! Как проходит беременность?</div></div><div className="flex justify-end"><div className="max-w-xs gradient-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2 text-sm">Всё отлично! Малыш активно пинается</div></div><div className="flex justify-start"><div className="max-w-xs bg-muted rounded-2xl rounded-bl-md px-4 py-2 text-sm">{conversations[selected].lastMessage}</div></div></div>
        <div className="p-4 border-t border-border/50"><div className="flex items-center gap-2"><input type="text" placeholder="Написать сообщение..." className="flex-1 px-4 py-2.5 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" /><button className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"><Send className="w-4 h-4" /></button></div></div>
      </div>
    </div>
  );
};
export default MessagesPage;
