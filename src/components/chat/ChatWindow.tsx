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
  ArrowUp,
  Bot,
  BarChart2,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Plus,
  Search,
  ChevronUp,
  ChevronDown,
  FileText,
  Download,
  Star,
  File
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, Message } from '../../types';
import { FLEX_AI } from '../../data/initialData';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { checkContentModeration, ModerationResult } from '../../utils/moderationFilter';
import { DEFAULT_WALLPAPERS } from '../../utils/wallpaperPresets';

interface ChatWindowProps {
  onBack?: () => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '🔥', '🎉', '👏', '🙏', '😍', '✨', '🚀', '💯', '😊'];
const REACTION_CHOICES = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

const renderFormattedMessage = (content: string, textFontSize: string, isSelf: boolean) => {
  if (!content.includes('```') && !content.includes('**') && !content.includes('`') && !content.includes('•')) {
    return (
      <p className={`${textFontSize} font-medium leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word] select-text`}>
        {content}
      </p>
    );
  }

  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`${textFontSize} font-medium leading-relaxed break-words [overflow-wrap:anywhere] [word-break:break-word] select-text space-y-1.5`}>
      {parts.map((part, pIdx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const lang = firstLineEnd > 3 ? part.substring(3, firstLineEnd).trim() : '';
          const code = firstLineEnd > 3 ? part.substring(firstLineEnd + 1, part.length - 3) : part.substring(3, part.length - 3);

          return (
            <div key={pIdx} className="my-2 rounded-xl bg-[#081210] border border-teal-800/60 overflow-hidden font-mono text-xs">
              {lang && (
                <div className="px-3 py-1 bg-teal-950/80 border-b border-teal-900/60 text-[10px] font-bold text-teal-300">
                  {lang.toUpperCase()}
                </div>
              )}
              <pre className="p-3 overflow-x-auto text-teal-100 font-mono leading-relaxed select-text text-xs">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        const paragraphs = part.split('\n');
        return (
          <React.Fragment key={pIdx}>
            {paragraphs.map((para, idx) => {
              if (!para.trim()) return <div key={idx} className="h-1" />;

              const boldFormatted = para.split(/(\*\*.*?\*\*)/g).map((seg, sIdx) => {
                if (seg.startsWith('**') && seg.endsWith('**')) {
                  return (
                    <strong key={sIdx} className={`font-black ${isSelf ? 'text-white' : 'text-teal-200'}`}>
                      {seg.substring(2, seg.length - 2)}
                    </strong>
                  );
                }
                return seg.split(/(`.*?`)/g).map((sub, subIdx) => {
                  if (sub.startsWith('`') && sub.endsWith('`')) {
                    return (
                      <code key={subIdx} className="px-1.5 py-0.5 rounded-md bg-teal-950 text-teal-200 border border-teal-800/60 font-mono text-[11px]">
                        {sub.substring(1, sub.length - 1)}
                      </code>
                    );
                  }
                  return sub;
                });
              });

              if (para.trim().startsWith('•') || para.trim().startsWith('-')) {
                return (
                  <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
                    <span className="text-teal-400 font-bold shrink-0 mt-0.5">•</span>
                    <div className="flex-1 leading-relaxed">{boldFormatted}</div>
                  </div>
                );
              }

              return (
                <p key={idx} className="my-0.5 leading-relaxed">
                  {boldFormatted}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

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
    aiThinkingMap,
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
    votePoll,
    createPollMessage,
    translateMessage,
    markViewOnceOpened,
    toggleStarMessage,
  } = useApp();

  const [textInput, setTextInput] = useState('');
  const [blockedWarning, setBlockedWarning] = useState<ModerationResult | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    size: string;
    url: string;
  } | null>(null);
  const [isViewOnceSelected, setIsViewOnceSelected] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [viewOnceModalImage, setViewOnceModalImage] = useState<{ url: string; msgId: string } | null>(null);
  const [translatingMsgId, setTranslatingMsgId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [showStarredModal, setShowStarredModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
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
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-600/30 to-emerald-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-4 shadow-xl">
          <Sparkles className="w-10 h-10 text-teal-400" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">Vos discussions Flex Online</h2>
        <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
          Sélectionnez un contact pour démarrer une session ultra-rapide et chiffrée. Textes, vocaux spatiaux et photos instantanées.
        </p>
        <div className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
          <Shield className="w-3.5 h-3.5 text-teal-400" />
          <span>Chiffrement de bout en bout actif</span>
        </div>
      </div>
    );
  }

  // Determine if this is an AI chat first
  const isAiChat = selectedConversation.id === 'conv-ai-assistant' ||
    selectedConversation.id.startsWith('conv-ai-') ||
    selectedConversation.participants.includes('user-flex-ai');

  const isGroup = !isAiChat && selectedConversation.type === 'group';
  const otherUserId = isAiChat
    ? 'user-flex-ai'
    : (selectedConversation.participants.find((id) => id !== currentUser.id) || selectedConversation.participants[0]);

  const directContact: User | undefined = isAiChat
    ? (users.find((u) => u.id === 'user-flex-ai') || FLEX_AI)
    : (!isGroup ? users.find((u) => u.id === otherUserId) : undefined);

  const title = isAiChat ? 'Flex IA Assistant' : (isGroup ? selectedConversation.name : directContact?.name || 'Contact');
  const avatar = isAiChat ? '/src/assets/images/flex_ai_robot_avatar_1790413735699.jpg' : (isGroup ? selectedConversation.avatar : directContact?.avatar);
  const isOnline = isAiChat ? true : directContact?.status === 'online';
  const typingUsers = typingMap[selectedConversation.id] || [];
  const isTyping = typingUsers.length > 0;
  const isAiThinking = (isAiChat && Boolean(aiThinkingMap[selectedConversation.id])) || (isAiChat && isTyping);

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

  // Helper to format file sizes nicely
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  // Handle Document Attachment
  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("La taille maximale d'un document est de 20 Mo.");
        return;
      }
      const formattedSize = formatFileSize(file.size);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedDocument({
          name: file.name,
          size: formattedSize,
          url: reader.result as string,
        });
        setShowAttachmentMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Search in conversation matches
  const matchIds = searchQuery.trim()
    ? conversationMessages
        .filter((m) =>
          (m.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.fileName || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((m) => m.id)
    : [];

  const scrollToMessage = (msgId: string) => {
    const el = document.getElementById(`msg-bubble-${msgId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-amber-400');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-amber-400');
      }, 2000);
    }
  };

  const handlePrevMatch = () => {
    if (matchIds.length === 0) return;
    const nextIdx = (currentMatchIndex - 1 + matchIds.length) % matchIds.length;
    setCurrentMatchIndex(nextIdx);
    scrollToMessage(matchIds[nextIdx]);
  };

  const handleNextMatch = () => {
    if (matchIds.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % matchIds.length;
    setCurrentMatchIndex(nextIdx);
    scrollToMessage(matchIds[nextIdx]);
  };

  useEffect(() => {
    if (searchQuery.trim() && matchIds.length > 0) {
      setCurrentMatchIndex(0);
      scrollToMessage(matchIds[0]);
    }
  }, [searchQuery]);

  const starredMessages = conversationMessages.filter((m) => m.isStarred);

  // Send Text / Document / Image Message
  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim() && !imagePreviewUrl && !selectedDocument) return;

    // Bouclier Automatique de Pudeur & Respect Flex Online
    if (textInput.trim()) {
      const check = validateContent(textInput.trim());
      if (check.isBlocked) {
        setBlockedWarning(check);
        return;
      }
    }

    if (selectedDocument) {
      sendMessage({
        conversationId: selectedConversation.id,
        content: textInput.trim() || `📄 ${selectedDocument.name}`,
        type: 'text',
        mediaUrl: selectedDocument.url,
        fileName: selectedDocument.name,
        fileSize: selectedDocument.size,
      });
      setSelectedDocument(null);
    } else if (imagePreviewUrl) {
      sendMessage({
        conversationId: selectedConversation.id,
        content: textInput.trim() || (isViewOnceSelected ? '📷 Photo à vue unique' : 'Photo partagée'),
        type: 'image',
        mediaUrl: imagePreviewUrl,
        viewOnce: isViewOnceSelected,
      });
      setImagePreviewUrl(null);
      setSelectedImage(null);
      setIsViewOnceSelected(false);
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
    setShowAttachmentMenu(false);
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim()) return;
    const validOpts = pollOptions.map((o) => o.trim()).filter((o) => o.length > 0);
    if (validOpts.length < 2) return;

    createPollMessage(selectedConversation.id, pollQuestion.trim(), validOpts);
    setShowPollModal(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleUpdatePollOption = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
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
            onClick={() => {
              if (isAiChat) {
                openProfilePhotoModal(FLEX_AI);
              } else if (directContact) {
                openProfilePhotoModal(directContact);
              }
            }}
            className="relative shrink-0 cursor-pointer group"
            title={isAiChat ? "Profil officiel de Flex IA" : "Cliquer pour voir la photo en grand"}
          >
            <img
              src={avatar}
              alt={title}
              className={`w-11 h-11 rounded-2xl object-cover ring-2 ${isAiChat ? 'ring-teal-400 shadow-md shadow-teal-950/50' : 'ring-teal-500/50'} group-hover:scale-105 transition-transform`}
            />
            {!isGroup && (
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-neutral-900 ${
                  isOnline ? 'bg-teal-400 shadow-xs shadow-teal-400/50' : 'bg-neutral-600'
                }`}
              />
            )}
          </div>

          {/* Contact Details */}
          <div 
            onClick={() => {
              if (isAiChat) {
                openProfilePhotoModal(FLEX_AI);
              } else if (directContact) {
                openProfilePhotoModal(directContact);
              }
            }}
            className="min-w-0 cursor-pointer"
            title={isAiChat ? "Profil officiel de Flex IA" : "Cliquer pour voir le profil"}
          >
            <h2 className="text-base sm:text-lg font-black text-white truncate flex items-center gap-1.5">
              <span>{title}</span>
              {isAiChat ? (
                <span className="text-[10px] bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-2 py-0.5 rounded-full font-black shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  <span>IA Officielle</span>
                </span>
              ) : directContact?.verified ? (
                <span className="text-[11px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.2 rounded-md font-bold">
                  ✓ Vérifié
                </span>
              ) : null}
            </h2>
            <p className="text-xs text-neutral-300 truncate flex items-center gap-1.5">
              {isAiThinking ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/25 text-teal-300 border border-teal-500/40 text-xs font-black animate-pulse shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-spin" />
                  <span>Thinking... Flex IA formule sa réponse</span>
                </span>
              ) : isTyping ? (
                <span className="text-teal-400 font-semibold animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  écrit...
                </span>
              ) : isAiChat ? (
                <span className="text-teal-300 font-semibold">Créée par Franck Alex • Répond à tout 24/7</span>
              ) : isGroup ? (
                `${selectedConversation.participants.length} membres actifs`
              ) : isOnline ? (
                <span className="text-teal-400 font-semibold">En direct • Voir la photo</span>
              ) : (
                directContact?.lastSeen || 'Déconnecté'
              )}
            </p>
          </div>
        </div>

        {/* Header Call Actions */}
        <div className="flex items-center gap-1">
          {directContact && !isAiChat && (
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
            <span className="p-1.5 rounded-xl bg-teal-950/60 text-teal-400 border border-teal-800/40 hidden sm:flex items-center" title="Discussion épinglée">
              <Pin className="w-3.5 h-3.5" />
            </span>
          )}
          {isMuted && (
            <span className="p-1.5 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40 hidden sm:flex items-center" title="Notifications suspendues (sourdine)">
              <BellOff className="w-3.5 h-3.5" />
            </span>
          )}

          {/* Search in chat toggle button */}
          <button
            id="btn-search-messages"
            onClick={() => {
              setIsSearching((prev) => !prev);
              if (!isSearching) {
                setTimeout(() => searchInputRef.current?.focus(), 150);
              } else {
                setSearchQuery('');
              }
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isSearching
                ? 'bg-teal-600 text-white shadow-xs'
                : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title="Rechercher dans la discussion"
          >
            <Search className="w-4 h-4" />
          </button>

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
                    setShowStarredModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-800 rounded-xl text-neutral-200 text-left font-medium transition"
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Messages importants ({starredMessages.length})</span>
                </button>

                <button
                  onClick={() => {
                    togglePinConversation(selectedConversation.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-800 rounded-xl text-neutral-200 text-left font-medium transition"
                >
                  <Pin className="w-4 h-4 text-teal-400" />
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
                  <Palette className="w-4 h-4 text-teal-400" />
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

      {/* In-Chat Message Search Bar */}
      {isSearching && (
        <div className="px-4 py-2 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 flex items-center gap-2 z-20 animate-fade-in shadow-md">
          <Search className="w-4 h-4 text-teal-400 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Rechercher un mot, un message, un document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-700/80 focus:border-teal-500 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden"
          />
          {searchQuery.trim() && (
            <span className="text-[11px] text-neutral-400 font-mono shrink-0 px-1">
              {matchIds.length > 0 ? `${currentMatchIndex + 1}/${matchIds.length}` : '0 résultat'}
            </span>
          )}
          <button
            type="button"
            disabled={matchIds.length === 0}
            onClick={handlePrevMatch}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 transition"
            title="Résultat précédent"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={matchIds.length === 0}
            onClick={handleNextMatch}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 transition"
            title="Résultat suivant"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSearching(false);
              setSearchQuery('');
            }}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            title="Fermer la recherche"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain chat-scroll-container p-3 sm:p-5 space-y-3 relative"
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
          <span className="px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-teal-950/80 text-xs text-neutral-300 flex items-center gap-1.5 shadow-sm">
            <Shield className="w-4 h-4 text-teal-400" />
            Protocole sécurisé Flex P2P • Écritures confortables
          </span>
        </div>

        {conversationMessages.map((msg, index) => {
          const isSelf = msg.senderId === currentUser.id;
          const showSenderName = isGroup && !isSelf;
          const textFontSize = fontSize === 'xlarge' ? 'text-lg sm:text-xl' : fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base';

          const isMatch = matchIds.includes(msg.id);
          const isCurrentMatch = matchIds.length > 0 && matchIds[currentMatchIndex] === msg.id;

          return (
            <div
              key={msg.id}
              id={`msg-bubble-${msg.id}`}
              className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} group relative transition-all duration-300 rounded-2xl ${
                isCurrentMatch ? 'ring-2 ring-amber-400 bg-amber-500/10 p-1 -m-1' : ''
              }`}
            >
              {showSenderName && (
                <span className="text-xs font-bold text-teal-300 ml-3 mb-1">
                  {msg.senderName}
                </span>
              )}

              <div className="relative max-w-[90%] sm:max-w-[76%] min-w-0">
                {/* Bubble Container */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl relative shadow-md transition-all min-w-0 ${
                    isSelf
                      ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white rounded-tr-xs shadow-teal-950/40 border border-teal-500/40'
                      : 'bg-neutral-800 text-neutral-100 rounded-tl-xs border border-neutral-700/80 shadow-black/20'
                  }`}
                >
                  {/* Document attachment card */}
                  {msg.fileName && (
                    <div className="mb-2.5 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 flex items-center justify-between gap-3 w-full min-w-0 shadow-xs">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/40 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-teal-300" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-white truncate" title={msg.fileName}>
                            {msg.fileName}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-0.5">
                            <span>{msg.fileSize || 'Fichier'}</span>
                            <span>•</span>
                            <span className="uppercase text-teal-300 font-bold">
                              {msg.fileName.split('.').pop() || 'DOC'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {msg.mediaUrl && (
                        <a
                          href={msg.mediaUrl}
                          download={msg.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition active:scale-95 shrink-0 shadow-xs ml-1"
                          title="Télécharger / Ouvrir"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Media attachment: Image (Normal or View-Once) */}
                  {msg.type === 'image' && msg.mediaUrl && (
                    <>
                      {msg.viewOnce ? (
                        <div className="mb-2">
                          {msg.viewed ? (
                            <div className="p-3 bg-neutral-900/90 rounded-xl border border-neutral-700/70 flex items-center gap-2.5 text-xs text-neutral-400">
                              <Lock className="w-4 h-4 text-neutral-400" />
                              <div>
                                <span className="font-bold text-neutral-200 block">Photo à vue unique</span>
                                <span className="text-[10px] text-neutral-400">Message ouvert • Déjà expiré</span>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setViewOnceModalImage({ url: msg.mediaUrl!, msgId: msg.id })}
                              className="p-3 bg-teal-950/80 hover:bg-teal-900/90 border border-teal-500/60 rounded-xl flex items-center gap-2.5 text-xs text-white transition active:scale-98 shadow-md"
                            >
                              <span className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white font-black text-[11px] shadow-xs">
                                1
                              </span>
                              <div className="text-left">
                                <span className="font-bold text-teal-200 block">Photo à vue unique</span>
                                <span className="text-[10px] text-teal-300/80">Cliquez pour voir (disparaît après)</span>
                              </div>
                              <Eye className="w-4 h-4 ml-auto text-teal-300" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="mb-2 rounded-xl overflow-hidden max-h-72">
                          <img
                            src={msg.mediaUrl}
                            alt="Photo partagée"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Poll attachment */}
                  {msg.pollData && (
                    <div className="p-3.5 bg-neutral-900/95 rounded-2xl border border-teal-500/40 space-y-2.5 my-1 min-w-[240px] sm:min-w-[280px]">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-teal-600/30 text-teal-300">
                          <BarChart2 className="w-4 h-4 text-teal-400" />
                        </span>
                        <h4 className="font-bold text-sm text-white">{msg.pollData.question}</h4>
                      </div>
                      <div className="space-y-2">
                        {msg.pollData.options.map((opt) => {
                          const hasVoted = opt.voters.includes(currentUser.id);
                          const percent = msg.pollData!.totalVotes > 0 
                            ? Math.round((opt.voters.length / msg.pollData!.totalVotes) * 100) 
                            : 0;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => votePoll(msg.id, opt.id)}
                              className={`w-full p-2.5 rounded-xl border text-left relative overflow-hidden transition-all ${
                                hasVoted
                                  ? 'border-teal-500 bg-teal-950/60 ring-1 ring-teal-400'
                                  : 'border-neutral-700/80 bg-neutral-800/60 hover:border-neutral-600'
                              }`}
                            >
                              <div
                                className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                                  hasVoted ? 'bg-teal-600/40' : 'bg-neutral-700/40'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                              <div className="relative flex items-center justify-between z-10 text-xs">
                                <span className={`font-semibold ${hasVoted ? 'text-white' : 'text-neutral-200'}`}>
                                  {opt.text}
                                </span>
                                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                                  <span className={hasVoted ? 'text-teal-300' : 'text-neutral-400'}>{percent}%</span>
                                  <span className="text-[10px] text-neutral-400">({opt.voters.length})</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                        <span>{msg.pollData.totalVotes} vote{msg.pollData.totalVotes > 1 ? 's' : ''} au total</span>
                        <span className="text-teal-400 font-medium">Touchez pour voter</span>
                      </div>
                    </div>
                  )}

                  {/* Voice Note attachment */}
                  {msg.type === 'voice' && (
                    <VoiceNotePlayer duration={msg.voiceDuration || 12} isSelf={isSelf} mediaUrl={msg.mediaUrl} />
                  )}

                  {/* Text content with decency shield */}
                  {msg.type !== 'voice' && !msg.pollData && (() => {
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
                      <div className="min-w-0 w-full select-text">
                        {renderFormattedMessage(msg.content, textFontSize, isSelf)}

                        {/* Instant AI Translation */}
                        {msg.translation ? (
                          <div className="mt-2 p-2.5 rounded-xl bg-neutral-950/80 border border-teal-500/40 text-xs space-y-1">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-teal-300">
                              <Globe className="w-3.5 h-3.5 text-teal-400" />
                              <span>Traduction Flex IA :</span>
                            </div>
                            <p className="text-xs italic text-neutral-100">{msg.translation.text}</p>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              setTranslatingMsgId(msg.id);
                              await translateMessage(msg.id);
                              setTranslatingMsgId(null);
                            }}
                            className="mt-1 text-[10px] text-teal-300/80 hover:text-white flex items-center gap-1 transition"
                          >
                            <Globe className="w-3 h-3 text-teal-300" />
                            <span>{translatingMsgId === msg.id ? 'Traduction Flex IA...' : 'Traduire'}</span>
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Message Meta: Time + Delivery Status */}
                  <div
                    className={`flex items-center justify-end gap-1.5 mt-1.5 text-xs ${
                      isSelf ? 'text-teal-100/90' : 'text-neutral-400'
                    }`}
                  >
                    {msg.isStarred && (
                      <Star className="w-3 h-3 text-amber-300 fill-amber-300 inline shrink-0" />
                    )}
                    <span>{formatMessageTime(msg.timestamp)}</span>
                    {isSelf && (
                      <span>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-4 h-4 text-teal-200 inline" />
                        ) : (
                          <Check className="w-3.5 h-3.5 inline text-teal-200/80" />
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

                {/* Floating Reaction Trigger and Star on Hover */}
                <div
                  className={`absolute -top-3.5 ${isSelf ? 'right-2' : 'left-2'} opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all flex items-center gap-1 z-20`}
                >
                  <button
                    onClick={() => toggleStarMessage(msg.id)}
                    className={`p-1.5 rounded-full border shadow-md text-xs transition active:scale-95 ${
                      msg.isStarred
                        ? 'bg-amber-400/20 border-amber-400/60 text-amber-300'
                        : 'bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-neutral-300'
                    }`}
                    title={msg.isStarred ? 'Retirer des favoris' : 'Marquer comme important ⭐'}
                  >
                    <Star className={`w-3.5 h-3.5 ${msg.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>

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

        {/* Animated Thinking... Indicator when Flex IA is processing query */}
        {isAiThinking && (
          <div className="flex gap-2.5 sm:gap-3.5 justify-start items-end my-3 animate-fade-in">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl overflow-hidden ring-2 ring-teal-500/80 shrink-0 shadow-lg bg-[#0d1815] animate-pulse">
              <img 
                src="/flex_ai_robot_avatar.jpg" 
                alt="Robot Flex IA" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="bg-gradient-to-br from-[#0c241f] to-[#12382f] border border-teal-500/50 text-teal-100 rounded-3xl rounded-bl-sm px-4.5 py-3 shadow-xl max-w-[88%] sm:max-w-[75%]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 border border-teal-400/40 text-xs font-black tracking-wide shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  Thinking...
                </span>
                <span className="text-[11px] text-teal-300 font-semibold">Flex IA cherche la réponse</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
                Flex IA explore le savoir universel pour formuler la meilleure réponse...
              </p>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-200 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10px] text-teal-400 font-bold ml-1.5">Recherche active</span>
              </div>
            </div>
          </div>
        )}

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
          className="absolute bottom-20 right-4 z-20 px-3.5 py-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white shadow-2xl shadow-teal-950/90 border border-teal-400/50 flex items-center gap-1.5 text-xs font-black transition-all animate-bounce"
          title="Faire défiler vers le bas (Derniers messages)"
        >
          <ArrowDown className="w-4 h-4" />
          <span>Derniers messages</span>
        </button>
      )}

      {/* Document Preview attachment Bar */}
      {selectedDocument && (
        <div className="px-4 py-2.5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/40 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-teal-300" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate max-w-[220px] sm:max-w-md">
                {selectedDocument.name}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                <span>{selectedDocument.size}</span>
                <span>•</span>
                <span className="text-teal-300 font-semibold">Document prêt à envoyer</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDocument(null)}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white"
            title="Retirer le document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Image Preview attachment Bar */}
      {imagePreviewUrl && (
        <div className="px-4 py-2.5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={imagePreviewUrl}
              alt="Aperçu"
              className="w-12 h-12 object-cover rounded-xl border border-neutral-700 shadow-xs"
            />
            <div>
              <p className="text-xs font-bold text-white">Image prête à envoyer</p>
              <button
                type="button"
                onClick={() => setIsViewOnceSelected(!isViewOnceSelected)}
                className={`mt-1 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition ${
                  isViewOnceSelected
                    ? 'bg-teal-600 text-white ring-2 ring-teal-400/50 shadow-xs'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-teal-400 text-neutral-950 font-black text-[10px] flex items-center justify-center">
                  1
                </span>
                <span>{isViewOnceSelected ? 'Vue unique activée (1x)' : 'Activer Vue unique (1x)'}</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              setImagePreviewUrl(null);
              setIsViewOnceSelected(false);
            }}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white"
            title="Supprimer la photo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Voice Recording Active Bar */}
      {isRecordingVoice && (
        <div className="p-3 bg-teal-950/90 border-t border-teal-800/80 flex items-center justify-between animate-fade-in">
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
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:from-teal-600 hover:to-emerald-500 text-xs font-black text-white shadow-md"
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
            <p className="text-[11px] text-teal-300 mt-1.5 font-bold italic">
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
          {/* Quick Suggestions for Flex IA Assistant */}
          {isAiChat && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-1 scrollbar-none max-w-4xl mx-auto">
              <span className="text-[10px] font-black uppercase text-teal-400 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Suggestions :</span>
              </span>
              {[
                'Qui est Franck Alex ?',
                'Comment fonctionne la sécurité ?',
                'Explique le mode 2 comptes',
                'Synchroniser mon PC Windows',
                'Rédige un message percutant',
                'Pose-moi une question'
              ].map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sendMessage({
                      conversationId: selectedConversation.id,
                      content: sug,
                      type: 'text',
                    });
                  }}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-teal-950/70 hover:bg-teal-900 border border-teal-800/60 text-[11px] text-teal-200 hover:text-white transition font-medium active:scale-95"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSendText}
            className="flex items-center gap-2 sm:gap-3 w-full max-w-4xl mx-auto"
          >
            {/* Main Input Capsule: Flexible, smoothly shrinks, never overflows */}
            <div className="flex-1 min-w-0 flex items-center bg-neutral-950 border border-neutral-800 focus-within:border-teal-500/80 focus-within:ring-2 focus-within:ring-teal-500/20 rounded-full pl-1.5 pr-2 py-1 transition-all shadow-inner">
              {/* Emoji Button */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                  title="Émojis"
                >
                  <Smile className="w-5 h-5 text-neutral-400 hover:text-teal-400 transition-colors" />
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
                placeholder={isAiChat ? "Posez n'importe quelle question sur Franck Alex, Flex Online ou tout sujet..." : "Message..."}
                value={textInput}
                onChange={handleInputChange}
                style={{ minWidth: 0 }}
                className="flex-1 w-full min-w-0 px-2 py-2 bg-transparent border-none text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-hidden font-medium"
              />

              {/* Hidden file inputs for Images and Documents */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <input
                type="file"
                ref={docFileInputRef}
                onChange={handleDocSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.csv,.rar,.7z"
                className="hidden"
              />

              {/* Attachment Button & Popover */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors shrink-0"
                  title="Ajouter une pièce jointe (Photo, Document, Sondage)"
                >
                  <Paperclip className="w-5 h-5 text-neutral-400 hover:text-teal-400 transition-colors" />
                </button>

                {showAttachmentMenu && (
                  <div className="absolute bottom-full right-0 mb-3 p-1.5 bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl flex flex-col gap-1 z-30 min-w-[190px] animate-scale-in">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAttachmentMenu(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-800 rounded-xl text-neutral-200 text-xs font-medium text-left transition"
                    >
                      <div className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                      <span>Photo / Image</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAttachmentMenu(false);
                        docFileInputRef.current?.click();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-800 rounded-xl text-neutral-200 text-xs font-medium text-left transition"
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span>Document (PDF, Word...)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAttachmentMenu(false);
                        setShowPollModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-800 rounded-xl text-neutral-200 text-xs font-medium text-left transition"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <BarChart2 className="w-3.5 h-3.5" />
                      </div>
                      <span>Sondage</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Direct Poll Button Shortcut */}
              <button
                type="button"
                onClick={() => setShowPollModal(true)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors shrink-0"
                title="Créer un sondage"
              >
                <BarChart2 className="w-5 h-5 text-neutral-400 hover:text-teal-400 transition-colors" />
              </button>
            </div>

            {/* Voice Note or Send Button - 100% FULLY VISIBLE INSIDE SCREEN BOUNDS */}
            <div className="shrink-0 flex items-center justify-center">
              {textInput.trim() || imagePreviewUrl || selectedDocument ? (
                <button
                  type="submit"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#0F6E56] to-[#1D9E75] hover:from-teal-600 hover:to-emerald-500 text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md shadow-teal-950/80 border border-teal-400/80 ring-2 ring-teal-500/30 shrink-0"
                  title="Envoyer le message"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#0F6E56] via-teal-500 to-[#1D9E75] hover:from-teal-600 hover:to-emerald-500 text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg shadow-teal-900/80 border-2 border-teal-300 ring-2 ring-teal-400/50 shrink-0 group"
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
                <div className="p-2 bg-teal-600/20 text-teal-400 rounded-xl">
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
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-teal-900/40">
              <p className="text-xs font-bold text-neutral-200 mb-2">Choisir depuis la galerie de votre téléphone :</p>
              <button
                type="button"
                onClick={() => wallpaperFileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:from-teal-600 hover:to-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-950/60 transition active:scale-98"
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
                          ? 'border-teal-500 bg-teal-950/40 ring-2 ring-teal-500/50'
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

      {/* Create Poll Modal */}
      {showPollModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl animate-fade-in text-neutral-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-900/60 text-teal-300 rounded-xl">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Créer un sondage</h3>
                  <p className="text-xs text-neutral-400">Posez une question à vos contacts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPollModal(false)}
                className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">Question du sondage :</label>
                <input
                  type="text"
                  placeholder="Ex : À quelle heure commence notre réunion ?"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-hidden focus:border-teal-400 font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">Options de vote (2 à 5) :</label>
                {pollOptions.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleUpdatePollOption(idx, e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-teal-400 font-medium"
                    required={idx < 2}
                  />
                ))}

                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="mt-1 text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1.5 py-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter une option</span>
                  </button>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowPollModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!pollQuestion.trim() || pollOptions.filter((o) => o.trim()).length < 2}
                  className="px-4 py-2 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:opacity-90 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  Publier le sondage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View-Once Photo Lightbox Modal */}
      {viewOnceModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-fade-in"
          onClick={() => {
            markViewOnceOpened(viewOnceModalImage.msgId);
            setViewOnceModalImage(null);
          }}
        >
          <div className="w-full max-w-xl flex items-center justify-between z-10 pt-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-teal-500/50 text-teal-300 text-xs font-bold">
              <span className="w-4 h-4 rounded-full bg-[#1D9E75] text-white flex items-center justify-center text-[10px]">1</span>
              <span>Photo à vue unique • Disparaîtra dès la fermeture</span>
            </div>
            <button
              type="button"
              onClick={() => {
                markViewOnceOpened(viewOnceModalImage.msgId);
                setViewOnceModalImage(null);
              }}
              className="p-2 rounded-full bg-neutral-900/90 text-white hover:bg-neutral-800 border border-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center max-w-2xl max-h-[80vh] p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={viewOnceModalImage.url}
              alt="Photo à vue unique"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          <div className="pb-3 text-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                markViewOnceOpened(viewOnceModalImage.msgId);
                setViewOnceModalImage(null);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-xl transition active:scale-95"
            >
              Fermer (Détruire l'aperçu)
            </button>
          </div>
        </div>
      )}

      {/* Starred Messages Modal */}
      {showStarredModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl animate-fade-in text-neutral-100">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Messages importants</h3>
                  <p className="text-xs text-neutral-400">
                    {starredMessages.length} message{starredMessages.length > 1 ? 's' : ''} favori{starredMessages.length > 1 ? 's' : ''} dans cette discussion
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStarredModal(false)}
                className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {starredMessages.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 text-xs space-y-2">
                  <Star className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="font-semibold text-neutral-300">Aucun message important</p>
                  <p className="text-neutral-500 max-w-xs mx-auto">
                    Survolez un message ou touchez son étoile ⭐ pour l'enregistrer ici et le retrouver à tout moment.
                  </p>
                </div>
              ) : (
                starredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-teal-500/40 transition space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-teal-300">{msg.senderName}</span>
                      <span className="text-[10px] text-neutral-500">{formatMessageTime(msg.timestamp)}</span>
                    </div>
                    {msg.fileName ? (
                      <div className="flex items-center gap-2 text-xs text-neutral-300">
                        <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                        <span className="truncate">{msg.fileName}</span>
                        <span className="text-[10px] text-neutral-500">({msg.fileSize})</span>
                      </div>
                    ) : msg.type === 'image' ? (
                      <div className="flex items-center gap-2 text-xs text-neutral-300">
                        <ImageIcon className="w-4 h-4 text-pink-400 shrink-0" />
                        <span>Photo partagée</span>
                      </div>
                    ) : msg.type === 'voice' ? (
                      <div className="flex items-center gap-2 text-xs text-neutral-300">
                        <Mic className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Note vocale ({msg.voiceDuration || 10}s)</span>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-neutral-200 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed select-text">
                        {msg.content}
                      </p>
                    )}
                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setShowStarredModal(false);
                          scrollToMessage(msg.id);
                        }}
                        className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
                      >
                        <span>Accéder au message</span>
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStarMessage(msg.id)}
                        className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 text-[11px]"
                      >
                        <Star className="w-3 h-3 fill-rose-400" />
                        <span>Retirer</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
