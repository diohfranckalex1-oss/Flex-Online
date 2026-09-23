import React, { useEffect, useState } from 'react';
import { Smartphone, Check, X, Shield, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SmsNotificationToast: React.FC = () => {
  const { incomingOtpCode, clearIncomingOtpCode } = useApp();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (incomingOtpCode) {
      const timer = setTimeout(() => {
        clearIncomingOtpCode();
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [incomingOtpCode, clearIncomingOtpCode]);

  if (!incomingOtpCode) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(incomingOtpCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-bounce-in text-neutral-100">
      <div className="bg-neutral-900/95 border border-violet-500/60 rounded-2xl p-3.5 shadow-2xl shadow-violet-950/60 backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-violet-950 border border-violet-700/60 text-violet-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300">
                Puce SIM · SMS Flex Confirm
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-xs text-neutral-300 truncate">
              Code de sécurité : <span className="font-mono font-black text-white text-sm tracking-wider">{incomingOtpCode.code}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-md shadow-violet-900/40"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié' : 'Copier'}</span>
          </button>
          <button
            onClick={clearIncomingOtpCode}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
