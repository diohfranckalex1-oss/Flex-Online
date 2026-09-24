import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  RefreshCw,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Cpu,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FlexAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    icon: '🌟',
    label: 'Qui a créé Flex Online ?',
    prompt: 'Qui est Franck Alex et quelle est sa vision pour Flex Online ?',
  },
  {
    icon: '🛡️',
    label: 'Sécurité & Chiffrement',
    prompt: 'Comment fonctionne la sécurité, le chiffrement de bout en bout et la protection SIM sur Flex Online ?',
  },
  {
    icon: '📱',
    label: 'Mode 2 Comptes',
    prompt: 'Comment fonctionne le mode 2 comptes sur un même téléphone dans Flex Online ?',
  },
  {
    icon: '💻',
    label: 'Synchronisation PC Windows',
    prompt: 'Comment associer et synchroniser mon PC Windows en direct par QR Code ?',
  },
  {
    icon: '✍️',
    label: 'Rédiger un Post Flex',
    prompt: 'Rédige-moi une publication inspirante et dynamique pour le fil Flex Online sur l\'innovation et la liberté.',
  },
  {
    icon: '💡',
    label: 'Question générale',
    prompt: 'Explique-moi les meilleures pratiques pour réussir mes études et mes projets numériques.',
  },
];

export const FlexAiModal: React.FC<FlexAiModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab, setSelectedConversationId, conversations } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'ai-initial',
      sender: 'ai',
      text: `Bonjour ! 👋 Je suis **Flex IA**, l'Intelligence Artificielle officielle de Flex Online, créée pour vous aider et vous guider.\n\n✨ **Je peux répondre à toutes vos questions :**\n• 🌟 **Sur mon créateur : Franck Alex** (sa vision, comment il a développé Flex Online)\n• 📱 **Sur l'application :** sécurité blindée, chiffrement, mode 2 comptes, synchronisation PC\n• 🧠 **Sur n'importe quel sujet de votre choix :** travail, sciences, études, code informatique, conseils de vie, rédaction...\n\nQue souhaitez-vous savoir aujourd'hui ?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      if (!response.ok) {
        throw new Error('Erreur de communication avec le serveur IA');
      }

      const data = await response.json();
      const aiReplyText = data.answer || "Je suis à votre disposition. Que souhaitez-vous approfondir ?";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI ask error:', err);
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Je suis **Flex IA**, l'assistant officiel de Flex Online conçu par Franck Alex ! 🤖⚡\n\nFlex Online a été créé par **Franck Alex** pour offrir à tous une messagerie et un réseau social ultra-rapide, chiffré de bout en bout avec protection SIM et synchronisation PC Windows. Je reste disponible pour toutes vos questions !`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (id: string, text: string) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking && speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown stars
    const cleanText = text.replace(/[*_#•]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };

    setIsSpeaking(true);
    setSpeakingMsgId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleOpenInChat = () => {
    window.speechSynthesis?.cancel();
    onClose();
    setActiveTab('chats');
    const aiConv = conversations.find((c) => c.id === 'conv-ai-assistant' || c.participants.includes('user-flex-ai'));
    if (aiConv) {
      setSelectedConversationId(aiConv.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-neutral-950 border border-violet-800/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh] text-neutral-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-violet-950/90 via-neutral-900 to-indigo-950/90 border-b border-violet-800/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/50 border border-violet-400/40">
                <Bot className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>Flex IA Assistant</span>
                  <Sparkles className="w-4 h-4 text-violet-300" />
                </h2>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                <span>Créée par</span>
                <strong className="text-violet-300 font-bold">Franck Alex</strong>
                <span>• Répond à toutes vos questions 24/7</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleOpenInChat}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-900/40 hover:bg-violet-800/50 border border-violet-700/50 text-violet-200 text-xs font-bold transition"
              title="Continuer dans la messagerie instantanée"
            >
              <MessageSquare className="w-3.5 h-3.5 text-violet-300" />
              <span>Ouvrir dans Chat</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-neutral-900/60 border-b border-neutral-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-black uppercase text-violet-400 flex items-center gap-1 shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Idées :</span>
          </span>
          {QUICK_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(p.prompt)}
              disabled={isLoading}
              className="shrink-0 px-3 py-1 rounded-full bg-neutral-900 hover:bg-violet-950/70 border border-neutral-800 hover:border-violet-600/60 text-xs font-medium text-neutral-300 hover:text-white transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <span>{p.icon}</span>
              <span className="whitespace-nowrap">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                      isAi
                        ? 'bg-neutral-900/90 border border-neutral-800 text-neutral-200'
                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-violet-950/50'
                    }`}
                  >
                    {m.text}
                  </div>

                  <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-neutral-500">
                    <span>{m.timestamp}</span>
                    {isAi && (
                      <>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(m.id, m.text)}
                          className="hover:text-neutral-300 transition flex items-center gap-1"
                          title="Copier la réponse"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copié</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(m.id, m.text)}
                          className="hover:text-neutral-300 transition flex items-center gap-1"
                          title={isSpeaking && speakingMsgId === m.id ? 'Arrêter la lecture' : 'Écouter la voix'}
                        >
                          {isSpeaking && speakingMsgId === m.id ? (
                            <>
                              <VolumeX className="w-3 h-3 text-rose-400 animate-pulse" />
                              <span className="text-rose-400">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-violet-400" />
                              <span>Écouter</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-xl bg-violet-950 border border-violet-700/60 text-violet-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-violet-400 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-violet-300 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Flex IA réfléchit et formule votre réponse...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input */}
        <div className="p-3 sm:p-4 bg-neutral-900/90 border-t border-neutral-800/80 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez n'importe quelle question sur la vie, le travail, Franck Alex ou Flex Online..."
              disabled={isLoading}
              className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-violet-950/60 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              <span>Réponses intelligentes générées en direct • Respect de la vie privée</span>
            </div>
            <button
              type="button"
              onClick={handleOpenInChat}
              className="text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 sm:hidden transition"
            >
              <span>Continuer dans Chat</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
