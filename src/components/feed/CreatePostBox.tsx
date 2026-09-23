import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Smile, 
  Globe, 
  Users, 
  X, 
  Send, 
  Sparkles,
  Camera,
  Flame,
  Music,
  Check,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModerationResult } from '../../utils/moderationFilter';

export const CreatePostBox: React.FC = () => {
  const { currentUser, createPost, validateContent } = useApp();
  const [content, setContent] = useState('');
  const [blockedWarning, setBlockedWarning] = useState<ModerationResult | null>(null);
  const [privacy, setPrivacy] = useState<'public' | 'friends'>('public');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [showFullModal, setShowFullModal] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    let finalContent = content.trim();
    if (selectedVibe && !finalContent.includes(selectedVibe)) {
      finalContent = `${finalContent} ${selectedVibe}`;
    }

    // Bouclier Automatique de Pudeur & Respect Flex
    if (finalContent) {
      const check = validateContent(finalContent);
      if (check.isBlocked) {
        setBlockedWarning(check);
        return;
      }
    }

    createPost({
      content: finalContent,
      mediaUrl: mediaUrl || undefined,
      mediaType: 'image',
      privacy,
    });

    setBlockedWarning(null);
    setContent('');
    setMediaUrl(null);
    setSelectedVibe(null);
    setShowFullModal(false);
  };

  const QUICK_TAGS = [
    { label: '#FlexLife 🔥', tag: '#flexlife' },
    { label: '#Chill ☕', tag: '#chill' },
    { label: '#Musique 🎶', tag: '#musique' },
    { label: '#Tech 💻', tag: '#tech' },
  ];

  return (
    <>
      {/* Instant Inline Post Creator Card */}
      <div id="create-post-card" className="bg-neutral-900 rounded-2xl p-4 shadow-xl border border-neutral-800 mb-4 transition-all hover:border-neutral-700/80">
        <div className="flex items-start gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-2xl object-cover ring-1 ring-indigo-500/50 shrink-0 mt-0.5"
          />

          <div className="flex-1 min-w-0">
            {blockedWarning && (
              <div className="mb-2 p-3 bg-rose-950/95 border border-rose-500 rounded-xl text-white shadow-xl animate-fade-in flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <p className="font-bold text-rose-100">{blockedWarning.reasonTitle}</p>
                  <p className="text-rose-200 mt-0.5">{blockedWarning.explanation}</p>
                  <p className="text-[11px] text-violet-300 mt-1 italic font-semibold">
                    ✦ Flex est un espace d'échange respectueux et bienveillant.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBlockedWarning(null)}
                  className="text-rose-400 hover:text-white p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <textarea
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Quoi de neuf, ${currentUser.name.split(' ')[0]} ? Exprimez-vous ici...`}
              className="w-full bg-neutral-950/80 hover:bg-neutral-950 focus:bg-neutral-950 px-3.5 py-2.5 rounded-xl border border-neutral-800 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-hidden focus:border-indigo-500 transition-colors resize-none"
            />

            {/* Media preview if attached inline */}
            {mediaUrl && (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-neutral-700 max-h-48 bg-neutral-950">
                <img src={mediaUrl} alt="Aperçu photo" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMediaUrl(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-black text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick hashtag suggestions */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar">
              {QUICK_TAGS.map((t) => (
                <button
                  key={t.tag}
                  type="button"
                  onClick={() => {
                    if (!content.includes(t.tag)) {
                      setContent((prev) => (prev ? `${prev} ${t.tag}` : t.tag));
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 text-[11px] font-semibold shrink-0 transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action bar under inline composer */}
        <div className="border-t border-neutral-800/80 mt-3 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-cyan-300 text-xs font-semibold transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setPrivacy(privacy === 'public' ? 'friends' : 'public')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 text-xs font-medium transition-colors"
              title="Modifier la visibilité"
            >
              {privacy === 'public' ? (
                <>
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Public</span>
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Amis</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => handlePublish()}
            disabled={!content.trim() && !mediaUrl}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-40 disabled:hover:from-violet-600 disabled:hover:to-cyan-500 text-white text-xs font-black transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publier</span>
          </button>
        </div>
      </div>
    </>
  );
};
