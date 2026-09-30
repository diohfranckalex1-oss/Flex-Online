import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreatePostBox } from './CreatePostBox';
import { PostCard } from './PostCard';
import { StoriesSection } from '../stories/StoriesSection';
import { FlexLoungeBar } from '../common/FlexLoungeBar';
import { MessageSquare, Phone, Sparkles, UserPlus, Radio, Flame, ShieldCheck, Zap, Bot, ArrowRight, BookOpen, Layers, Lock } from 'lucide-react';
import { FlexAiModal } from '../ai/FlexAiModal';

export const FeedView: React.FC = () => {
  const { posts, users, currentUser, createNewConversation, startCall, setActiveTab } = useApp();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

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

          {/* Official Flex Online Presentation Showcase Card (Image Presentation, Zero Pub Video) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950/90 via-neutral-900 to-emerald-950/80 border border-teal-600/40 p-4 sm:p-6 shadow-2xl shadow-teal-950/50">
            {/* Top Presentation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 border-b border-teal-800/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Présentation Officielle • Flex Online</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                  <ShieldCheck className="w-3 h-3" />
                  <span>100% Sans Pub</span>
                </span>
              </div>

              {/* Creator Attribution */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-neutral-950/70 border border-teal-800/50 px-2.5 py-1 rounded-2xl">
                <img
                  src="/src/assets/images/franck_alex_dioh_presenter_1790753795291.jpg"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/franck_alex_dioh_presenter_1790753795291.jpg';
                  }}
                  alt="Franck Alex Dioh"
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-teal-400"
                />
                <span className="text-[11px] text-neutral-200 font-bold">
                  Franck Alex (21 ans)
                </span>
              </div>
            </div>

            {/* Main Showcase Visual & Highlights */}
            <div className="space-y-4">
              {/* High-Resolution Presentation Banner Image */}
              <div 
                onClick={() => setIsPreviewModalOpen(true)}
                className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden group cursor-pointer border border-teal-500/40 shadow-xl bg-neutral-950"
              >
                <img
                  src="/flex_online_presentation.jpg"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/src/assets/images/flex_online_presentation_1790756532150.jpg';
                  }}
                  alt="Présentation officielle Flex Online - Nouvelle Version Travaillée"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                {/* Visual Label Badges */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="text-base sm:text-xl font-black text-white drop-shadow-md">
                      Flex Online : La Nouvelle Version Travaillée
                    </h3>
                    <p className="text-[11px] sm:text-xs text-teal-200 drop-shadow-sm font-medium mt-0.5">
                      Messagerie chiffrée, appels HD sans coupure, 2 comptes sur smartphone & bibliothèque certifiée
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-xs text-[10px] text-teal-300 font-bold border border-teal-500/30">
                    Aperçu HD
                  </span>
                </div>
              </div>

              {/* Four Pillar Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-teal-900/60 text-left">
                  <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs mb-1">
                    <Phone className="w-3.5 h-3.5 text-teal-300" />
                    <span>Appels Vidéo HD</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Décrocher et raccrocher instantanément sans coupure.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-teal-900/60 text-left">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Flex Library</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    100 chefs-d’œuvre certifiés conformes (BnF / UNESCO).
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-teal-900/60 text-left">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs mb-1">
                    <Layers className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Mode 2 Comptes</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    2 profils sur le même smartphone & synchronisation PC.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-teal-900/60 text-left">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs mb-1">
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Sécurité SIM</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Chiffrement total, zéro pub et clé de secours d’urgence.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('library')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:opacity-95 text-white text-xs font-black rounded-xl shadow-md shadow-teal-950/50 active:scale-95 transition cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explorer la Bibliothèque Certifiée (100 œuvres)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('chats')}
                  className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-teal-300 text-xs font-bold rounded-xl border border-teal-800/60 active:scale-95 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                  <span>Messagerie & Appels</span>
                </button>
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
          {/* Flex IA Assistant Spotlight Widget with Robot Avatar */}
          <div className="bg-gradient-to-br from-teal-950 via-neutral-900 to-[#0c1614] rounded-2xl p-4 shadow-xl border border-teal-800/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-teal-400/60 shrink-0 shadow-md bg-[#0d1815]">
                  <img 
                    src="/src/assets/images/flex_ai_robot_avatar_1790413735699.jpg" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/flex_ai_robot_avatar.jpg';
                    }}
                    alt="Robot Flex IA" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1">
                    <span>Flex IA Assistant</span>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </h4>
                  <p className="text-[10px] text-teal-300 font-semibold">Créée par Franck Alex</p>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Polymath 3.8
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Sciences, mathématiques, histoire, médecine, philosophie, géographie, informatique ou conseils : Flex IA répond à tout !
            </p>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:opacity-90 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-950/60 transition active:scale-95 group"
            >
              <span>Poser une question</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Online Contacts widget */}
          <div className="bg-neutral-900 rounded-2xl p-4 shadow-xl border border-neutral-800">
            <h3 className="font-bold text-sm text-white mb-3 flex items-center justify-between">
              <span>Contacts & Proches</span>
              <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/80 border border-teal-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
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
          <div className="bg-gradient-to-br from-teal-950/80 via-[#112722] to-neutral-900 border border-teal-500/20 rounded-2xl p-4.5 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <h4 className="font-black text-sm tracking-tight">Flex Online</h4>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Votre réseau social & messagerie autonome. Conçu pour échanger sans limites avec vos amis, partager vos moments forts et écouter ensemble.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-300 font-bold bg-teal-950/60 p-2 rounded-xl border border-teal-800/40">
              <Flame className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Version Pro exclusive • Mises à jour en continu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Preview for Full HD Presentation Banner */}
      {isPreviewModalOpen && (
        <div 
          onClick={() => setIsPreviewModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div className="relative max-w-4xl w-full bg-neutral-900 rounded-3xl overflow-hidden border border-teal-600/40 shadow-2xl p-2">
            <img
              src="/flex_online_presentation.jpg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/src/assets/images/flex_online_presentation_1790756532150.jpg';
              }}
              alt="Présentation Flex Online HD"
              className="w-full h-auto rounded-2xl object-cover"
            />
            <div className="p-4 flex items-center justify-between text-neutral-200">
              <div>
                <p className="font-black text-sm text-white">Flex Online • Version Officielle</p>
                <p className="text-xs text-neutral-400">Architecture ultra-rapide, sécurisée par puce SIM et sans aucune publicité</p>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flex IA Modal */}
      <FlexAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
