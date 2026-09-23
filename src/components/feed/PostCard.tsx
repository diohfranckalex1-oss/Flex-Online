import React, { useState } from 'react';
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Globe, 
  Users, 
  Sparkles, 
  Send, 
  Heart,
  Check,
  Trash2
} from 'lucide-react';
import { Post, PostReactionType } from '../../types';
import { useApp } from '../../context/AppContext';

interface PostCardProps {
  post: Post;
}

const REACTION_CONFIG: Record<
  PostReactionType,
  { label: string; icon: string; color: string }
> = {
  like: { label: "J'aime", icon: '👍', color: 'text-cyan-400' },
  love: { label: "J'adore", icon: '❤️', color: 'text-rose-500' },
  care: { label: 'Solidaire', icon: '🤗', color: 'text-amber-400' },
  haha: { label: 'Haha', icon: '😂', color: 'text-yellow-400' },
  wow: { label: 'Wouah', icon: '😮', color: 'text-yellow-400' },
  sad: { label: 'Triste', icon: '😢', color: 'text-amber-500' },
  angry: { label: 'Grrr', icon: '😡', color: 'text-rose-500' },
};

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { 
    currentUser, 
    togglePostReaction, 
    addPostComment, 
    deletePostComment,
    likePostComment,
    deletePost,
    sharePost
  } = useApp();
  const [showReactionFlyout, setShowReactionFlyout] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  // Check if current user reacted
  const userReaction = post.reactions.find((r) => r.userId === currentUser.id);

  // Group reaction icons for summary
  const uniqueReactionTypes = Array.from(new Set(post.reactions.map((r) => r.type)));

  const handleToggleDefaultLike = () => {
    if (userReaction) {
      togglePostReaction(post.id, userReaction.type);
    } else {
      togglePostReaction(post.id, 'like');
    }
  };

  const handleSelectReaction = (type: PostReactionType) => {
    togglePostReaction(post.id, type);
    setShowReactionFlyout(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addPostComment(post.id, commentInput.trim());
    setCommentInput('');
    setShowComments(true);
  };

  const handleInsertEmoji = (emoji: string) => {
    setCommentInput((prev) => prev + emoji);
  };

  const handleCopyShare = () => {
    sharePost(post.id);
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const formatPostTime = (isoString: string) => {
    const d = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return "À l'instant";
    if (diffSec < 3600) return `Il y a ${Math.floor(diffSec / 60)} min`;
    if (diffSec < 86400) return `Il y a ${Math.floor(diffSec / 3600)} h`;
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  const isAuthor = post.authorId === currentUser.id;

  return (
    <article
      id={`post-card-${post.id}`}
      className="bg-neutral-900 rounded-2xl shadow-xl border border-neutral-800 overflow-hidden text-neutral-100 transition-all hover:border-neutral-700/80"
    >
      {/* Post Header */}
      <div className="p-4 pb-3 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-10 h-10 rounded-2xl object-cover ring-1 ring-indigo-500/40"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-black text-white">{post.authorName}</h4>
              {post.authorVerified && (
                <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded-md font-bold">
                  ✓
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
              <span>{formatPostTime(post.timestamp)}</span>
              <span>•</span>
              {post.privacy === 'public' ? (
                <span className="flex items-center gap-1 text-cyan-400">
                  <Globe className="w-3 h-3 inline" /> Public
                </span>
              ) : (
                <span className="flex items-center gap-1 text-indigo-400">
                  <Users className="w-3 h-3 inline" /> Amis
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl py-1 z-30 animate-scale-in text-xs font-semibold">
              <button
                onClick={() => {
                  handleCopyShare();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-neutral-700 flex items-center gap-2 text-neutral-200"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copier le lien</span>
              </button>
              {isAuthor && (
                <button
                  onClick={() => {
                    deletePost(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-rose-950/60 flex items-center gap-2 text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer le post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Body Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-neutral-100 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Media if any */}
      {post.mediaUrl && (
        <div className="relative bg-neutral-950 max-h-[500px] overflow-hidden">
          <img
            src={post.mediaUrl}
            alt="Publication"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Reactions Summary Bar */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800/80">
        <div className="flex items-center gap-1.5">
          {uniqueReactionTypes.length > 0 && (
            <div className="flex -space-x-1">
              {uniqueReactionTypes.map((type) => (
                <span
                  key={type}
                  className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-xs shadow-xs ring-1 ring-neutral-900"
                >
                  {REACTION_CONFIG[type]?.icon || '👍'}
                </span>
              ))}
            </div>
          )}
          <span>{post.reactions.length} réaction{post.reactions.length > 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-cyan-400 transition-colors font-medium"
          >
            {post.comments.length} commentaire{post.comments.length > 1 ? 's' : ''}
          </button>
          <span>•</span>
          <span>{post.sharesCount} partage{post.sharesCount > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Reaction Actions Toolbar */}
      <div className="px-2 py-1 flex items-center justify-around relative">
        {/* Like Button with hover flyout */}
        <div
          className="relative flex-1"
          onMouseEnter={() => setShowReactionFlyout(true)}
          onMouseLeave={() => setShowReactionFlyout(false)}
        >
          <button
            onClick={handleToggleDefaultLike}
            className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              userReaction
                ? `${REACTION_CONFIG[userReaction.type]?.color || 'text-cyan-400'} bg-neutral-800/80`
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            {userReaction ? (
              <>
                <span className="text-base">{REACTION_CONFIG[userReaction.type]?.icon}</span>
                <span>{REACTION_CONFIG[userReaction.type]?.label}</span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-4 h-4" />
                <span>J'aime</span>
              </>
            )}
          </button>

          {/* Facebook-style floating reaction icons popup */}
          {showReactionFlyout && (
            <div className="absolute bottom-full left-2 mb-1 bg-neutral-800 border border-neutral-700 rounded-full px-2 py-1.5 shadow-2xl flex items-center gap-1.5 z-30 animate-scale-in">
              {(Object.keys(REACTION_CONFIG) as PostReactionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleSelectReaction(type)}
                  className="hover:scale-130 transition-transform p-1 text-lg"
                  title={REACTION_CONFIG[type].label}
                >
                  {REACTION_CONFIG[type].icon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(true)}
          className="flex-1 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-800/50 flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <span>Commenter</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleCopyShare}
          className="flex-1 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-800/50 flex items-center justify-center gap-2 transition-colors"
        >
          {copiedShare ? (
            <>
              <Check className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-bold">Partagé !</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Partager</span>
            </>
          )}
        </button>
      </div>

      {/* Comments Section - Always clean, immediate and problem-free */}
      {showComments && (
        <div className="px-4 py-3 bg-neutral-950/70 border-t border-neutral-800/80 space-y-3">
          {/* Quick Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500/40 shrink-0"
            />
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                placeholder="Écrire un commentaire public..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full pl-3 pr-20 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-hidden focus:border-cyan-400 transition-colors"
              />
              
              {/* Quick Emojis & Send Button */}
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleInsertEmoji('❤️')}
                  className="hover:scale-120 transition-transform text-xs"
                  title="Ajouter ❤️"
                >
                  ❤️
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertEmoji('🔥')}
                  className="hover:scale-120 transition-transform text-xs"
                  title="Ajouter 🔥"
                >
                  🔥
                </button>
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="p-1 rounded-lg text-cyan-400 hover:text-cyan-300 disabled:text-neutral-600 disabled:hover:text-neutral-600 transition-colors"
                  title="Publier le commentaire"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          {post.comments.length > 0 && (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pt-1 pr-1">
              {post.comments.map((comment) => {
                const isCommentAuthor = comment.authorId === currentUser.id;

                return (
                  <div key={comment.id} className="flex items-start gap-2.5 text-xs group">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="bg-neutral-900 border border-neutral-800/80 p-2.5 rounded-2xl rounded-tl-xs">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="font-bold text-white">{comment.authorName}</p>
                          {isCommentAuthor && (
                            <button
                              onClick={() => deletePostComment(post.id, comment.id)}
                              className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-rose-400 transition-opacity p-0.5"
                              title="Supprimer mon commentaire"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-neutral-200 leading-relaxed break-words">{comment.content}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[10px] text-neutral-500 ml-2 mt-1 font-semibold">
                        <button
                          onClick={() => likePostComment(post.id, comment.id)}
                          className={`hover:underline flex items-center gap-1 ${
                            comment.likes.includes(currentUser.id) ? 'text-cyan-400 font-bold' : ''
                          }`}
                        >
                          <span>J'aime</span>
                          {comment.likes.length > 0 && <span>({comment.likes.length})</span>}
                        </button>
                        <span>•</span>
                        <span className="text-neutral-400 font-normal">
                          {formatPostTime(comment.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
};
