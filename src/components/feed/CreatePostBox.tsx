import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Smile, Globe, Users, X, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreatePostBox: React.FC = () => {
  const { currentUser, createPost } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends'>('public');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    createPost({
      content: content.trim(),
      mediaUrl: mediaUrl || undefined,
      mediaType: 'image',
      privacy,
    });

    setContent('');
    setMediaUrl(null);
    setIsOpen(false);
  };

  return (
    <>
      {/* Feed Trigger Card */}
      <div id="create-post-card" className="bg-white rounded-2xl p-4 shadow-xs border border-neutral-200/80 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border border-neutral-200"
          />
          <button
            id="btn-open-create-post"
            onClick={() => setIsOpen(true)}
            className="flex-1 text-left px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200/70 text-neutral-500 rounded-full text-sm font-medium transition-colors"
          >
            Quoi de neuf, {currentUser.name.split(' ')[0]} ?
          </button>
        </div>

        <div className="border-t border-neutral-100 mt-3 pt-3 flex items-center justify-around text-xs font-semibold text-neutral-600">
          <button
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => fileInputRef.current?.click(), 100);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-neutral-100 transition-colors text-emerald-700"
          >
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>Photo / vidéo</span>
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-neutral-100 transition-colors text-amber-600"
          >
            <Smile className="w-4 h-4 text-amber-500" />
            <span>Humeur / Activité</span>
          </button>
        </div>
      </div>

      {/* Modal Dialog for composing post */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-neutral-200">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 text-base">Créer une publication</h3>
              <button
                id="btn-close-create-post"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Author bar & audience selector */}
            <form onSubmit={handleSubmit}>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">{currentUser.name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <button
                        type="button"
                        onClick={() => setPrivacy(privacy === 'public' ? 'friends' : 'public')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 hover:bg-neutral-200 text-xs font-medium transition-colors"
                      >
                        {privacy === 'public' ? (
                          <>
                            <Globe className="w-3 h-3 text-neutral-500" />
                            Public
                          </>
                        ) : (
                          <>
                            <Users className="w-3 h-3 text-neutral-500" />
                            Amis uniquement
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Text area */}
                <textarea
                  id="textarea-post-content"
                  autoFocus
                  rows={4}
                  placeholder={`Qu'avez-vous en tête, ${currentUser.name.split(' ')[0]} ?`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-neutral-900 placeholder:text-neutral-400 text-sm sm:text-base border-none resize-none focus:outline-hidden p-1"
                />

                {/* Media preview */}
                {mediaUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-neutral-200 max-h-64">
                    <img src={mediaUrl} alt="Publication" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setMediaUrl(null)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Attachment bar */}
                <div className="border border-neutral-200 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700">Ajouter à votre publication</span>
                  <div className="flex items-center gap-2">
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
                      className="p-2 rounded-full hover:bg-emerald-50 text-emerald-600 transition-colors"
                      title="Ajouter une photo"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="p-4 pt-0">
                <button
                  type="submit"
                  id="btn-submit-post"
                  disabled={!content.trim() && !mediaUrl}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
