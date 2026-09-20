import React, { useState, useRef } from 'react';
import { X, UserPlus, Sparkles, Camera, Check, LogIn, ArrowRight, ShieldCheck, KeyRound, Smartphone, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FlexLogo } from '../common/FlexLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { registerUser, loginUser, users, switchCurrentUser } = useApp();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [securityPin, setSecurityPin] = useState('1234');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [useRecoveryKey, setUseRecoveryKey] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Veuillez entrer votre nom complet.');
      return;
    }

    const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, '_')).trim();

    registerUser({
      name: name.trim(),
      username: cleanUsername,
      avatar: selectedAvatar,
      bio: bio.trim() || 'Nouveau membre sur Flex Online ! 👋',
      phone: phone.trim() || '+33 6 00 00 00 00',
      securityPin: securityPin.trim() || '1234',
    });

    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setError('Veuillez renseigner votre pseudo ou numéro de téléphone.');
      return;
    }

    setIsLoading(true);
    setError('');

    const res = await loginUser(
      loginIdentifier.trim(), 
      useRecoveryKey ? undefined : loginPin.trim(), 
      useRecoveryKey ? recoveryKey.trim() : undefined
    );

    setIsLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Impossible de se connecter avec ces identifiants.');
    }
  };

  const handleSelectQuickAccount = (u: any) => {
    setLoginIdentifier(u.username);
    setLoginPin(u.securityPin || '1234');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
      <div
        id="auth-modal-card"
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-neutral-200 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <FlexLogo size="sm" showText={false} />
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isLoginMode ? 'Connexion / Nouveau Téléphone' : 'Créer votre compte Flex'}
              </h3>
              <p className="text-xs text-emerald-100">
                {isLoginMode ? 'Retrouvez vos discussions & contacts sécurisés' : 'Rejoignez la communauté en 30 secondes'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-neutral-100 px-6 pt-3 gap-4 shrink-0 bg-neutral-50/50">
          <button
            id="tab-auth-register"
            onClick={() => {
              setIsLoginMode(false);
              setError('');
            }}
            className={`pb-2.5 text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              !isLoginMode
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Nouveau compte
          </button>
          <button
            id="tab-auth-login"
            onClick={() => {
              setIsLoginMode(true);
              setError('');
            }}
            className={`pb-2.5 text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              isLoginMode
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Se connecter
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {!isLoginMode ? (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2">
                  Photo de profil
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative group">
                    <img
                      src={selectedAvatar}
                      alt="Aperçu avatar"
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                      title="Changer de photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-neutral-500">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="font-bold text-emerald-600 hover:underline block"
                    >
                      Téléverser une image...
                    </button>
                    <span>ou cliquez sur un modèle</span>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
                  {PRESET_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt={`Avatar ${idx}`}
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-8 h-8 rounded-full object-cover cursor-pointer border-2 transition-all ${
                        selectedAvatar === av
                          ? 'border-emerald-600 scale-110 shadow-xs'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Name field */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Nom et Prénom *
                </label>
                <input
                  id="input-register-name"
                  type="text"
                  required
                  placeholder="Ex: Franck Alex"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!username) {
                      setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'));
                    }
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-neutral-100 border border-neutral-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Username field */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Pseudo (@unique)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">@</span>
                    <input
                      id="input-register-username"
                      type="text"
                      placeholder="franckalex"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 text-xs bg-neutral-100 border border-neutral-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Téléphone (optionnel)
                  </label>
                  <input
                    id="input-register-phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-100 border border-neutral-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Security PIN Code Field */}
              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <label className="text-xs font-bold text-emerald-950">
                    Code PIN de sécurité (Changement de téléphone)
                  </label>
                </div>
                <p className="text-[11px] text-emerald-800 mb-2">
                  Ce code à 4 chiffres vous servira à récupérer toutes vos données quand vous changerez de téléphone.
                </p>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <input
                    id="input-register-pin"
                    type="password"
                    maxLength={6}
                    required
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    className="w-32 px-3 py-1.5 text-center font-mono font-bold tracking-widest text-sm bg-white border border-emerald-300 rounded-lg focus:outline-emerald-600"
                  />
                  <span className="text-[11px] text-emerald-700 font-medium">(par défaut: 1234)</span>
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-register"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <span>Créer mon compte et commencer à causer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2.5">
                <Smartphone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-neutral-800">Vous changez d'appareil ?</p>
                  <p className="text-[11px] text-neutral-500">
                    Entrez votre pseudo ou numéro et votre code PIN pour restaurer instantanément tous vos messages et contacts.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Votre pseudo (@nom) ou votre numéro de téléphone
                </label>
                <input
                  id="input-login-username"
                  type="text"
                  required
                  placeholder="Ex: @franckalex ou sarah_d ou +33..."
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-neutral-100 border border-neutral-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {!useRecoveryKey ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-neutral-700">
                      Code PIN de sécurité (4 à 6 chiffres)
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseRecoveryKey(true)}
                      className="text-[11px] text-emerald-600 hover:underline font-medium"
                    >
                      PIN oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="input-login-pin"
                      type="password"
                      maxLength={6}
                      placeholder="Ex: 1234"
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2 font-mono tracking-widest text-sm bg-neutral-100 border border-neutral-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-neutral-700">
                      Clé secrète de secours
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseRecoveryKey(false)}
                      className="text-[11px] text-emerald-600 hover:underline font-medium"
                    >
                      Utiliser mon PIN
                    </button>
                  </div>
                  <input
                    id="input-login-recovery"
                    type="text"
                    placeholder="Ex: FLEX-A7B2-99CD"
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value)}
                    className="w-full px-3.5 py-2 font-mono text-xs uppercase bg-neutral-100 border border-neutral-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              )}

              {/* Quick Accounts selector */}
              <div className="pt-1">
                <p className="text-[11px] text-neutral-500 mb-1.5 font-medium">Comptes sur ce serveur (cliquez pour remplir) :</p>
                <div className="flex flex-wrap gap-1.5">
                  {users.slice(0, 5).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectQuickAccount(u)}
                      className="px-2.5 py-1 text-xs bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-neutral-700 font-medium transition-colors"
                    >
                      @{u.username}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Vérification...' : 'Me connecter et synchroniser mes données'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

