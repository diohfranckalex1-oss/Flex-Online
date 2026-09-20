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
      <div id="stories-section" className="mb-4 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex gap-2.5 min-w-max">
          {/* Card 1: Add Story */}
          <div
            id="card-add-story"
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-44 sm:w-32 sm:h-52 rounded-2xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs cursor-pointer relative group flex flex-col shrink-0 transition-transform active:scale-95"
          >
            <div className="h-3/4 overflow-hidden bg-neutral-100">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="h-1/4 bg-white relative flex items-center justify-center p-2 text-center">
              <div className="absolute -top-4 w-8 h-8 rounded-full bg-emerald-600 text-white border-2 border-white flex items-center justify-center shadow-xs">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-neutral-800 mt-2 truncate">
                Créer une story
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

          {/* Contact Stories Cards */}
          {stories.map((story, idx) => (
            <div
              key={story.id}
              id={`story-card-${story.id}`}
              onClick={() => setSelectedStoryIndex(idx)}
              className="w-28 h-44 sm:w-32 sm:h-52 rounded-2xl overflow-hidden shadow-xs cursor-pointer relative group shrink-0 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Background media preview */}
              <img
                src={story.mediaUrl}
                alt={story.authorName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Author avatar with emerald ring */}
              <div className="absolute top-2.5 left-2.5">
                <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-300 shadow-md">
                  <img
                    src={story.authorAvatar}
                    alt={story.authorName}
                    className="w-full h-full rounded-full object-cover border-2 border-neutral-900"
                  />
                </div>
              </div>

              {/* Author name on bottom */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <p className="text-white text-xs font-bold truncate drop-shadow-md">
                  {story.authorName}
                </p>
                {story.caption && (
                  <p className="text-white/80 text-[10px] truncate">
                    {story.caption}
                  </p>
                )}
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

      {/* Publish Story Dialog */}
      {isCreatingStory && storyMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl p-5 border border-neutral-200">
            <h3 className="font-bold text-base text-neutral-900 mb-3">Nouvelle story</h3>
            <div className="h-64 rounded-2xl overflow-hidden mb-3 bg-neutral-100">
              <img src={storyMedia} alt="Aperçu" className="w-full h-full object-cover" />
            </div>
            <input
              type="text"
              placeholder="Ajoutez une légende facultative..."
              value={storyCaption}
              onChange={(e) => setStoryCaption(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-neutral-100 border border-neutral-200 rounded-xl mb-4 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsCreatingStory(false);
                  setStoryMedia(null);
                }}
                className="flex-1 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handlePublishStory}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs"
              >
                Partager la story
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
