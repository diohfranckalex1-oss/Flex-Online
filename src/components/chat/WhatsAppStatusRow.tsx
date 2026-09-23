import React, { useRef, useState } from 'react';
import { Plus, Camera, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoryViewerModal } from '../stories/StoryViewerModal';

interface WhatsAppStatusRowProps {
  onOpenAllStatus?: () => void;
}

export const WhatsAppStatusRow: React.FC<WhatsAppStatusRowProps> = ({ onOpenAllStatus }) => {
  const { stories, currentUser, createStory } = useApp();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [storyCaption, setStoryCaption] = useState('');
  const [storyMedia, setStoryMedia] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoryMedia(reader.result as string);
        setIsCreatingStory(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishStory = () => {
    if (!storyMedia) return;
    createStory(storyMedia, storyCaption.trim() || undefined);
    setStoryMedia(null);
    setStoryCaption('');
    setIsCreatingStory(false);
  };

  const myStories = stories.filter((s) => s.authorId === currentUser.id);
  const othersStories = stories.filter((s) => s.authorId !== currentUser.id);

  return (
    <>
      <div className="px-3.5 py-2.5 bg-neutral-950/60 border-b border-neutral-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Statuts récents (24h)</span>
          </span>
          {stories.length > 0 && (
            <button
              onClick={onOpenAllStatus}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Voir tout ({stories.length})
            </button>
          )}
        </div>

        {/* Horizontal Status Circles */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
          {/* User's My Status Circle */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div
              id="btn-add-my-status"
              onClick={() => {
                if (myStories.length > 0) {
                  const idx = stories.findIndex((s) => s.id === myStories[0].id);
                  if (idx !== -1) setSelectedStoryIndex(idx);
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="relative cursor-pointer group"
              title={myStories.length > 0 ? "Voir ou ajouter un statut" : "Ajouter à mon statut"}
            >
              <div className={`w-12 h-12 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                myStories.length > 0
                  ? 'bg-gradient-to-tr from-emerald-400 via-cyan-400 to-indigo-500'
                  : 'bg-neutral-800'
              }`}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full rounded-full object-cover ring-2 ring-neutral-900"
                />
              </div>

              {/* Plus badge */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black flex items-center justify-center ring-2 ring-neutral-900 shadow-sm"
                title="Ajouter une photo à mon statut"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
              </button>
            </div>
            <span className="text-[10px] font-bold text-neutral-300 max-w-[56px] truncate text-center">
              Mon statut
            </span>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Divider */}
          {othersStories.length > 0 && (
            <div className="h-9 w-px bg-neutral-800 shrink-0 mx-0.5" />
          )}

          {/* Friends' Status Circles */}
          {othersStories.map((story) => {
            const storyIndex = stories.findIndex((s) => s.id === story.id);

            return (
              <div
                key={story.id}
                id={`status-item-${story.id}`}
                onClick={() => setSelectedStoryIndex(storyIndex)}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-violet-500 group-hover:scale-105 transition-transform shadow-xs">
                  <img
                    src={story.authorAvatar}
                    alt={story.authorName}
                    className="w-full h-full rounded-full object-cover ring-2 ring-neutral-900"
                  />
                </div>
                <span className="text-[10px] font-medium text-neutral-200 max-w-[56px] truncate text-center">
                  {story.authorName.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}

      {/* Story Creator Modal */}
      {isCreatingStory && storyMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in">
          <div className="bg-neutral-900 rounded-3xl max-w-sm w-full overflow-hidden border border-neutral-800 shadow-2xl text-white animate-scale-in">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <h3 className="font-black text-sm">Ajouter à mon statut</h3>
              </div>
              <button
                onClick={() => setIsCreatingStory(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1"
              >
                Fermer
              </button>
            </div>

            <div className="h-72 bg-neutral-950 overflow-hidden relative flex items-center justify-center">
              <img src={storyMedia} alt="Aperçu Statut" className="w-full h-full object-contain" />
            </div>

            <div className="p-4 space-y-3">
              <input
                type="text"
                placeholder="Ajouter une légende à votre statut..."
                value={storyCaption}
                onChange={(e) => setStoryCaption(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500"
              />

              <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
                <span>Visible par vos contacts pendant 24 heures</span>
              </div>

              <button
                onClick={handlePublishStory}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-neutral-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                Diffuser mon statut
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
