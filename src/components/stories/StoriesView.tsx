import React, { useState, useRef } from 'react';
import { Plus, Camera, Sparkles, Clock, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoryViewerModal } from './StoryViewerModal';

export const StoriesView: React.FC = () => {
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
    <div id="stories-view-panel" className="flex-1 overflow-y-auto bg-white max-w-2xl mx-auto w-full p-4 sm:p-6 border-x border-neutral-200 min-h-full">
      {/* My Status Card */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Mon statut
        </h3>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-neutral-50 cursor-pointer transition-colors border border-neutral-200/70 shadow-2xs"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-neutral-300"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900">Ajouter à mon statut</h4>
            <p className="text-xs text-neutral-500">Partagez une photo ou une mise à jour qui disparaît dans 24h</p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Recent Updates */}
      <div>
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Mises à jour récentes ({stories.length})
        </h3>
        <div className="divide-y divide-neutral-100">
          {stories.map((story, idx) => (
            <div
              key={story.id}
              onClick={() => setSelectedStoryIndex(idx)}
              className="py-3 flex items-center gap-3.5 hover:bg-emerald-50/50 px-2 rounded-2xl cursor-pointer transition-colors"
            >
              {/* Avatar with circular status ring */}
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400">
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-13 h-13 rounded-full object-cover border-2 border-white"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-neutral-900 truncate">
                  {story.authorName}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Il y a 2 heures</span>
                  {story.caption && (
                    <>
                      <span>•</span>
                      <span className="truncate max-w-[200px] text-neutral-600 font-medium">
                        {story.caption}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Voir
              </span>
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
                Partager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
