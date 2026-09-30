import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, KeyRound, ShieldCheck, AlertCircle, Eye, EyeOff, RefreshCw, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DiscussionsLockGate: React.FC = () => {
  const { currentUser, unlockDiscussions, logoutUser, playNotificationSound } = useApp();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showRecoveryHint, setShowRecoveryHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleVerify = (candidatePin?: string) => {
    const code = (candidatePin !== undefined ? candidatePin : pin).trim();
    if (code.length !== 4) {
      setErrorMsg('Veuillez saisir votre mot de passe à 4 chiffres.');
      return;
    }

    const success = unlockDiscussions(code);
    if (success) {
      setErrorMsg(null);
    } else {
      setErrorMsg('Mot de passe à 4 chiffres incorrect. Réessayez.');
      setIsShaking(true);
      setPin('');
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  const handleKeypadPress = (num: string) => {
    if (pin.length >= 4) return;
    const next = (pin + num).slice(0, 4);
    setPin(next);
    setErrorMsg(null);
    if (next.length === 4) {
      setTimeout(() => handleVerify(next), 120);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleInputChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(clean);
    setErrorMsg(null);
    if (clean.length === 4) {
      setTimeout(() => handleVerify(clean), 120);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`relative w-full max-w-sm bg-neutral-900/95 border border-teal-700/60 rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* User avatar & lock icon */}
        <div className="relative mb-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-teal-500/80 shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-neutral-950 p-1.5 rounded-full shadow-md">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        <h2 className="text-lg font-black text-white">Discussions Verrouillées</h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed">
          Bonjour <strong className="text-teal-300">{currentUser.name.split(' ')[0]}</strong>, entrez votre mot de passe à 4 chiffres pour accéder à vos discussions :
        </p>

        {/* 4-digit PIN Visual Indicator Boxes */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[0, 1, 2, 3].map((idx) => {
            const digit = pin[idx];
            const isCurrent = pin.length === idx;
            return (
              <div
                key={idx}
                className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-mono font-black transition-all ${
                  digit
                    ? 'bg-teal-950 border-teal-400 text-white shadow-md shadow-teal-950/40 scale-105'
                    : isCurrent
                    ? 'border-teal-500 bg-neutral-900 ring-2 ring-teal-500/30'
                    : 'border-neutral-800 bg-neutral-950/80 text-neutral-600'
                }`}
              >
                {digit ? (showPin ? digit : '●') : ''}
              </div>
            );
          })}
        </div>

        {/* Hidden Input for direct keyboard listening */}
        <input
          ref={inputRef}
          type={showPin ? 'text' : 'password'}
          maxLength={4}
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => handleInputChange(e.target.value)}
          className="sr-only"
        />

        {/* Error message */}
        {errorMsg && (
          <div className="mb-3 px-3 py-1.5 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center gap-1.5 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Toggle Show/Hide PIN */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-950/60 border border-neutral-800 transition"
          >
            {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPin ? 'Masquer' : 'Afficher'}</span>
          </button>
        </div>

        {/* Numerical Keypad */}
        <div className="w-full max-w-[280px] grid grid-cols-3 gap-2 pt-1 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeypadPress(num)}
              className="h-11 rounded-2xl bg-neutral-950 hover:bg-neutral-800 active:bg-teal-600 active:text-white border border-neutral-800 text-lg font-bold font-mono text-white transition active:scale-95 shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setPin('');
              setErrorMsg(null);
            }}
            className="h-11 rounded-2xl bg-neutral-950/60 hover:bg-rose-950/40 border border-neutral-800 text-[11px] font-bold text-neutral-400 hover:text-rose-300 transition active:scale-95"
          >
            Effacer
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress('0')}
            className="h-11 rounded-2xl bg-neutral-950 hover:bg-neutral-800 active:bg-teal-600 active:text-white border border-neutral-800 text-lg font-bold font-mono text-white transition active:scale-95 shadow-sm"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-11 rounded-2xl bg-neutral-950/60 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-300 transition active:scale-95 flex items-center justify-center"
            title="Supprimer un chiffre"
          >
            ⌫
          </button>
        </div>

        {/* Unlock Button */}
        <button
          type="button"
          onClick={() => handleVerify()}
          disabled={pin.length !== 4}
          className="w-full max-w-[280px] flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:from-teal-600 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-teal-950/40 active:scale-98 transition disabled:opacity-40"
        >
          <Unlock className="w-4 h-4" />
          <span>Déverrouiller mes discussions</span>
        </button>

        {/* Bottom Options: Recovery Key & Logout */}
        <div className="w-full max-w-[280px] pt-4 mt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={() => setShowRecoveryHint(!showRecoveryHint)}
            className="text-neutral-400 hover:text-teal-300 transition font-medium"
          >
            Mot de passe oublié ?
          </button>

          <button
            type="button"
            onClick={logoutUser}
            className="text-neutral-400 hover:text-rose-400 transition font-medium flex items-center gap-1"
          >
            <LogOut className="w-3 h-3" />
            <span>Changer de compte</span>
          </button>
        </div>

        {showRecoveryHint && (
          <div className="mt-3 p-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-[11px] text-neutral-300 text-left animate-fade-in space-y-1">
            <p className="font-bold text-teal-300">Astuce de sécurité :</p>
            <p>
              Le code par défaut pour les profils de démonstration est <span className="font-mono text-white font-bold bg-neutral-900 px-1 py-0.5 rounded">1234</span>.
            </p>
            {currentUser.recoveryKey && (
              <p className="text-[10px] text-neutral-400">
                Clé de secours : <span className="font-mono text-teal-400">{currentUser.recoveryKey}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
