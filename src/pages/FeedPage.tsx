import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Send, Smile, X, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PostData {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorWeek?: number;
  content: string;
  images: string[];
  likes: number;
  likedBy: string[];
  comments: CommentData[];
  shares: number;
  timestamp: string;
  category?: string;
}

interface CommentData {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

const POSTS_KEY = 'mamahub_posts';

function getStoredPosts(): PostData[] {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  // Seed default posts
  const defaults: PostData[] = [
    { id: 'p1', authorId: 'seed-1', authorName: 'Мария Петрова', authorAvatar: '👩‍🦰', authorWeek: 32, content: 'Сегодня были на УЗИ — всё отлично! Малыш уже 1.8 кг, активно пинается.', images: [], likes: 42, likedBy: [], comments: [], shares: 2, timestamp: '2 часа назад', category: 'УЗИ' },
    { id: 'p2', authorId: 'seed-2', authorName: 'Елена Сидорова', authorAvatar: '👩‍🦱', authorWeek: 18, content: 'Девочки, посоветуйте хороший крем от растяжек! На 18 неделе уже начинает тянуть кожу.', images: [], likes: 15, likedBy: [], comments: [], shares: 1, timestamp: '4 часа назад', category: 'Здоровье' },
    { id: 'p3', authorId: 'seed-3', authorName: 'Ольга Козлова', authorAvatar: '👱‍♀️', authorWeek: 28, content: 'Собрала сумку в роддом! Делюсь списком: документы, халат, тапочки, бутылка воды, перекус, зарядка для телефона, вещи для малыша.', images: [], likes: 67, likedBy: [], comments: [], shares: 12, timestamp: '6 часов назад', category: 'Подготовка к родам' },
    { id: 'p4', authorId: 'seed-4', authorName: 'Наталья Морозова', authorAvatar: '👩‍🦳', authorWeek: 12, content: 'Первый триместр позади! Токсикоз отступил, энергия вернулась. Чувствую себя замечательно.', images: [], likes: 89, likedBy: [], comments: [], shares: 3, timestamp: '8 часов назад', category: 'Первый триместр' },
    { id: 'p5', authorId: 'seed-5', authorName: 'Ирина Волкова', authorAvatar: '🧑‍🦰', authorWeek: 36, content: 'Слушаю колыбельные для малыша через наш плеер — он так реагирует! Пинается в такт!', images: [], likes: 103, likedBy: [], comments: [], shares: 7, timestamp: 'вчера', category: 'Музыка' },
  ];
  localStorage.setItem(POSTS_KEY, JSON.stringify(defaults));
  return defaults;
}

function savePosts(posts: PostData[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

const PostCard = ({ post, onUpdate }: { post: PostData; onUpdate: (p: PostData) => void }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const liked = user ? post.likedBy.includes(user.id) : false;

  const toggleLike = () => {
    if (!user) return;
    const newLikedBy = liked
      ? post.likedBy.filter(id => id !== user.id)
      : [...post.likedBy, user.id];
    onUpdate({ ...post, likedBy: newLikedBy, likes: post.likes + (liked ? -1 : 1) });
  };

  const addComment = () => {
    if (!user || !commentText.trim()) return;
    const comment: CommentData = {
      id: 'c-' + Date.now(),
      authorName: user.name,
      authorAvatar: user.avatar,
      text: commentText.trim(),
      timestamp: 'только что',
    };
    onUpdate({ ...post, comments: [...post.comments, comment] });
    setCommentText('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-4 sm:p-5 shadow-sm border border-border/50">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg shrink-0">{post.authorAvatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{post.authorName}</span>
            {post.authorWeek && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{post.authorWeek} нед.</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{post.timestamp}</span>
            {post.category && <span className="text-xs text-primary/70">· {post.category}</span>}
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-3">{post.content}</p>

      {/* Images */}
      {post.images.length > 0 && (
        <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-full rounded-xl object-cover max-h-64" />
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 pt-3 border-t border-border/50">
        <button onClick={toggleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${liked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'}`}>
          <Heart className={`w-4 h-4 ${liked ? 'fill-primary' : ''}`} />{post.likes}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted">
          <MessageCircle className="w-4 h-4" />{post.comments.length}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted">
          <Share2 className="w-4 h-4" />{post.shares}
        </button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
              {post.comments.map(c => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm shrink-0">{c.authorAvatar}</div>
                  <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2">
                    <span className="text-xs font-semibold">{c.authorName}</span>
                    <p className="text-xs text-muted-foreground">{c.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addComment()}
                  placeholder="Написать комментарий..."
                  className="flex-1 px-3 py-2 rounded-xl bg-muted text-xs outline-none"
                />
                <button onClick={addComment} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FeedPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostData[]>(getStoredPosts);
  const [newPost, setNewPost] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setNewImages(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
  };

  const createPost = () => {
    if (!user || (!newPost.trim() && newImages.length === 0)) return;
    const post: PostData = {
      id: 'p-' + Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorWeek: user.week,
      content: newPost.trim(),
      images: newImages,
      likes: 0,
      likedBy: [],
      comments: [],
      shares: 0,
      timestamp: 'только что',
    };
    const updated = [post, ...posts];
    setPosts(updated);
    savePosts(updated);
    setNewPost('');
    setNewImages([]);
  };

  const updatePost = (updated: PostData) => {
    const newPosts = posts.map(p => p.id === updated.id ? updated : p);
    setPosts(newPosts);
    savePosts(newPosts);
  };

  return (
    <div className="p-4 lg:p-6">
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Create Post */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg shrink-0">{user?.avatar}</div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder="Как вы себя чувствуете сегодня?"
                className="w-full resize-none border-none bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                rows={2}
              />

              {/* Image previews */}
              {newImages.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {newImages.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} alt="" className="w-20 h-20 rounded-lg object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1">
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                    <Camera className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={createPost}
                  disabled={!newPost.trim() && newImages.length === 0}
                  className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />Опубликовать
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        {posts.map(post => (
          <PostCard key={post.id} post={post} onUpdate={updatePost} />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
