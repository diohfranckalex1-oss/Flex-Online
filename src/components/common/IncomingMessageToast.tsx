import React, { useEffect } from 'react';
import { MessageSquare, ArrowRight, X, Bot, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const IncomingMessageToast: React.FC = () => {
  const { 
    incomingMessageToast, 
    clearIncomingMessageToast, 
    setSelectedConversationId, 
    setActiveTab 
  } = useApp();

  useEffect(() => {
    if (incomingMessageToast) {
      const timer = setTimeout(() => {
        clearIncomingMessageToast();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [incomingMessageToast, clearIncomingMessageToast]);

  if (!incomingMessageToast) return null;

  const isAi = incomingMessageToast.senderName.toLowerCase().includes('ia') || 
               incomingMessageToast.senderName.toLowerCase().includes('flex ia') ||
               incomingMessageToast.conversationId === 'conv-ai-assistant';

  const handleOpenChat = () => {
    setSelectedConversationId(incomingMessageToast.conversationId);
    setActiveTab('chats');
    clearIncomingMessageToast();
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md animate-bounce-in text-neutral-100 select-none shadow-2xl">
      <div 
        onClick={handleOpenChat}
        className="cursor-pointer bg-neutral-900/95 hover:bg-neutral-850 border border-teal-500/60 rounded-2xl p-3 shadow-2xl shadow-teal-950/70 backdrop-blur-md flex items-center justify-between gap-3 transition-all hover:border-teal-400 group"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar with indicator */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-teal-500/80 shadow-md bg-neutral-800">
              <img 
                src={incomingMessageToast.senderAvatar || '/flex_ai_robot_avatar.jpg'} 
                alt={incomingMessageToast.senderName} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/flex_ai_robot_avatar.jpg';
                }}
              />
            </div>
            {isAi ? (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-teal-500 border border-neutral-900 flex items-center justify-center shadow-xs">
                <Bot className="w-2.5 h-2.5 text-neutral-950" />
              </span>
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-neutral-900" />
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-black text-white truncate group-hover:text-teal-300 transition-colors">
                {incomingMessageToast.senderName}
              </span>
              {isAi && (
                <span className="px-1.5 py-0.2 rounded-md bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  IA
                </span>
              )}
              <span className="text-[10px] text-teal-400 font-bold ml-auto shrink-0">
                Maintenant
              </span>
            </div>
            <p className="text-xs text-neutral-300 truncate font-medium">
              {incomingMessageToast.content}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleOpenChat}
            className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95"
            title="Ouvrir la discussion"
          >
            <span>Répondre</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={clearIncomingMessageToast}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
