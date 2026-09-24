import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreatePostBox } from './CreatePostBox';
import { PostCard } from './PostCard';
import { StoriesSection } from '../stories/StoriesSection';
import { FlexLoungeBar } from '../common/FlexLoungeBar';
import { MessageSquare, Phone, Sparkles, UserPlus, Radio, Flame, Film, Play, ShieldCheck, Zap, Bot, ArrowRight, HelpCircle } from 'lucide-react';
import { FlexCommercialModal } from '../promo/FlexCommercialModal';
import { FlexAiModal } from '../ai/FlexAiModal';

export const FeedView: React.FC = () => {
  const { posts, users, currentUser, createNewConversation, startCall } = useApp();
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

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

          {/* Official Promotional Video Spotlight Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950/80 via-neutral-900 to-indigo-950/80 border border-violet-800/60 p-4 sm:p-5 shadow-xl shadow-violet-950/40">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div 
                onClick={() => setIsCommercialOpen(true)}
                className="relative w-full sm:w-44 aspect-video sm:aspect-square rounded-2xl overflow-hidden shrink-0 group cursor-pointer border border-violet-500/40 shadow-lg"
              >
                <img 
                  src="/src/assets/images/flex_promo_hero_1790247752884.jpg" 
                  alt="Spot Publicitaire Flex Online"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                  <div className="w-11 h-11 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 text-[10px] font-black px-1.5 py-0.5 rounded bg-black/80 text-violet-300 font-mono">
                  0:35
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-black uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span>Spot Publicitaire Officiel</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Flex Online : La Révolution Facile & Blindée
                </h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Découvrez la pub de présentation officielle (35s) : inscription éclair, chiffrement impénétrable, appels HD et mode 2 comptes.
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCommercialOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-md shadow-violet-900/40 active:scale-95 transition"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Lancer la Pub (35s)</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sécurité 5/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
          {/* Flex IA Assistant Spotlight Widget */}
          <div className="bg-gradient-to-br from-violet-950 via-neutral-900 to-indigo-950 rounded-2xl p-4 shadow-xl border border-violet-800/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1">
                    <span>Flex IA Assistant</span>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </h4>
                  <p className="text-[10px] text-violet-300 font-semibold">Créée par Franck Alex</p>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40">
                Gemini 3.8
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Une question sur la vie, le travail, le code, l'application ou son créateur Franck Alex ? Flex IA vous répond instantanément.
            </p>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-950/60 transition active:scale-95 group"
            >
              <span>Poser une question</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

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

      {/* 35s Official Commercial Video Modal */}
      <FlexCommercialModal
        isOpen={isCommercialOpen}
        onClose={() => setIsCommercialOpen(false)}
      />

      {/* Flex IA Assistant Modal */}
      <FlexAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
