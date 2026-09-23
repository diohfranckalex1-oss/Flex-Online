import React, { useState, useRef } from 'react';
import { 
  X, 
  Smartphone, 
  Mail, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Lock, 
  HelpCircle,
  Camera,
  Check,
  User,
  ShieldAlert,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FlexLogo } from '../common/FlexLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    requestVerificationCode, 
    verifyCodeAndLogin, 
    recoverAccount, 
    incomingOtpCode,
    currentUser,
    savedAccounts
  } = useApp();

  const [authMethod, setAuthMethod] = useState<'sim' | 'google' | 'recovery'>('sim');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [phoneNumber, setPhoneNumber] = useState('+33 6 12 34 56 78');
  const [emailAddress, setEmailAddress] = useState('diohfranckalex1@gmail.com');
  const [userName, setUserName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    const identifier = authMethod === 'sim' ? phoneNumber.trim() : emailAddress.trim();
    if (!identifier) {
      setStatusMessage({ type: 'error', text: 'Veuillez saisir votre numéro de puce ou email valide.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const otpType = authMethod === 'sim' ? 'phone' : 'email';
      const res = await requestVerificationCode(identifier, otpType);
      if (res.success) {
        setStep('otp');
        setStatusMessage({
          type: 'success',
          text: `Message de confirmation envoyé au ${identifier}. Code de test : ${res.code}`
        });
        if (res.code) {
          setOtpCode(res.code);
        }
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Erreur lors de l’envoi du message.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Erreur réseau.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    const identifier = authMethod === 'sim' ? phoneNumber.trim() : emailAddress.trim();

    try {
      const res = await verifyCodeAndLogin(identifier, otpCode.trim());
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Connexion sécurisée réussie !' });
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Code de confirmation invalide.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Erreur de validation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoverLostPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    const identifier = phoneNumber.trim() || emailAddress.trim();
    if (!identifier || !recoveryKey.trim()) {
      setStatusMessage({ type: 'error', text: 'Renseignez votre puce SIM/email et votre clé de récupération.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await recoverAccount(identifier, recoveryKey.trim());
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Compte et discussions restaurés avec succès sur ce nouvel appareil !' });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Clé de récupération introuvable.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Erreur de restauration.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in text-neutral-100">
      <div 
        id="auth-modal-card"
        className="w-full max-w-md bg-neutral-900 border border-violet-900/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header with Royal Violet Gradient */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <FlexLogo size="md" showText={false} />
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5">
                <span>Flex Online Authentification</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Sécurisé</span>
              </h3>
              <p className="text-xs text-violet-200">
                Connexion certifiée par Puce SIM, Google ou Clé de Récupération
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-3 border-b border-violet-950/60 bg-neutral-950/60 p-1.5 gap-1">
          <button
            type="button"
            onClick={() => { setAuthMethod('sim'); setStep('input'); setStatusMessage(null); }}
            className={`py-2 px-1 rounded-xl text-xs font-black flex flex-col items-center gap-1 transition-all ${
              authMethod === 'sim'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-950/40'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Puce SIM</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('google'); setStep('input'); setStatusMessage(null); }}
            className={`py-2 px-1 rounded-xl text-xs font-black flex flex-col items-center gap-1 transition-all ${
              authMethod === 'google'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-950/40'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Compte Google</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('recovery'); setStep('input'); setStatusMessage(null); }}
            className={`py-2 px-1 rounded-xl text-xs font-black flex flex-col items-center gap-1 transition-all ${
              authMethod === 'recovery'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-950/40'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Tél Perdu</span>
          </button>
        </div>

        {/* Body Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {statusMessage && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-fade-in ${
              statusMessage.type === 'error'
                ? 'bg-rose-950/60 border border-rose-800/60 text-rose-200'
                : 'bg-violet-950/60 border border-violet-800/60 text-violet-200'
            }`}>
              {statusMessage.type === 'error' ? (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* SIM Phone Authentication */}
          {authMethod === 'sim' && step === 'input' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="p-3.5 bg-violet-950/30 border border-violet-900/40 rounded-2xl text-xs text-violet-300">
                Un code de confirmation sécurisé vous sera envoyé par SMS sur votre carte SIM pour certifier votre authenticité.
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Votre Numéro de Puce SIM :
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-violet-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+33 6 12 34 56 78"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-base font-bold text-white placeholder-neutral-500 focus:outline-hidden focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Nom d'affichage (optionnel) :
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-violet-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Franck Alex Dioh"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-semibold text-white placeholder-neutral-500 focus:outline-hidden focus:border-violet-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-violet-950/50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Recevoir le SMS de confirmation</span>
              </button>
            </form>
          )}

          {/* Google Authentication */}
          {authMethod === 'google' && step === 'input' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="p-3.5 bg-violet-950/30 border border-violet-900/40 rounded-2xl text-xs text-violet-300">
                Connexion officielle avec votre compte Google. Un message de validation vous sera expédié.
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Votre Adresse Google :
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-violet-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="diohfranckalex1@gmail.com"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-base font-bold text-white placeholder-neutral-500 focus:outline-hidden focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Nom complet :
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-violet-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Franck Alex"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-semibold text-white placeholder-neutral-500 focus:outline-hidden focus:border-violet-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-violet-950/50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Recevoir le code de confirmation Google</span>
              </button>
            </form>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3.5 bg-violet-950/40 border border-violet-800/60 rounded-2xl text-xs text-violet-200">
                Saisissez le code à 6 chiffres reçu par {authMethod === 'sim' ? 'SMS' : 'compte Google'}.
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Code de confirmation (6 chiffres) :
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-center text-2xl font-mono tracking-widest text-violet-300 focus:outline-hidden focus:border-violet-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-2xl font-bold text-xs"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || otpCode.length < 4}
                  className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-violet-950/50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Valider et Accéder au Compte</span>
                </button>
              </div>
            </form>
          )}

          {/* Lost Phone Recovery */}
          {authMethod === 'recovery' && (
            <form onSubmit={handleRecoverLostPhone} className="space-y-4">
              <div className="p-3.5 bg-neutral-950 border border-violet-900/40 rounded-2xl text-xs text-neutral-300 leading-relaxed">
                Vous avez perdu ou changé de téléphone ? Récupérez instantanément votre profil, vos contacts et vos conversations sécurisées à l'aide de votre puce SIM ou de votre Clé Maître.
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Numéro de puce SIM ou Email associé :
                </label>
                <input
                  type="text"
                  required
                  placeholder="+33 6... ou monemail@gmail.com"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-semibold text-white placeholder-neutral-500 focus:outline-hidden focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Clé Maître ou Ancien Code PIN :
                </label>
                <input
                  type="password"
                  required
                  placeholder="FLEX-REC-XXXX ou PIN à 4 chiffres"
                  value={recoveryKey}
                  onChange={(e) => setRecoveryKey(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-mono text-violet-300 placeholder-neutral-500 focus:outline-hidden focus:border-violet-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-violet-950/50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>Restaurer Mon Compte</span>
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-violet-950/60 bg-neutral-950 text-center text-xs text-neutral-400">
          Chiffrement de bout en bout conforme au protocole Flex P2P
        </div>
      </div>
    </div>
  );
};
