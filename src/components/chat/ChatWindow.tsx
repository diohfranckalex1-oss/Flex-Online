import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Smile, 
  Paperclip, 
  Send, 
  Mic, 
  Check, 
  CheckCheck, 
  ArrowLeft, 
  Image as ImageIcon, 
  Trash2, 
  Square,
  Sparkles,
  Shield,
  Radio,
  Pin,
  BellOff,
  UserX,
  ShieldAlert,
  X,
  Palette,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, Message } from '../../types';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { checkContentModeration, ModerationResult } from '../../utils/moderationFilter';
import { DEFAULT_WALLPAPERS } from '../../utils/wallpaperPresets';

interface ChatWindowProps {
  onBack?: () => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '🔥', '🎉', '👏', '🙏', '😍', '✨', '🚀', '💯', '😊'];
const REACTION_CHOICES = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

export const ChatWindow: React.FC<ChatWindowProps> = ({ onBack }) => {
  const { 
    selectedConversation, 
    conversationMessages, 
    currentUser, 
    users, 
    sendMessage, 
    toggleMessageReaction, 
    sendTypingStatus,
    startCall,
    typingMap,
    pinnedConversationIds,
    mutedConversationIds,
    blockedUserIds,
    togglePinConversation,
    toggleMuteConversation,
    blockUser,
    unblockUser,
    deleteConversation,
    openProfilePhotoModal,
    fontSize,
    validateContent,
    chatWallpaper,
    setChatWallpaper,
    uploadCustomWallpaper,
    resetChatWallpaper,
  } = useApp();

  const [textInput, setTextInput] = useState('');
  const [blockedWarning, setBlockedWarning] = useState<ModerationResult | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wallpaperFileInputRef = useRef<HTMLInputElement>(null);
  const voiceTimerRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceStreamRef = useRef<MediaStream | null>(null);

  // Vertical scroll handler (detects top and bottom positioning)
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    setShowScrollTop(scrollTop > 250);
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 180);
  };

  // Scroll to bottom smoothly
  const scrollToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleUploadWallpaperFromGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadCustomWallpaper(file);
      setShowWallpaperModal(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages.length]);

  if (!selectedConversation) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-neutral-950 p-8 text-center border-l border-neutral-800 text-neutral-100">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600/30 to-cyan-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4 shadow-xl">
          <Sparkles className="w-10 h-10 text-cyan-400" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">Vos discussions Flex Online</h2>
        <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
          Sélectionnez un contact pour démarrer une session ultra-rapide et chiffrée. Textes, vocaux spatiaux et photos instantanées.
        </p>
        <div className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Chiffrement de bout en bout actif</span>
        </div>
      </div>
    );
  }

  // Get recipient
  const isGroup = selectedConversation.type === 'group';
  const otherUserId = selectedConversation.participants.find((id) => id !== currentUser.id) || selectedConversation.participants[0];
  const directContact: User | undefined = !isGroup ? users.find((u) => u.id === otherUserId) : undefined;

  const title = isGroup ? selectedConversation.name : directContact?.name || 'Contact';
  const avatar = isGroup ? selectedConversation.avatar : directContact?.avatar;
  const isOnline = directContact?.status === 'online';
  const typingUsers = typingMap[selectedConversation.id] || [];
  const isTyping = typingUsers.length > 0;

  const isPinned = pinnedConversationIds.includes(selectedConversation.id) || selectedConversation.pinned;
  const isMuted = mutedConversationIds.includes(selectedConversation.id) || selectedConversation.muted;
  const isContactBlocked = directContact ? blockedUserIds.includes(directContact.id) : false;

  // Handle typing state broadcast
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
    sendTypingStatus(selectedConversation.id, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(selectedConversation.id, false);
    }, 1500);
  };

  // Send Text Message
  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim() && !imagePreviewUrl) return;

    // Bouclier Automatique de Pudeur & Respect Flex Online
    if (textInput.trim()) {
      const check = validateContent(textInput.trim());
      if (check.isBlocked) {
        setBlockedWarning(check);
        return;
      }
    }

    if (imagePreviewUrl) {
      sendMessage({
        conversationId: selectedConversation.id,
        content: textInput.trim() || 'Photo partagée',
        type: 'image',
        mediaUrl: imagePreviewUrl,
      });
      setImagePreviewUrl(null);
      setSelectedImage(null);
    } else {
      sendMessage({
        conversationId: selectedConversation.id,
        content: textInput.trim(),
        type: 'text',
      });
    }

    setTextInput('');
    sendTypingStatus(selectedConversation.id, false);
    setShowEmojiPicker(false);
  };

  // Handle Real Voice Recording with MediaRecorder
  const startVoiceRecording = async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Votre navigateur ne supporte pas l'accès au microphone");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start();
      setIsRecordingVoice(true);
      setVoiceSeconds(0);
      voiceTimerRef.current = setInterval(() => {
        setVoiceSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Permission microphone refusée pour la note vocale:", err);
      alert("Veuillez autoriser l'accès au microphone pour enregistrer un message vocal.");
    }
  };

  const cancelVoiceRecording = () => {
    setIsRecordingVoice(false);
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    setVoiceSeconds(0);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (voiceStreamRef.current) {
      voiceStreamRef.current.getTracks().forEach((t) => t.stop());
      voiceStreamRef.current = null;
    }
  };

  const sendVoiceRecording = () => {
    setIsRecordingVoice(false);
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);

    const duration = Math.max(voiceSeconds, 1);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          sendMessage({
            conversationId: selectedConversation.id,
            content: 'Note vocale Flex',
            type: 'voice',
            voiceDuration: duration,
            mediaUrl: base64Audio,
          });
        };
        reader.readAsDataURL(audioBlob);
      };
      mediaRecorderRef.current.stop();
    } else {
      sendMessage({
        conversationId: selectedConversation.id,
        content: 'Note vocale Flex',
        type: 'voice',
        voiceDuration: duration,
      });
    }

    if (voiceStreamRef.current) {
      voiceStreamRef.current.getTracks().forEach((t) => t.stop());
      voiceStreamRef.current = null;
    }
    setVoiceSeconds(0);
  };

  // Handle Image attachment
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatMessageTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div id="chat-window-panel" className="flex flex-col h-full w-full max-w-full min-w-0 overflow-hidden bg-neutral-950 text-neutral-100 relative">
      {/* Top Chat Header */}
      <div className="px-4 py-2.5 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile back button */}
          <button
            onClick={onBack}
            className="md:hidden p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white"
            title="Retour à la liste"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Contact Avatar (Click to view photo HD) */}
          <div 
            onClick={() => directContact && openProfilePhotoModal(directContact)}
            className="relative shrink-0 cursor-pointer group"
            title="Cliquer pour voir la photo en grand"
          >
            <img
              src={avatar}
              alt={title}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-violet-500/50 group-hover:scale-105 transition-transform"
            />
            {!isGroup && (
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-neutral-900 ${
                  isOnline ? 'bg-violet-400 shadow-xs shadow-violet-400/50' : 'bg-neutral-600'
                }`}
              />
            )}
          </div>

          {/* Contact Details */}
          <div 
            onClick={() => directContact && openProfilePhotoModal(directContact)}
            className="min-w-0 cursor-pointer"
            title="Cliquer pour voir le profil"
          >
            <h2 className="text-base sm:text-lg font-black text-white truncate flex items-center gap-1.5">
              <span>{title}</span>
              {directContact?.verified && (
                <span className="text-[11px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-1.5 py-0.2 rounded-md font-bold">
                  ✓ Vérifié
                </span>
              )}
            </h2>
            <p className="text-xs text-neutral-300 truncate flex items-center gap-1.5">
              {isTyping ? (
                <span className="text-violet-400 font-semibold animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  écrit...
                </span>
              ) : isGroup ? (
                `${selectedConversation.participants.length} membres actifs`
              ) : isOnline ? (
                <span className="text-violet-400 font-semibold">En direct • Voir la photo</span>
              ) : (
                directContact?.lastSeen || 'Déconnecté'
              )}
            </p>
          </div>
        </div>

        {/* Header Call Actions */}
        <div className="flex items-center gap-1">
          {directContact && (
            <>
              <button
                id="btn-call-audio"
                onClick={() => startCall(directContact, 'audio')}
                className="w-9 h-9 rounded-xl hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 flex items-center justify-center transition-colors"
                title="Appel vocal"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                id="btn-call-video"
                onClick={() => startCall(directContact, 'video')}
                className="w-9 h-9 rounded-xl hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 flex items-center justify-center transition-colors"
                title="Appel vidéo"
              >
                <Video className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Header Pin / Mute indicators */}
          {isPinned && (
            <span className="p-1.5 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 hidden sm:flex items-center" title="Discussion épinglée">
              <Pin className="w-3.5 h-3.5" />
            </span>
          )}
          {isMuted && (
            <span className="p-1.5 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40 hidden sm:flex items-center" title="Notifications suspendues (sourdine)">
              <BellOff className="w-3.5 h-3.5" />
            </span>
          )}

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              title="Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-1.5 z-30 text-xs animate-fade-in space-y-0.5">
                <button
                  onClick={() => {
                    togglePinConversation(selectedConversation.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-800 rounded-xl text-neutral-200 text-left font-medium transition"
                >
                  <Pin className="w-4 h-4 text-indigo-400" />
                  <span>{isPinned ? 'Désépingler cette discussion' : 'Épingler cette discussion'}</span>
                </button>

                <button
                  onClick={() => {
                    toggleMuteConversation(selectedConversation.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-800 rounded-xl text-neutral-200 text-left font-medium transition"
                >
                  <BellOff className="w-4 h-4 text-amber-400" />
                  <span>{isMuted ? 'Réactiver les notifications' : 'Suspendre les alertes (Sourdine)'}</span>
                </button>

                {directContact && (
                  <button
                    onClick={() => {
                      if (isContactBlocked) {
                        unblockUser(directContact.id);
                      } else {
                        blockUser(directContact.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-rose-950/40 rounded-xl text-rose-300 text-left font-medium transition"
                  >
                    <UserX className="w-4 h-4 text-rose-400" />
                    <span>{isContactBlocked ? 'Débloquer ce contact' : 'Bloquer ce contact'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowWallpaperModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-800 rounded-xl text-neutral-200 text-left font-medium transition"
                >
                  <Palette className="w-4 h-4 text-violet-400" />
                  <span>Couleur / Fond d'écran</span>
                </button>

                <div className="border-t border-neutral-800 my-1" />

                <button
                  onClick={() => {
                    if (window.confirm('Supprimer définitivement cette discussion ?')) {
                      deleteConversation(selectedConversation.id);
                      if (onBack) onBack();
                    }
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-rose-950/60 rounded-xl text-rose-400 text-left font-medium transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer la discussion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blocked Contact Warning Banner */}
      {isContactBlocked && (
        <div className="bg-rose-950/90 border-b border-rose-800 px-4 py-2.5 flex items-center justify-between z-10 animate-fade-in shadow-inner">
          <div className="flex items-center gap-2 text-xs text-rose-200">
            <UserX className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Vous avez bloqué ce contact. Les notifications et messages sont suspendus.</span>
          </div>
          <button
            onClick={() => directContact && unblockUser(directContact.id)}
            className="px-3 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition shadow-xs shrink-0 ml-2"
          >
            Débloquer
          </button>
        </div>
      )}

      {/* Messages Canvas with Clean Messaging Background & Fluid Vertical Scrolling */}
      <div 
        id="messages-scroll-area" 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain chat-scroll-container p-3 sm:p-5 space-y-3 relative"
        style={{
          backgroundColor: chatWallpaper.type === 'color' ? chatWallpaper.value : undefined,
          backgroundImage: chatWallpaper.type === 'gradient'
            ? chatWallpaper.value
            : chatWallpaper.type === 'image'
              ? `url(${chatWallpaper.value})`
              : undefined,
          backgroundSize: chatWallpaper.type === 'image' ? 'cover' : undefined,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* If custom image wallpaper, add subtle translucent backdrop overlay for pristine readability */}
        {chatWallpaper.type === 'image' && (
          <div className="absolute inset-0 bg-neutral-950/60 pointer-events-none -z-0" />
        )}

        {/* Security watermark */}
        <div className="flex justify-center mb-4">
          <span className="px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-violet-950/80 text-xs text-neutral-300 flex items-center gap-1.5 shadow-sm">
            <Shield className="w-4 h-4 text-violet-400" />
            Protocole sécurisé Flex P2P • Écritures confortables
          </span>
        </div>

        {conversationMessages.map((msg, index) => {
          const isSelf = msg.senderId === currentUser.id;
          const showSenderName = isGroup && !isSelf;
          const textFontSize = fontSize === 'xlarge' ? 'text-lg sm:text-xl' : fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} group relative`}
            >
              {showSenderName && (
                <span className="text-xs font-bold text-violet-300 ml-3 mb-1">
                  {msg.senderName}
                </span>
              )}

              <div className="relative max-w-[85%] sm:max-w-[70%]">
                {/* Bubble Container */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl relative shadow-md transition-all ${
                    isSelf
                      ? 'bg-violet-700 text-white rounded-tr-xs shadow-violet-950/40 border border-violet-600/50'
                      : 'bg-neutral-800 text-neutral-100 rounded-tl-xs border border-neutral-700/80 shadow-black/20'
                  }`}
                >
                  {/* Media attachment: Image */}
                  {msg.type === 'image' && msg.mediaUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden max-h-72">
                      <img
                        src={msg.mediaUrl}
                        alt="Photo partagée"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Voice Note attachment */}
                  {msg.type === 'voice' && (
                    <VoiceNotePlayer duration={msg.voiceDuration || 12} isSelf={isSelf} mediaUrl={msg.mediaUrl} />
                  )}

                  {/* Text content with decency shield */}
                  {msg.type !== 'voice' && (() => {
                    const mod = checkContentModeration(msg.content);
                    if (mod.isBlocked) {
                      return (
                        <div className="p-2.5 rounded-xl bg-neutral-900/95 border border-rose-500/50 text-neutral-200 space-y-1.5 shadow-xs">
                          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                            <span>{mod.reasonTitle}</span>
                          </div>
                          <p className="text-xs text-neutral-300 italic leading-relaxed">
                            Contenu neutralisé automatiquement par le Bouclier de Pudeur & Respect Flex.
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p className={`${textFontSize} font-medium leading-relaxed whitespace-pre-wrap break-words`}>
                        {msg.content}
                      </p>
                    );
                  })()}

                  {/* Message Meta: Time + Delivery Status */}
                  <div
                    className={`flex items-center justify-end gap-1.5 mt-1.5 text-xs ${
                      isSelf ? 'text-violet-200/90' : 'text-neutral-400'
                    }`}
                  >
                    <span>{formatMessageTime(msg.timestamp)}</span>
                    {isSelf && (
                      <span>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-4 h-4 text-violet-300 inline" />
                        ) : (
                          <Check className="w-3.5 h-3.5 inline text-violet-200/80" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Reactions display */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`flex items-center gap-1 mt-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                    <div className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] flex items-center gap-1 shadow-xs">
                      {Array.from(new Set(msg.reactions.map((r) => r.emoji))).map((emoji, i) => (
                        <span key={i}>{emoji}</span>
                      ))}
                      <span className="text-[9px] font-bold text-neutral-400">
                        {msg.reactions.length}
                      </span>
                    </div>
                  </div>
                )}

                {/* Floating Reaction Trigger on Hover */}
                <div
                  className={`absolute top-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-20 ${
                    isSelf ? '-left-20' : '-right-20'
                  }`}
                >
                  <button
                    onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)}
                    className="p-1.5 rounded-full bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 shadow-md text-xs"
                    title="Ajouter une réaction"
                  >
                    <Smile className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reactions Picker Flyout */}
                {activeReactionMsgId === msg.id && (
                  <div
                    className={`absolute bottom-full mb-1 bg-neutral-900 border border-neutral-700 rounded-full px-2 py-1 shadow-2xl flex items-center gap-1.5 z-30 animate-scale-in ${
                      isSelf ? 'right-0' : 'left-0'
                    }`}
                  >
                    {REACTION_CHOICES.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          toggleMessageReaction(msg.id, emoji);
                          setActiveReactionMsgId(null);
                        }}
                        className="hover:scale-125 transition-transform text-sm p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Vertical Scroll Helpers (De bas en haut et de haut en bas) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="absolute top-20 right-4 z-20 px-3 py-1.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white shadow-xl border border-neutral-700/80 flex items-center gap-1.5 text-xs font-bold transition-all backdrop-blur-xs"
          title="Faire défiler vers le haut (Début de la discussion)"
        >
          <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Haut</span>
        </button>
      )}

      {showScrollBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-20 right-4 z-20 px-3.5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-2xl shadow-violet-950/90 border border-violet-400/50 flex items-center gap-1.5 text-xs font-black transition-all animate-bounce"
          title="Faire défiler vers le bas (Derniers messages)"
        >
          <ArrowDown className="w-4 h-4" />
          <span>Derniers messages</span>
        </button>
      )}

      {/* Image Preview attachment Bar */}
      {imagePreviewUrl && (
        <div className="px-4 py-2 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={imagePreviewUrl}
              alt="Aperçu"
              className="w-12 h-12 object-cover rounded-xl border border-neutral-700"
            />
            <div>
              <p className="text-xs font-bold text-white">Image prête à envoyer</p>
              <p className="text-[10px] text-neutral-400">Cliquez sur envoyer</p>
            </div>
          </div>
          <button
            onClick={() => setImagePreviewUrl(null)}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Voice Recording Active Bar */}
      {isRecordingVoice && (
        <div className="p-3 bg-indigo-950/90 border-t border-indigo-800/80 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold text-white">
              Enregistrement en direct ({voiceSeconds}s)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cancelVoiceRecording}
              className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300"
            >
              Annuler
            </button>
            <button
              onClick={sendVoiceRecording}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-black text-white shadow-md"
            >
              Envoyer la note
            </button>
          </div>
        </div>
      )}

      {/* Bouclier Automatique : Alerte de Pudeur & Respect */}
      {blockedWarning && (
        <div className="mx-3 my-2 p-3.5 bg-rose-950/95 border-2 border-rose-500 rounded-2xl text-white shadow-2xl animate-fade-in flex items-start gap-3 z-20">
          <div className="p-2 bg-rose-900/90 rounded-xl shrink-0 text-rose-300">
            <ShieldAlert className="w-5 h-5 text-rose-300" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-black text-rose-100 text-sm flex items-center gap-1.5">
              <span>{blockedWarning.reasonTitle}</span>
            </p>
            <p className="text-rose-200 mt-1 leading-relaxed">
              {blockedWarning.explanation}
            </p>
            <p className="text-[11px] text-violet-300 mt-1.5 font-bold italic">
              ✦ "Flex est fait pour communiquer et dialoguer dans le respect, pas pour s'attaquer aux autres ni porter atteinte à la pudeur."
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setBlockedWarning(null)} 
            className="p-1 text-rose-400 hover:text-white rounded-lg hover:bg-rose-900 transition-colors"
            title="Fermer l'alerte"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Bar or Blocked Notice */}
      {isContactBlocked ? (
        <div className="p-4 bg-neutral-900 border-t border-neutral-800 text-center text-xs text-rose-300 flex items-center justify-center gap-2 font-medium">
          <UserX className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Ce contact est actuellement bloqué. Débloquez-le pour pouvoir échanger.</span>
          <button
            onClick={() => directContact && unblockUser(directContact.id)}
            className="ml-2 px-3 py-1 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-lg transition"
          >
            Débloquer
          </button>
        </div>
      ) : (
        <div className="shrink-0 sticky bottom-0 z-20 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 safe-area-bottom px-2.5 sm:px-5 py-2 sm:py-3 w-full max-w-full box-border">
          <form
            onSubmit={handleSendText}
            className="flex items-center gap-2 sm:gap-3 w-full max-w-4xl mx-auto"
          >
            {/* Main Input Capsule: Flexible, smoothly shrinks, never overflows */}
            <div className="flex-1 min-w-0 flex items-center bg-neutral-950 border border-neutral-800 focus-within:border-violet-500/80 focus-within:ring-2 focus-within:ring-violet-500/20 rounded-full pl-1.5 pr-2 py-1 transition-all shadow-inner">
              {/* Emoji Button */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                  title="Émojis"
                >
                  <Smile className="w-5 h-5 text-neutral-400 hover:text-violet-400 transition-colors" />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-3 p-2 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl grid grid-cols-6 gap-1.5 z-30">
                    {COMMON_EMOJIS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setTextInput((prev) => prev + emoji)}
                        className="p-1.5 text-base hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Text Input - with minWidth: 0 to guarantee it never pushes the mic out */}
              <input
                type="text"
                placeholder="Message..."
                value={textInput}
                onChange={handleInputChange}
                style={{ minWidth: 0 }}
                className="flex-1 w-full min-w-0 px-2 py-2 bg-transparent border-none text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-hidden font-medium"
              />

              {/* Attachment: Image */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors shrink-0"
                title="Joindre une image"
              >
                <Paperclip className="w-5 h-5 text-neutral-400 hover:text-violet-400 transition-colors" />
              </button>
            </div>

            {/* Voice Note or Send Button - 100% FULLY VISIBLE INSIDE SCREEN BOUNDS */}
            <div className="shrink-0 flex items-center justify-center">
              {textInput.trim() || imagePreviewUrl ? (
                <button
                  type="submit"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md shadow-violet-950/80 border border-violet-400/80 ring-2 ring-violet-500/30 shrink-0"
                  title="Envoyer le message"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-violet-600 via-violet-500 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg shadow-violet-900/80 border-2 border-violet-300 ring-2 ring-violet-400/50 shrink-0 group"
                  title="Enregistrer une note vocale"
                >
                  <Mic className="w-5 h-5 text-white group-hover:scale-110 transition-transform drop-shadow-md" />
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Hidden File Input for Gallery Wallpaper Upload */}
      <input
        type="file"
        ref={wallpaperFileInputRef}
        onChange={handleUploadWallpaperFromGallery}
        accept="image/*"
        className="hidden"
      />

      {/* Wallpaper Customizer Modal */}
      {showWallpaperModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl animate-fade-in text-neutral-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-violet-600/20 text-violet-400 rounded-xl">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Tableau de discussion</h3>
                  <p className="text-xs text-neutral-400">Couleurs & Galerie photo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWallpaperModal(false)}
                className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Upload Option */}
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-violet-900/40">
              <p className="text-xs font-bold text-neutral-200 mb-2">Choisir depuis la galerie de votre téléphone :</p>
              <button
                type="button"
                onClick={() => wallpaperFileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-950/60 transition active:scale-98"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Ouvrir la Galerie Photos</span>
              </button>
            </div>

            {/* Presets Grid */}
            <div>
              <p className="text-xs font-bold text-neutral-300 mb-2.5">Couleurs et dégradés élégants :</p>
              <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                {DEFAULT_WALLPAPERS.map((wp) => {
                  const isSelected = chatWallpaper.id === wp.id;
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => setChatWallpaper(wp)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                        isSelected
                          ? 'border-violet-500 bg-violet-950/40 ring-2 ring-violet-500/50'
                          : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700'
                      }`}
                    >
                      <div
                        className="w-full h-9 rounded-lg shadow-inner border border-white/10"
                        style={{
                          background: wp.type === 'gradient' ? wp.value : wp.value,
                        }}
                      />
                      <span className="text-[11px] font-semibold text-neutral-200 truncate w-full">
                        {wp.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  resetChatWallpaper();
                }}
                className="text-neutral-400 hover:text-white underline font-medium"
              >
                Rétablir par défaut
              </button>
              <button
                type="button"
                onClick={() => setShowWallpaperModal(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold transition"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
