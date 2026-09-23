import React from 'react';
import { useApp } from '../../context/AppContext';
import { CreatePostBox } from './CreatePostBox';
import { PostCard } from './PostCard';
import { StoriesSection } from '../stories/StoriesSection';
import { FlexLoungeBar } from '../common/FlexLoungeBar';
import { MessageSquare, Phone, Sparkles, UserPlus, Radio, Flame } from 'lucide-react';

export const FeedView: React.FC = () => {
  const { posts, users, currentUser, createNewConversation, startCall } = useApp();

  const otherContacts = users.filter((u) => u.id !== currentUser.id);

  return (
    <div id="feed-view-panel" className="flex-1 overflow-y-auto bg-neutral-950 py-4 px-3 sm:px-6 text-neutral-100">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Audio Chill Lounges Banner */}
          <FlexLoungeBar />

          {/* Stories Horizontal Bar */}
          <StoriesSection />

          {/* Post Creation Box */}
          <CreatePostBox />

          {/* Posts list */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar on Desktop: Active Contacts & Community */}
        <div className="hidden lg:block space-y-4">
          {/* Online Contacts widget */}
          <div className="bg-neutral-900 rounded-2xl p-4 shadow-xl border border-neutral-800">
            <h3 className="font-bold text-sm text-white mb-3 flex items-center justify-between">
              <span>Contacts & Proches</span>
              <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {otherContacts.filter((c) => c.status === 'online').length} en direct
              </span>
            </h3>

            <div className="space-y-2.5">
              {otherContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-2 hover:bg-neutral-800/60 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-700"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-neutral-900 ${
                          contact.status === 'online' ? 'bg-cyan-400' : 'bg-neutral-600'
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-200 truncate">
                        {contact.name}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {contact.status === 'online' ? 'Disponible' : contact.lastSeen || 'Hors ligne'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => createNewConversation(contact.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-cyan-400 hover:bg-neutral-800 transition-colors"
                      title="Écrire un message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => startCall(contact, 'audio')}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-cyan-400 hover:bg-neutral-800 transition-colors"
                      title="Appeler"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusive Flex Online Community Card */}
          <div className="bg-gradient-to-br from-violet-950/80 via-indigo-950 to-neutral-900 border border-indigo-500/20 rounded-2xl p-4.5 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="font-black text-sm tracking-tight">Flex Online</h4>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Votre réseau social & messagerie autonome. Conçu pour échanger sans limites avec vos amis, partager vos moments forts et écouter ensemble.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-300 font-bold bg-cyan-950/60 p-2 rounded-xl border border-cyan-800/40">
              <Flame className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Version Pro exclusive • Mises à jour en continu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
