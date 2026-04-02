import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Send, Smile } from 'lucide-react';
import { mockPosts, mockGroups, currentUser, Post } from '@/data/mockData';
import { motion } from 'framer-motion';
const PostCard = ({ post }: { post: Post }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const toggleLike = () => { setLiked(!liked); setLikes(l => liked ? l - 1 : l + 1); };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-4 sm:p-5 shadow-sm border border-border/50">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg shrink-0">{post.author.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><span className="font-semibold text-sm">{post.author.name}</span>{post.author.week && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{post.author.week} нед.</span>}</div>
          <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{post.timestamp}</span>{post.category && <span className="text-xs text-primary/70">· {post.category}</span>}</div>
        </div>
        <button className="p-1 rounded-lg hover:bg-muted"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
      </div>
      <p className="text-sm leading-relaxed mb-4">{post.content}</p>
      <div className="flex items-center gap-1 pt-3 border-t border-border/50">
        <button onClick={toggleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${liked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'}`}><Heart className={`w-4 h-4 ${liked ? 'fill-primary' : ''}`} />{likes}</button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted"><MessageCircle className="w-4 h-4" />{post.comments}</button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted"><Share2 className="w-4 h-4" />{post.shares}</button>
      </div>
    </motion.div>
  );
};
const FeedPage = () => {
  const [newPost, setNewPost] = useState('');
  return (
    <div className="p-4 lg:p-6"><div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50"><div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg shrink-0">{currentUser.avatar}</div>
          <div className="flex-1"><textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Как вы себя чувствуете сегодня?" className="w-full resize-none border-none bg-transparent outline-none text-sm placeholder:text-muted-foreground" rows={2} />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
              <div className="flex items-center gap-1"><button className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Image className="w-4 h-4" /></button><button className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Smile className="w-4 h-4" /></button></div>
              <button className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5"><Send className="w-3.5 h-3.5" />Опубликовать</button>
            </div>
          </div>
        </div></div>
        {mockPosts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
      <div className="hidden lg:block space-y-4">
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50"><h3 className="font-heading text-lg font-semibold mb-3">Ваша неделя</h3><div className="text-center py-4"><div className="text-5xl font-heading font-bold text-gradient">24</div><p className="text-sm text-muted-foreground mt-1">неделя беременности</p></div><div className="w-full bg-muted rounded-full h-2 mt-3"><div className="h-2 rounded-full gradient-primary" style={{ width: '60%' }} /></div><p className="text-xs text-muted-foreground mt-2 text-center">60% пути пройдено!</p></div>
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50"><h3 className="font-heading text-lg font-semibold mb-3">Популярные группы</h3><div className="space-y-3">{mockGroups.slice(0, 5).map(g => <div key={g.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted cursor-pointer"><span className="text-2xl">{g.icon}</span><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{g.name}</p><p className="text-xs text-muted-foreground">{g.members.toLocaleString()} участниц</p></div></div>)}</div></div>
      </div>
    </div></div>
  );
};
export default FeedPage;
