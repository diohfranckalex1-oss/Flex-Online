import React from 'react';
import { useApp } from '../../context/AppContext';
import { CreatePostBox } from './CreatePostBox';
import { PostCard } from './PostCard';
import { StoriesSection } from '../stories/StoriesSection';
import { MessageSquare, Phone, Sparkles, UserPlus } from 'lucide-react';

export const FeedView: React.FC = () => {
  const { posts, users, currentUser, createNewConversation, startCall } = useApp();

  const otherContacts = users.filter((u) => u.id !== currentUser.id);

  return (
    <div id="feed-view-panel" className="flex-1 overflow-y-auto bg-neutral-100/60 py-4 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed Column (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          {/* WhatsApp / Facebook Stories top bar */}
          <StoriesSection />

          {/* "Quoi de neuf ?" Post Creation Box */}
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
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-neutral-200/80">
            <h3 className="font-bold text-sm text-neutral-900 mb-3 flex items-center justify-between">
              <span>Contacts & Proches</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {otherContacts.filter((c) => c.status === 'online').length} en ligne
              </span>
            </h3>

            <div className="space-y-3">
              {otherContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-2 hover:bg-neutral-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          contact.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-300'
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-800 truncate">
                        {contact.name}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {contact.status === 'online' ? 'Disponible' : contact.lastSeen || 'Déconnecté'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => createNewConversation(contact.id)}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Écrire un message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => startCall(contact, 'audio')}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Appeler"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social info card */}
          <div className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-2xl p-4 text-white shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h4 className="font-bold text-sm">Bienvenue sur Flex Online</h4>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed mb-3">
              Communiquez en direct avec vos contacts, partagez vos stories et publiez sur votre fil d'actualité en direct.
            </p>
            <div className="text-[11px] text-emerald-200/90 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Messagerie & fil synchronisés en temps réel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
