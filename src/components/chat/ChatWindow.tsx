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
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, Message } from '../../types';
import { VoiceNotePlayer } from './VoiceNotePlayer';

interface ChatWindowProps {
  onBack?: () => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '🔥', '🎉', '👏', '🙏', '😍', '✨', '🚀', '💯', '😊'];
const REACTION_CHOICES = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

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
    typingMap 
  } = useApp();

  const [textInput, setTextInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceTimerRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages.length]);

  if (!selectedConversation) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-neutral-50 p-8 text-center border-l border-neutral-200">
        <div className="w-20 h-20 rounded-3xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
          <Sparkles className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-neutral-800 mb-2">Vos discussions Flex Online</h2>
        <p className="text-sm text-neutral-500 max-w-sm">
          Sélectionnez une discussion à gauche ou commencez une nouvelle conversation pour échanger messages, vocaux et photos en temps réel.
        </p>
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

  // Handle typing state broadcast
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
    sendTypingStatus(selectedConversation.id, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(selectedConversation.id, false);
    }, 1500);
  };

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim() && !imagePreviewUrl) return;

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

  // Handle Image Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Voice recording simulation with real timer
  const startVoiceRecording = () => {
    setIsRecordingVoice(true);
    setVoiceSeconds(0);
    voiceTimerRef.current = setInterval(() => {
      setVoiceSeconds((prev) => prev + 1);
    }, 1000);
  };

  const cancelVoiceRecording = () => {
    setIsRecordingVoice(false);
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    setVoiceSeconds(0);
  };

  const finishVoiceRecording = () => {
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    setIsRecordingVoice(false);
    const duration = Math.max(1, voiceSeconds);
    sendMessage({
      conversationId: selectedConversation.id,
      content: 'Note vocale',
      type: 'voice',
      voiceDuration: duration,
    });
    setVoiceSeconds(0);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatMessageTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div id="chat-window-panel" className="flex-1 flex flex-col h-full bg-[#efeae2]/40 relative overflow-hidden">
      {/* Background wallpaper pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#059669 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-neutral-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              id="btn-back-to-chatlist"
              onClick={onBack}
              className="p-1.5 -ml-1 text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100 md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={title}
              className="w-10 h-10 rounded-full object-cover border border-neutral-200"
            />
            {!isGroup && (
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  isOnline ? 'bg-emerald-500' : 'bg-neutral-300'
                }`}
              />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                {title}
              </h2>
              {!isGroup && directContact?.verified && (
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-neutral-500 leading-tight">
              {isTyping ? (
                <span className="text-emerald-600 font-medium">écrit...</span>
              ) : isGroup ? (
                `${selectedConversation.participants.length} membres`
              ) : isOnline ? (
                <span className="text-emerald-600 font-medium">En ligne</span>
              ) : (
                directContact?.lastSeen || 'Hors ligne'
              )}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {!isGroup && directContact && (
            <>
              <button
                id="btn-start-audio-call"
                onClick={() => startCall(directContact, 'audio')}
                className="w-9 h-9 rounded-full text-emerald-700 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                title="Appel vocal"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                id="btn-start-video-call"
                onClick={() => startCall(directContact, 'video')}
                className="w-9 h-9 rounded-full text-emerald-700 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                title="Appel vidéo"
              >
                <Video className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="relative">
            <button
              id="btn-chat-options-menu"
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full text-neutral-600 hover:bg-neutral-100 flex items-center justify-center transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-50 text-xs font-medium text-neutral-700">
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2"
                >
                  Infos du contact
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2"
                >
                  Médias et fichiers
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Effacer les messages
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3">
        {/* Encryption banner */}
        <div className="max-w-md mx-auto my-2 p-2 bg-amber-50/90 border border-amber-200/60 rounded-xl text-center shadow-2xs">
          <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
            🔒 Messages et appels chiffrés de bout en bout. Vos échanges restent privés et sécurisés.
          </p>
        </div>

        {conversationMessages.map((msg) => {
          const isSelf = msg.senderId === currentUser.id;
          const showSenderName = isGroup && !isSelf;
          const hasReactions = msg.reactions && msg.reactions.length > 0;

          return (
            <div
              key={msg.id}
              id={`msg-${msg.id}`}
              className={`flex flex-col group ${isSelf ? 'items-end' : 'items-start'}`}
            >
              {/* Message bubble */}
              <div className="relative max-w-[85%] sm:max-w-[70%]">
                <div
                  className={`rounded-2xl px-3.5 py-2.5 shadow-xs transition-shadow ${
                    isSelf
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : 'bg-white text-neutral-900 border border-neutral-200/80 rounded-tl-xs'
                  }`}
                >
                  {showSenderName && (
                    <p className="text-[11px] font-bold text-emerald-700 mb-0.5">
                      {msg.senderName}
                    </p>
                  )}

                  {/* Message content */}
                  {msg.type === 'text' && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words select-text">
                      {msg.content}
                    </p>
                  )}

                  {msg.type === 'voice' && (
                    <VoiceNotePlayer duration={msg.voiceDuration || 12} isSelf={isSelf} />
                  )}

                  {msg.type === 'image' && msg.mediaUrl && (
                    <div className="mb-1 rounded-xl overflow-hidden cursor-pointer" onClick={() => setSelectedImage(msg.mediaUrl!)}>
                      <img
                        src={msg.mediaUrl}
                        alt="Photo"
                        className="w-full max-h-72 object-cover rounded-xl hover:opacity-95 transition-opacity"
                      />
                      {msg.content && msg.content !== 'Photo partagée' && (
                        <p className="text-xs mt-1.5 leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                  )}

                  {/* Timestamp & status indicator */}
                  <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isSelf ? 'text-emerald-100' : 'text-neutral-400'}`}>
                    <span>{formatMessageTime(msg.timestamp)}</span>
                    {isSelf && (
                      msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-emerald-200" />
                      )
                    )}
                  </div>
                </div>

                {/* Reaction button hover flyout */}
                <div
                  className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center ${
                    isSelf ? '-left-8' : '-right-8'
                  }`}
                >
                  <button
                    onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)}
                    className="p-1 rounded-full bg-white text-neutral-500 hover:text-neutral-800 shadow-md border border-neutral-100 text-xs"
                    title="Ajouter une réaction"
                  >
                    <Smile className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Emoji Reaction Selector Bar */}
                {activeReactionMsgId === msg.id && (
                  <div
                    className={`absolute -top-10 z-30 bg-white rounded-full shadow-xl border border-neutral-200 px-2 py-1 flex items-center gap-1 animate-scale-in ${
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
                        className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-base hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Render reactions pill under bubble */}
                {hasReactions && (
                  <div
                    className={`flex items-center gap-0.5 -mt-2 z-10 px-1.5 py-0.5 rounded-full bg-white border border-neutral-200 shadow-xs text-xs ${
                      isSelf ? 'ml-auto mr-2' : 'mr-auto ml-2'
                    }`}
                  >
                    {msg.reactions.map((r, i) => (
                      <span key={i} title={r.userName} className="text-xs">
                        {r.emoji}
                      </span>
                    ))}
                    {msg.reactions.length > 1 && (
                      <span className="text-[10px] font-bold text-neutral-600 ml-0.5">
                        {msg.reactions.length}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-neutral-500 italic bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full w-fit shadow-2xs border border-neutral-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{typingUsers.join(', ')} est en train d'écrire...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview before sending */}
      {imagePreviewUrl && (
        <div className="relative z-20 px-4 py-2 bg-neutral-100 border-t border-neutral-200 flex items-center gap-3">
          <div className="relative">
            <img
              src={imagePreviewUrl}
              alt="Aperçu"
              className="w-16 h-16 rounded-lg object-cover border border-neutral-300"
            />
            <button
              onClick={() => {
                setImagePreviewUrl(null);
                setSelectedImage(null);
              }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-xs"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-neutral-600 font-medium">Image prête à être envoyée avec votre message</p>
        </div>
      )}

      {/* Emoji Palette Popover */}
      {showEmojiPicker && (
        <div className="relative z-20 p-3 bg-white border-t border-neutral-200 flex flex-wrap gap-2 shadow-inner">
          {COMMON_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setTextInput((prev) => prev + emoji)}
              className="text-xl p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="relative z-20 p-3 bg-white border-t border-neutral-200">
        {isRecordingVoice ? (
          /* Live Voice Recording UI */
          <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-2 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold text-red-600">
                Enregistrement vocal : {formatSeconds(voiceSeconds)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-cancel-voice-record"
                onClick={cancelVoiceRecording}
                className="px-3 py-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-200"
              >
                Annuler
              </button>
              <button
                id="btn-send-voice-record"
                onClick={finishVoiceRecording}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Square className="w-3 h-3 fill-current" />
                Envoyer
              </button>
            </div>
          </div>
        ) : (
          /* Standard Text & Attachment Input */
          <form onSubmit={handleSendText} className="flex items-center gap-2">
            <button
              type="button"
              id="btn-toggle-emoji-picker"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-full transition-colors ${
                showEmojiPicker ? 'bg-emerald-100 text-emerald-700' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
              }`}
              title="Émojis"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="button"
              id="btn-trigger-file-input"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-neutral-500 hover:text-neutral-800 rounded-full hover:bg-neutral-100 transition-colors"
              title="Joindre une photo"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <input
              id="input-chat-message"
              type="text"
              placeholder="Écrivez un message..."
              value={textInput}
              onChange={handleInputChange}
              className="flex-1 px-4 py-2 text-sm bg-neutral-100 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all text-neutral-900 placeholder:text-neutral-400"
            />

            {textInput.trim() || imagePreviewUrl ? (
              <button
                type="submit"
                id="btn-send-message"
                className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs shrink-0"
                title="Envoyer"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button
                type="button"
                id="btn-start-voice-note"
                onClick={startVoiceRecording}
                className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs shrink-0"
                title="Enregistrer une note vocale"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>
        )}
      </div>

      {/* Image zoom modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Plein écran"
            className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
