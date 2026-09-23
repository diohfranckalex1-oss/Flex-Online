import React, { useState, useRef } from 'react';
import { Plus, Camera, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoryViewerModal } from './StoryViewerModal';

export const StoriesSection: React.FC = () => {
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

  return (
    <>
      {/* Header for Statuts & Stories */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-neutral-300">
            Statuts & Stories Flex (24h)
          </span>
        </div>
        <span className="text-[11px] font-bold text-neutral-400">
          {stories.length} mise{stories.length > 1 ? 's' : ''} à jour
        </span>
      </div>

      <div id="stories-section" className="mb-4 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex gap-2.5 min-w-max">
          {/* Card 1: Mon Statut Flex */}
          <div
            id="card-add-story"
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-44 sm:w-32 sm:h-52 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl cursor-pointer relative group flex flex-col shrink-0 transition-transform active:scale-95"
            title="Appuyez pour publier votre statut Flex"
          >
            <div className="h-3/4 overflow-hidden bg-neutral-950">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
            </div>
            <div className="h-1/4 bg-neutral-900 relative flex items-center justify-center p-2 text-center">
              <div className="absolute -top-4 w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white border-2 border-neutral-900 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-neutral-200 mt-2 truncate">
                Mon statut Flex
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* User Stories */}
          {stories.map((story, index) => (
            <div
              key={story.id}
              id={`story-card-${story.id}`}
              onClick={() => setSelectedStoryIndex(index)}
              className="w-28 h-44 sm:w-32 sm:h-52 rounded-2xl overflow-hidden shadow-xl cursor-pointer relative group shrink-0 transition-transform active:scale-95 ring-1 ring-neutral-800"
            >
              {/* Background Media */}
              <img
                src={story.mediaUrl}
                alt={story.authorName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

              {/* Author Avatar with Glow ring */}
              <div className="absolute top-2.5 left-2.5">
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-400 p-0.5 bg-neutral-900 shadow-md"
                />
              </div>

              {/* Author Name */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <p className="text-xs font-bold text-white truncate drop-shadow-md">
                  {story.authorName}
                </p>
              </div>
            </div>
          ))}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="bg-neutral-900 rounded-3xl max-w-sm w-full overflow-hidden border border-neutral-800 shadow-2xl text-white">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-bold text-sm">Nouvelle Story Flex</h3>
              <button
                onClick={() => setIsCreatingStory(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Annuler
              </button>
            </div>

            <div className="h-80 bg-neutral-950 overflow-hidden relative">
              <img src={storyMedia} alt="Story" className="w-full h-full object-contain" />
            </div>

            <div className="p-4 space-y-3">
              <input
                type="text"
                placeholder="Ajouter une légende..."
                value={storyCaption}
                onChange={(e) => setStoryCaption(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden"
              />
              <button
                onClick={handlePublishStory}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/30"
              >
                Publier la story
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
