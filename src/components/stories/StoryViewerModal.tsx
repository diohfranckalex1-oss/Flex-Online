import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Heart } from 'lucide-react';
import { Story } from '../../types';
import { useApp } from '../../context/AppContext';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex = 0,
  onClose,
}) => {
  const { sendMessage, createNewConversation } = useApp();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');

  const currentStory = stories[currentIndex];
  const progressIntervalRef = useRef<any>(null);

  // Auto-advance story every 5 seconds (50ms increments)
  useEffect(() => {
    if (!currentStory || isPaused) return;

    setProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPaused, currentStory]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentStory) return;

    const convId = createNewConversation(currentStory.authorId);
    sendMessage({
      conversationId: convId,
      content: `Réponse à la story : "${replyText.trim()}"`,
      type: 'text',
    });

    setReplyText('');
    onClose();
  };

  const handleSendHeart = () => {
    if (!currentStory) return;
    const convId = createNewConversation(currentStory.authorId);
    sendMessage({
      conversationId: convId,
      content: `❤️ Réaction à la story`,
      type: 'text',
    });
    onClose();
  };

  if (!currentStory) return null;

  return (
    <div
      id="story-viewer-modal"
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="relative w-full max-w-md h-full sm:h-[90vh] sm:rounded-3xl overflow-hidden flex flex-col bg-neutral-900 shadow-2xl">
        {/* Story Background Media */}
        <img
          src={currentStory.mediaUrl}
          alt={currentStory.caption || 'Story'}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient dark overlays for readability */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

        {/* Top Progress Segmented Bars */}
        <div className="relative z-20 px-3 pt-3 flex gap-1.5">
          {stories.map((s, idx) => {
            let width = '0%';
            if (idx < currentIndex) width = '100%';
            else if (idx === currentIndex) width = `${progress}%`;

            return (
              <div
                key={s.id}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
                  style={{ width }}
                />
              </div>
            );
          })}
        </div>

        {/* Header: Author & Close */}
        <div className="relative z-20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.authorAvatar}
              alt={currentStory.authorName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
            <div>
              <p className="text-sm font-bold text-white leading-tight">
                {currentStory.authorName}
              </p>
              <p className="text-xs text-white/75 leading-tight">
                Il y a 3 h
              </p>
            </div>
          </div>

          <button
            id="btn-close-story"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Click navigation tap targets */}
        <div className="relative flex-1 z-10 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={handlePrev}
            title="Précédent"
          />
          <div
            className="w-2/3 h-full cursor-pointer"
            onClick={handleNext}
            title="Suivant"
          />
        </div>

        {/* Caption */}
        {currentStory.caption && (
          <div className="relative z-20 px-6 py-2 text-center">
            <p className="text-white text-sm sm:text-base font-medium drop-shadow-md bg-black/40 backdrop-blur-xs py-2 px-4 rounded-xl inline-block max-w-full">
              {currentStory.caption}
            </p>
          </div>
        )}

        {/* Footer: Quick Reply to author in chat */}
        <div className="relative z-20 p-4 pt-2">
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Répondre à ${currentStory.authorName.split(' ')[0]}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm bg-white/20 hover:bg-white/30 focus:bg-white/40 backdrop-blur-md rounded-full text-white placeholder:text-white/70 border border-white/30 focus:outline-hidden transition-all"
            />
            {replyText.trim() ? (
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendHeart}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-rose-400 hover:text-rose-500 hover:scale-110 flex items-center justify-center shrink-0 transition-transform"
                title="Envoyer un cœur"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
