import React from 'react';
import { mockGroups } from '@/data/mockData';
import { Users, Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
const GroupsPage = () => (
  <div className="p-4 lg:p-6 space-y-6">
    <div className="flex items-center justify-between"><h1 className="font-heading text-2xl font-bold">Группы</h1><button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Создать</button></div>
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" placeholder="Найти группу..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/50 text-sm outline-none focus:ring-2 focus:ring-primary/30" /></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {mockGroups.map((g, i) => (<motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-2xl p-5 border border-border/50 hover:shadow-md transition-shadow cursor-pointer">
        <div className="text-4xl mb-3">{g.icon}</div><h3 className="font-semibold text-base">{g.name}</h3><p className="text-sm text-muted-foreground mt-1">{g.description}</p>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground"><Users className="w-3.5 h-3.5" /><span>{g.members.toLocaleString()} участниц</span></div>
        <button className="w-full mt-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20">Вступить</button>
      </motion.div>))}
    </div>
  </div>
);
export default GroupsPage;
