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
    <div id="stories-view-panel" className="flex-1 overflow-y-auto bg-neutral-950 max-w-2xl mx-auto w-full p-4 sm:p-6 border-x border-neutral-800/80 min-h-full text-neutral-100">
      {/* My Status Card */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Mon statut Flex
        </h3>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-850 cursor-pointer transition-colors border border-neutral-800 shadow-xl"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/50"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center ring-2 ring-neutral-900 shadow-xs">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Ajouter à mon statut</h4>
            <p className="text-xs text-neutral-400">Partagez une photo éphémère qui disparaît après 24h</p>
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
        <div className="space-y-2">
          {stories.map((story, index) => (
            <div
              key={story.id}
              onClick={() => setSelectedStoryIndex(index)}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800/60 border border-neutral-800/80 cursor-pointer transition-colors shadow-md"
            >
              <div className="relative">
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-cyan-400 p-0.5"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{story.authorName}</h4>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>
                    {new Date(story.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {story.caption && <span>• {story.caption}</span>}
                </p>
              </div>
              <span className="text-xs text-cyan-400 font-bold px-2.5 py-1 rounded-xl bg-cyan-950/60 border border-cyan-800/40">
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
    </div>
  );
};
