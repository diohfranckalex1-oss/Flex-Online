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
  Check
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
  like: { label: "J'aime", icon: '👍', color: 'text-blue-600' },
  love: { label: "J'adore", icon: '❤️', color: 'text-rose-500' },
  care: { label: 'Solidaire', icon: '🤗', color: 'text-amber-500' },
  haha: { label: 'Haha', icon: '😂', color: 'text-yellow-500' },
  wow: { label: 'Wouah', icon: '😮', color: 'text-yellow-500' },
  sad: { label: 'Triste', icon: '😢', color: 'text-amber-600' },
  angry: { label: 'Grrr', icon: '😡', color: 'text-red-600' },
};

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser, togglePostReaction, addPostComment, likePostComment } = useApp();
  const [showReactionFlyout, setShowReactionFlyout] = useState(false);
  const [showComments, setShowComments] = useState(false);
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

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'À l’instant';
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return new Date(isoString).toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  return (
    <div id={`post-${post.id}`} className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-10 h-10 rounded-full object-cover border border-neutral-200"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-neutral-900 leading-tight">
                {post.authorName}
              </span>
              {post.authorVerified && (
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
              <span>{formatRelativeTime(post.timestamp)}</span>
              <span>•</span>
              {post.privacy === 'public' ? (
                <Globe className="w-3 h-3 text-neutral-400" />
              ) : (
                <Users className="w-3 h-3 text-neutral-400" />
              )}
            </div>
          </div>
        </div>

        <button className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Text */}
      <div className="px-4 pb-3">
        <p className="text-sm sm:text-base text-neutral-900 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Attached Media */}
      {post.mediaUrl && (
        <div className="w-full bg-neutral-100 max-h-[500px] overflow-hidden flex items-center justify-center">
          <img
            src={post.mediaUrl}
            alt="Contenu multimédia"
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Reaction & Comments stats summary */}
      <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-1.5">
          {post.reactions.length > 0 && (
            <div className="flex items-center -space-x-1">
              {uniqueReactionTypes.map((type) => (
                <span
                  key={type}
                  className="w-5 h-5 rounded-full bg-neutral-50 flex items-center justify-center text-xs shadow-2xs"
                >
                  {REACTION_CONFIG[type].icon}
                </span>
              ))}
            </div>
          )}
          <span className="font-medium">
            {post.reactions.length > 0 ? post.reactions.length : ''}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline font-medium"
          >
            {post.comments.length} commentaire{post.comments.length > 1 ? 's' : ''}
          </button>
          <span>•</span>
          <span className="font-medium">{post.sharesCount} partages</span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="px-2 py-1 flex items-center justify-around border-b border-neutral-100 relative">
        {/* Like button with hover popup */}
        <div
          className="relative flex-1"
          onMouseEnter={() => setShowReactionFlyout(true)}
          onMouseLeave={() => setShowReactionFlyout(false)}
        >
          {/* Reaction Flyout Popup */}
          {showReactionFlyout && (
            <div className="absolute -top-12 left-2 z-30 bg-white rounded-full shadow-xl border border-neutral-200 px-3 py-1.5 flex items-center gap-2 animate-bounce-short">
              {(Object.keys(REACTION_CONFIG) as PostReactionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleSelectReaction(type)}
                  className="text-2xl hover:scale-130 transition-transform duration-150 relative group/icon"
                  title={REACTION_CONFIG[type].label}
                >
                  {REACTION_CONFIG[type].icon}
                </button>
              ))}
            </div>
          )}

          <button
            id={`btn-like-post-${post.id}`}
            onClick={handleToggleDefaultLike}
            className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-colors hover:bg-neutral-100 ${
              userReaction
                ? REACTION_CONFIG[userReaction.type].color
                : 'text-neutral-600'
            }`}
          >
            {userReaction ? (
              <span className="text-base">{REACTION_CONFIG[userReaction.type].icon}</span>
            ) : (
              <ThumbsUp className="w-4 h-4" />
            )}
            <span>{userReaction ? REACTION_CONFIG[userReaction.type].label : "J'aime"}</span>
          </button>
        </div>

        {/* Comment button */}
        <button
          id={`btn-comment-post-${post.id}`}
          onClick={() => setShowComments(!showComments)}
          className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Commenter</span>
        </button>

        {/* Share button */}
        <button
          id={`btn-share-post-${post.id}`}
          onClick={handleShare}
          className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          {copiedShare ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600">Lien copié !</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Partager</span>
            </>
          )}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-neutral-50/50 space-y-3">
          {/* List of comments */}
          {post.comments.length > 0 && (
            <div className="space-y-2.5 mb-3">
              {post.comments.map((comment) => {
                const hasLiked = comment.likes.includes(currentUser.id);
                return (
                  <div key={comment.id} className="flex gap-2.5 items-start">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="bg-neutral-100 rounded-2xl px-3 py-2 inline-block max-w-full">
                        <span className="text-xs font-bold text-neutral-900 block leading-tight">
                          {comment.authorName}
                        </span>
                        <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed break-words">
                          {comment.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-1 ml-2 text-[11px] text-neutral-500 font-medium">
                        <button
                          onClick={() => likePostComment(post.id, comment.id)}
                          className={`hover:underline ${hasLiked ? 'text-emerald-600 font-bold' : ''}`}
                        >
                          J'aime
                        </button>
                        <span>•</span>
                        <span>{formatRelativeTime(comment.timestamp)}</span>
                        {comment.likes.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-neutral-600">
                              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                              {comment.likes.length}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add comment input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Écrivez un commentaire..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full px-3.5 py-2 pr-10 text-xs sm:text-sm bg-neutral-100 border border-neutral-200 rounded-full focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
              {commentInput.trim() && (
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
