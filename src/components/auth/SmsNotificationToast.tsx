import React, { useState, useEffect } from 'react';
import { Smartphone, Copy, Check, X, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SmsNotificationToast: React.FC = () => {
  const { incomingOtpCode, clearIncomingOtpCode } = useApp();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (incomingOtpCode) {
      const timer = setTimeout(() => {
        clearIncomingOtpCode();
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [incomingOtpCode, clearIncomingOtpCode]);

  if (!incomingOtpCode) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(incomingOtpCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-60 max-w-md w-[calc(100vw-2rem)] animate-bounce-short">
      <div className="bg-neutral-900/95 border-2 border-violet-500 rounded-3xl p-4 shadow-2xl shadow-violet-950/80 backdrop-blur-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white flex items-center gap-1">
                <span>SMS Réseau Flex</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </p>
              <p className="text-[10px] text-violet-300">À l’instant • {incomingOtpCode.target}</p>
            </div>
          </div>

          <button
            onClick={clearIncomingOtpCode}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] text-neutral-300">Votre code de confirmation :</p>
            <p className="text-xl font-mono font-black text-violet-400 tracking-widest">
              {incomingOtpCode.code}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-violet-950/50"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>

        <p className="text-[10px] text-neutral-400 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Ne partagez ce code avec personne. Vérification sécurisée Flex Online.
        </p>
      </div>
    </div>
  );
};
