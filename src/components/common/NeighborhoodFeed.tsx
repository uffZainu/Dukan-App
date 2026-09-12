import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShopPost } from '../../types';
import {
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Send,
  Plus,
  Tag,
  Store,
  Clock,
  Radio,
  X,
  Megaphone,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface NeighborhoodFeedProps {
  limit?: number;
  showHeader?: boolean;
}

export const NeighborhoodFeed: React.FC<NeighborhoodFeedProps> = ({
  limit,
  showHeader = true
}) => {
  const { posts, toggleLikePost, deletePost, currentRole, currentShop, showToast, setSelectedShopId } = useApp();
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [localComments, setLocalComments] = useState<Record<string, { id: string; author: string; text: string; time: string }[]>>({
    'post-1': [
      { id: 'c-1', author: 'Rahul Verma', text: 'Are the strawberries sweet or slightly tart this week?', time: '1h ago' },
      { id: 'c-2', author: 'Green Basket', text: 'Naturally sun-ripened and very sweet! Freshly delivered today.', time: '45m ago' }
    ],
    'post-2': [
      { id: 'c-3', author: 'Ananya Sharma', text: 'Saved one loaf for me? Coming in 15 minutes!', time: '2h ago' }
    ]
  });

  const filteredPosts = posts
    .filter((p) => (selectedTag === 'all' ? true : p.tag === selectedTag))
    .slice(0, limit || posts.length);

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setLocalComments((prev) => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        {
          id: `c-${Date.now()}`,
          author: currentRole === 'shopkeeper' ? currentShop.name : 'You',
          text,
          time: 'Just now'
        }
      ]
    }));

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    showToast('Comment posted!');
  };

  const getTagBadgeClass = (tag: ShopPost['tag']) => {
    switch (tag) {
      case 'Offer':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Daily Special':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'New Arrival':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>Neighborhood Live Updates</span>
              </h2>
            </div>
            <p className="text-[11px] text-neutral-400">
              Fresh specials & offers broadcasted directly by local merchants
            </p>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-lg">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Live Feed</span>
          </div>
        </div>
      )}

      {/* Tag Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs select-none">
        {['all', 'Offer', 'Daily Special', 'New Arrival', 'Notice'].map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
              selectedTag === tag
                ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-sm'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
            }`}
          >
            {tag === 'all' ? 'All Updates' : tag}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 text-center text-xs text-neutral-400">
            No updates posted in this category yet.
          </div>
        ) : (
          filteredPosts.map((post) => {
            const comments = localComments[post.id] || [];
            const isCommentsOpen = expandedCommentsPostId === post.id;
            const canDelete =
              currentRole === 'admin' ||
              (currentRole === 'shopkeeper' && currentShop.id === post.shopId);

            return (
              <article
                key={post.id}
                id={`post-card-${post.id}`}
                className="bg-neutral-900 border border-neutral-800/90 rounded-2xl overflow-hidden shadow-md hover:border-neutral-700 transition"
              >
                {/* Post Header */}
                <div className="p-3.5 flex items-center justify-between gap-3 border-b border-neutral-800/60">
                  <div
                    onClick={() => setSelectedShopId(post.shopId)}
                    className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0"
                  >
                    <img
                      src={post.shopLogo}
                      alt={post.shopName}
                      className="w-9 h-9 rounded-xl object-cover border border-neutral-800 shrink-0 group-hover:border-amber-500/50 transition"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-amber-400 transition truncate">
                          {post.shopName}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {post.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${getTagBadgeClass(
                        post.tag
                      )}`}
                    >
                      {post.tag}
                    </span>

                    {canDelete && (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-neutral-500 hover:text-rose-400 p-1 transition"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Body */}
                <div className="p-3.5 space-y-2.5">
                  <h3 className="text-xs font-bold text-white leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Optional Post Image */}
                {post.imageUrl && (
                  <div className="px-3.5 pb-3">
                    <div className="relative rounded-xl overflow-hidden max-h-56 bg-neutral-950 border border-neutral-800">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                {/* Post Footer Actions */}
                <div className="px-3.5 py-2.5 bg-neutral-950/40 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                      id={`btn-like-${post.id}`}
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition active:scale-95 ${
                        post.hasLiked ? 'text-rose-500 font-bold' : 'text-neutral-400 hover:text-rose-400'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                      />
                      <span>{post.likesCount}</span>
                    </button>

                    {/* Comments Toggle */}
                    <button
                      id={`btn-comment-${post.id}`}
                      onClick={() =>
                        setExpandedCommentsPostId(isCommentsOpen ? null : post.id)
                      }
                      className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-400 font-medium transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{comments.length + post.commentsCount}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText?.(window.location.href);
                      showToast('Post link copied to clipboard!');
                    }}
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Collapsible Comments Section */}
                {isCommentsOpen && (
                  <div className="p-3.5 bg-neutral-950/80 border-t border-neutral-800 space-y-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {comments.length === 0 ? (
                        <p className="text-[11px] text-neutral-500 text-center py-2">
                          No replies yet. Ask a question about this update!
                        </p>
                      ) : (
                        comments.map((c) => (
                          <div
                            key={c.id}
                            className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-2.5 text-xs space-y-0.5"
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-amber-400">{c.author}</span>
                              <span className="text-neutral-500">{c.time}</span>
                            </div>
                            <p className="text-neutral-200 text-xs">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        placeholder="Write a reply or question..."
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 flex items-center justify-center font-bold transition shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
