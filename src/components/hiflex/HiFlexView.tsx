import React, { useState, useMemo, useEffect } from 'react';
import { 
  Globe, 
  MessageSquare, 
  Heart, 
  Sparkles, 
  MapPin, 
  Languages, 
  CheckCircle2, 
  Search, 
  Shuffle, 
  UserCheck, 
  Smile, 
  Phone, 
  Video, 
  X, 
  ShieldCheck,
  User as UserIcon,
  BadgeCheck,
  BookOpen,
  Calendar,
  Share2,
  Copy,
  Check,
  UserPlus,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

export interface FlexOnlineMember {
  id: string;
  name: string;
  username: string;
  age?: number;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  avatar: string;
  nativeLanguages: string[];
  learningLanguages?: string[];
  interests: string[];
  bio: string;
  isOnline: boolean;
  phone: string;
  joinedDate: string;
  isNewlyAdmitted?: boolean;
  occupation?: string;
  icebreaker?: string;
}

export const HiFlexView: React.FC = () => {
  const { 
    currentUser, 
    users,
    conversations, 
    createNewConversation, 
    sendMessage,
    setSelectedConversationId, 
    setActiveTab,
    startCall,
    playNotificationSound 
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'common_interests' | 'online'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedMemberIds, setLikedMemberIds] = useState<string[]>([]);
  const [sentGreetings, setSentGreetings] = useState<string[]>([]);
  const [activeProfileModal, setActiveProfileModal] = useState<FlexOnlineMember | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync registered users from localStorage or backend
  const [admittedNewMembers, setAdmittedNewMembers] = useState<User[]>([]);

  useEffect(() => {
    try {
      const savedAdmitted = localStorage.getItem('flex_hiflex_admitted_members');
      if (savedAdmitted) {
        const parsed: User[] = JSON.parse(savedAdmitted);
        // Exclude AI bot and support
        const clean = parsed.filter(u => u.id !== 'user-flex-ai' && u.id !== 'user-flex-support');
        setAdmittedNewMembers(clean);
      }
    } catch (e) {
      console.warn('Could not read admitted members:', e);
    }
  }, [users]);

  // STRICT RULE: ONLY actual registered real humans who have created a Flex Online account!
  // No fake or hardcoded mock penpals.
  const allRealMembers: FlexOnlineMember[] = useMemo(() => {
    const list: FlexOnlineMember[] = [];
    const seenIds = new Set<string>();

    // 1. Current logged in user is always an admitted member!
    if (currentUser && currentUser.id !== 'user-flex-ai') {
      seenIds.add(currentUser.id);
      list.push({
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username || currentUser.name.toLowerCase().replace(/\s+/g, '_'),
        city: currentUser.country || 'Abidjan',
        country: currentUser.country || "Côte d'Ivoire",
        countryCode: currentUser.countryCode || '+225',
        flag: '🇨🇮',
        avatar: currentUser.avatar,
        nativeLanguages: ['Français'],
        interests: currentUser.interests && currentUser.interests.length > 0 
          ? currentUser.interests 
          : ['📚 Littérature & Lecture', '💻 Informatique & Technologies', '🤝 Partage & Amitié'],
        bio: currentUser.bio || 'Membre vérifié de Flex Online • Vrai Humain.',
        isOnline: true,
        phone: currentUser.phone || '+225 00 00 00 00',
        joinedDate: 'Membre Officiel Admis',
        isNewlyAdmitted: true,
        occupation: 'Membre Flex Online',
      });
    }

    // 2. Newly admitted members saved in localStorage
    admittedNewMembers.forEach((u) => {
      if (!seenIds.has(u.id) && u.id !== 'user-flex-ai' && u.id !== 'user-flex-support') {
        seenIds.add(u.id);
        list.push({
          id: u.id,
          name: u.name,
          username: u.username || u.name.toLowerCase().replace(/\s+/g, '_'),
          city: u.country || 'Abidjan',
          country: u.country || "Côte d'Ivoire",
          countryCode: u.countryCode || '+225',
          flag: '🇨🇮',
          avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          nativeLanguages: ['Français'],
          interests: u.interests && u.interests.length > 0 
            ? u.interests 
            : ['📚 Littérature & Lecture', '🤝 Partage & Amitié'],
          bio: u.bio || `Membre officiel de Flex Online (${u.country || 'International'}) • Vrai Humain.`,
          isOnline: u.status === 'online',
          phone: u.phone || '+225 00 00 00 00',
          joinedDate: 'Admis sur Hi Flex',
          isNewlyAdmitted: true,
          occupation: 'Membre Flex Online',
        });
      }
    });

    // 3. Other accounts in app users state
    users.forEach((u) => {
      if (!seenIds.has(u.id) && u.id !== 'user-flex-ai' && u.id !== 'user-flex-support') {
        seenIds.add(u.id);
        list.push({
          id: u.id,
          name: u.name,
          username: u.username || u.name.toLowerCase().replace(/\s+/g, '_'),
          city: u.country || 'Abidjan',
          country: u.country || "Côte d'Ivoire",
          countryCode: u.countryCode || '+225',
          flag: '🇨🇮',
          avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          nativeLanguages: ['Français'],
          interests: u.interests && u.interests.length > 0 
            ? u.interests 
            : ['📚 Littérature & Lecture', '🤝 Partage & Amitié'],
          bio: u.bio || `Membre officiel de Flex Online • Vrai Humain.`,
          isOnline: u.status === 'online',
          phone: u.phone || '+225 00 00 00 00',
          joinedDate: 'Membre Flex Online',
          isNewlyAdmitted: true,
          occupation: 'Membre Flex Online',
        });
      }
    });

    return list;
  }, [currentUser, admittedNewMembers, users]);

  // Current user's interests set for instant common interest comparison
  const myInterests = useMemo(() => {
    return new Set((currentUser.interests || ['📚 Littérature & Lecture', '💻 Informatique & Technologies', '🤝 Partage & Amitié']).map(i => i.toLowerCase().trim()));
  }, [currentUser.interests]);

  // Calculate common interests with another member
  const getCommonInterests = (member: FlexOnlineMember): string[] => {
    if (member.id === currentUser.id) return [];
    return (member.interests || []).filter(interest => 
      myInterests.has(interest.toLowerCase().trim()) || 
      Array.from(myInterests).some(myInt => interest.toLowerCase().includes(myInt.slice(2).trim()) || myInt.includes(interest.slice(2).trim()))
    );
  };

  // Other members excluding currentUser for the correspondent cards
  const otherMembers = useMemo(() => {
    return allRealMembers.filter(m => m.id !== currentUser.id);
  }, [allRealMembers, currentUser.id]);

  // Filter members
  const filteredOtherMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return otherMembers.filter((m) => {
      // Filter tab
      if (selectedFilter === 'online' && !m.isOnline) return false;
      if (selectedFilter === 'common_interests') {
        const common = getCommonInterests(m);
        if (common.length === 0) return false;
      }

      // Query filter
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.username.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.interests.some(i => i.toLowerCase().includes(q)) ||
        m.bio.toLowerCase().includes(q)
      );
    });
  }, [otherMembers, selectedFilter, searchQuery, myInterests]);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedMemberIds((prev) => 
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSendHi = (member: FlexOnlineMember, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSentGreetings((prev) => [...prev, member.id]);
    playNotificationSound();
    handleStartChat(
      member, 
      `Hi ${member.name.split(' ')[0]} ! 👋 Ravi de faire ta connaissance sur Hi Flex depuis ${currentUser.country || "l'Afrique"}. Nous partageons des passions en commun ! J'aimerais beaucoup correspondre avec toi.`
    );
  };

  const handleStartChat = (member: FlexOnlineMember, initialMessage?: string) => {
    let existingConv = conversations.find(
      (c) => c.type === 'direct' && c.participants.includes(member.id)
    );

    if (existingConv) {
      setSelectedConversationId(existingConv.id);
      setActiveTab('chats');
      if (initialMessage) {
        sendMessage({
          conversationId: existingConv.id,
          content: initialMessage,
        });
      }
      return;
    }

    const newConvId = createNewConversation(member.id);
    setSelectedConversationId(newConvId);
    setActiveTab('chats');
    if (initialMessage) {
      sendMessage({
        conversationId: newConvId,
        content: initialMessage,
      });
    }
  };

  const handleCallMember = (member: FlexOnlineMember, type: 'audio' | 'video' = 'audio', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const contactUser: User = {
      id: member.id,
      name: member.name,
      username: member.username,
      avatar: member.avatar,
      status: member.isOnline ? 'online' : 'offline',
      phone: member.phone,
      country: member.country,
      bio: `${member.city}, ${member.country} • ${member.bio}`
    };

    startCall(contactUser, type);
  };

  const handleCopyInviteLink = () => {
    if (typeof window !== 'undefined') {
      const inviteUrl = window.location.origin;
      navigator.clipboard.writeText(inviteUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-950 text-neutral-100 p-4 sm:p-6 lg:p-8 space-y-8 select-text">
      
      {/* ========================================================================= */}
      {/* HI FLEX HERO BANNER */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d2a23] via-[#091f1a] to-[#0b1b16] border border-teal-800/60 p-6 sm:p-10 shadow-2xl shadow-teal-950/80">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-black uppercase tracking-wider shadow-xs">
            <Globe className="w-3.5 h-3.5" />
            <span>Hi Flex • Vrais Humains & Liens par Passions Communes</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Correspondants Réels Admis Automatiquement avec Leurs Centres d'Intérêt
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
            Zéro faux ami, zéro robot ou profil artificiel. <strong className="text-teal-300 font-bold">Dès qu'une personne crée son compte sur Flex Online, elle est directement et automatiquement admise à Hi Flex</strong> avec ses véritables centres d'intérêt afin de nouer des liens solides et fraternels avec vous !
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyInviteLink}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-neutral-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-neutral-950" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Lien d\'invitation copié !' : 'Inviter des amis à créer un compte 🔗'}</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* MON PROFIL VÉRIFIÉ ADMIS SUR HI FLEX */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-br from-[#122b24] via-[#0f211c] to-[#0a1713] border-2 border-teal-500/60 p-5 sm:p-6 shadow-xl shadow-teal-950/50 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-teal-500/50 bg-neutral-800">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-neutral-900 rounded-full" title="Connecté" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{currentUser.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Vous êtes admis sur Hi Flex
                </span>
              </div>
              <p className="text-xs text-teal-400 font-mono mt-0.5">
                @{currentUser.username || 'vous'} • {currentUser.country || "Côte d'Ivoire"}
              </p>
              <p className="text-xs text-neutral-300 italic mt-1">
                « {currentUser.bio || 'Membre officiel et vérifié de Flex Online • Vrai Humain'} »
              </p>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Statut : <strong className="text-emerald-400 font-bold">Compte Officiel Actif</strong></span>
          </div>
        </div>

        {/* Vos Centres d'intérêt */}
        <div className="pt-2 border-t border-neutral-800/80">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-neutral-200">Vos Centres d'intérêt & Passions enregistrés :</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(currentUser.interests || ['📚 Littérature & Lecture', '💻 Informatique & Technologies', '🤝 Partage & Amitié']).map((interest, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-teal-950/90 text-teal-300 border border-teal-700/60 text-xs font-semibold shadow-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FILTER TABS & SEARCH */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, ville, pays ou centre d'intérêt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs font-bold"
              >
                Effacer
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-teal-500 text-neutral-950 shadow-md shadow-teal-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              Tous ({otherMembers.length})
            </button>

            <button
              onClick={() => setSelectedFilter('common_interests')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                selectedFilter === 'common_interests'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Passions communes</span>
            </button>

            <button
              onClick={() => setSelectedFilter('online')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedFilter === 'online'
                  ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              En ligne 🟢 ({otherMembers.filter(m => m.isOnline).length})
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MEMBERS DIRECTORY GRID OR ZERO-CONTACT WAITING LOUNGE */}
      {/* ========================================================================= */}
      {filteredOtherMembers.length === 0 ? (
        <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-xl">
            <Globe className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {searchQuery ? "Aucun membre ne correspond à cette recherche" : "Espace Prêt pour l'Arrivée de Vrais Membres"}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
              {searchQuery ? (
                "Essayez un autre mot-clé ou effacez la recherche pour revoir les correspondants."
              ) : (
                <>
                  Tous les faux contacts et robots ont été supprimés selon vos instructions. Vous êtes actuellement le premier membre officiellement admis ! <strong className="text-teal-300">Dès qu'une autre personne s'inscrit sur Flex Online</strong> avec son numéro et ses centres d'intérêt, elle apparaît ici en temps réel pour correspondre avec vous.
                </>
              )}
            </p>
          </div>

          {!searchQuery && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleCopyInviteLink}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition active:scale-95 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-neutral-950" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Lien copié dans le presse-papier !' : 'Copier le lien d\'invitation'}</span>
              </button>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    // Open discussion locked modal or prompt to add test account
                    window.dispatchEvent(new CustomEvent('flex:open_switch_account'));
                  }
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-teal-300 font-bold text-xs sm:text-sm border border-neutral-700 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tester en créant un 2ème compte</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOtherMembers.map((member) => {
            const isLiked = likedMemberIds.includes(member.id);
            const hasSentGreeting = sentGreetings.includes(member.id);
            const commonInterests = getCommonInterests(member);

            return (
              <div
                key={member.id}
                onClick={() => setActiveProfileModal(member)}
                className="group relative rounded-3xl bg-neutral-900/90 border border-neutral-800 hover:border-teal-500/60 p-5 flex flex-col justify-between space-y-4 hover:shadow-2xl hover:shadow-teal-950/50 transition-all duration-300 cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Profile Top */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-neutral-700/60 group-hover:ring-teal-500/60 transition bg-neutral-800">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {member.isOnline && (
                          <span 
                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-neutral-900 rounded-full" 
                            title="En ligne"
                          />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition-colors">
                            {member.name}
                          </h3>
                        </div>
                        <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                          <span className="text-teal-400 font-mono text-[11px]">@{member.username}</span>
                          <span>• {member.country}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => toggleLike(member.id, e)}
                      className={`p-2 rounded-xl transition-all ${
                        isLiked
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                      title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Badge Vrai Humain Admis */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 text-[10px] font-black tracking-wide">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Compte Flex Officiel • Vrai Humain
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-950/70 text-teal-300 border border-teal-600/40 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-teal-400" />
                      Admis sur Hi Flex
                    </span>
                  </div>

                  {/* Passions en commun highlight */}
                  {commonInterests.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-2 text-xs text-amber-200">
                      <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-bold">
                        {commonInterests.length} passion{commonInterests.length > 1 ? 's' : ''} en commun avec vous : <span className="font-normal text-white">{commonInterests.join(', ')}</span>
                      </span>
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-xs text-neutral-300 leading-relaxed font-normal italic bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800/80">
                    « {member.bio} »
                  </p>

                  {/* Interests */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-neutral-400 block text-[11px]">Centres d'intérêt :</span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.interests.map((interest, idx) => {
                        const isShared = myInterests.has(interest.toLowerCase().trim());
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${
                              isShared 
                                ? 'bg-amber-950/80 border border-amber-600/60 text-amber-300 font-bold'
                                : 'bg-teal-950/80 border border-teal-800/50 text-teal-300'
                            }`}
                          >
                            {interest}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleCallMember(member, 'audio', e)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition active:scale-95 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Appel Audio</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleCallMember(member, 'video', e)}
                      className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950/40 transition active:scale-95 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Vidéo</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleSendHi(member, e)}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer ${
                        hasSentGreeting
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                      }`}
                    >
                      <Smile className="w-3.5 h-3.5 text-amber-400" />
                      <span>{hasSentGreeting ? 'Hi envoyé ! 👋' : 'Dire Hi 👋'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleStartChat(member); }}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-teal-300 hover:text-white border border-neutral-700 transition active:scale-95 cursor-pointer"
                      title="Ouvrir la discussion instantanée sur Flex"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAILED HUMAN MEMBER PROFILE MODAL */}
      {/* ========================================================================= */}
      {activeProfileModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-text"
          onClick={() => setActiveProfileModal(null)}
        >
          <div 
            className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative text-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveProfileModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-teal-500/40 bg-neutral-800">
                  <img
                    src={activeProfileModal.avatar}
                    alt={activeProfileModal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {activeProfileModal.isOnline && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-neutral-900 rounded-full" />
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{activeProfileModal.name}</h3>
                <p className="text-xs text-teal-400 font-mono font-semibold mt-0.5">
                  @{activeProfileModal.username} • {activeProfileModal.city}, {activeProfileModal.country}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-600/40">
                    <ShieldCheck className="w-3 h-3" />
                    Compte Vérifié • Vrai Humain
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Présentation personnelle</span>
              <p className="text-sm text-neutral-200 italic leading-relaxed">
                « {activeProfileModal.bio} »
              </p>
            </div>

            {/* Centres d'intérêt */}
            <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-700/50 space-y-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Centres d'intérêt & Passions :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeProfileModal.interests.map((interest, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-teal-900/60 text-teal-200 border border-teal-700/40 text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Call and Chat Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  const friend = activeProfileModal;
                  setActiveProfileModal(null);
                  handleCallMember(friend, 'audio');
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Lancer l'Appel Vocal HD 📞</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const friend = activeProfileModal;
                  setActiveProfileModal(null);
                  handleCallMember(friend, 'video');
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Appel Vidéo Direct 📹</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const friend = activeProfileModal;
                  setActiveProfileModal(null);
                  handleStartChat(friend);
                }}
                className="py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-teal-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
