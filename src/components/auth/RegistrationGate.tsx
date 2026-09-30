import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Lock, 
  User, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  ArrowLeft, 
  Sparkles,
  MessageSquare,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Film,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FlexLogo } from '../common/FlexLogo';
import { COUNTRIES, CountryOption } from '../../data/countries';
import { FlexCommercialModal } from '../promo/FlexCommercialModal';
import { FlexAiModal } from '../ai/FlexAiModal';

export const RegistrationGate: React.FC = () => {
  const { 
    registerUser, 
    loginUser, 
    requestVerificationCode, 
    verifyCodeAndLogin,
    incomingOtpCode,
    playNotificationSound,
    users
  } = useApp();

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [step, setStep] = useState<'form' | 'otp' | 'pin_unlock'>('form');

  // Form fields
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]); // Default: Côte d'Ivoire
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [otpChannel, setOtpChannel] = useState<'phone' | 'email'>('phone');
  
  // Centers of Interest & Passions for Hi Flex matching
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    '📚 Littérature & Lecture',
    '💻 Informatique & Technologies',
    '🤝 Partage & Amitié'
  ]);
  const [customInterestInput, setCustomInterestInput] = useState('');

  const PRESET_INTERESTS = [
    '📚 Littérature & Lecture',
    '✍️ Écriture & Poésie',
    '💻 Informatique & Technologies',
    '💼 Entrepreneuriat & Projets',
    '🧪 Sciences & Savoirs',
    '⚽ Football & Sports',
    '🎵 Musique & Création',
    '🌍 Langues & Découverte du Monde',
    '🏛️ Histoire & Philosophie',
    '🤝 Partage & Amitié',
    '🎨 Art, Cinéma & Design',
    '🌱 Écologie & Nature'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => 
      prev.includes(interest) 
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    const trimmed = customInterestInput.trim();
    if (trimmed && !selectedInterests.includes(trimmed)) {
      setSelectedInterests((prev) => [...prev, trimmed]);
      setCustomInterestInput('');
    }
  };

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [expectedCode, setExpectedCode] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Step 3 PIN Unlock for Discussions state
  const [unlockPin, setUnlockPin] = useState('');
  const [showUnlockPin, setShowUnlockPin] = useState(false);
  const unlockPinInputRef = useRef<HTMLInputElement>(null);

  // Login form fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    } else if (resendCountdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, resendCountdown]);

  // Update phone prefix when country changes
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = COUNTRIES.find((c) => c.code === e.target.value) || COUNTRIES[0];
    setSelectedCountry(country);
  };

  // Step 1: Submit registration form & request OTP
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!lastName.trim()) {
      setErrorMessage('Veuillez renseigner votre Nom de famille.');
      return;
    }
    if (!firstName.trim()) {
      setErrorMessage('Veuillez renseigner votre/vos Prénom(s).');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Veuillez renseigner votre numéro de téléphone.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Veuillez renseigner une adresse e-mail valide.');
      return;
    }
    if (!securityPin.trim() || securityPin.trim().length !== 4) {
      setErrorMessage('Veuillez choisir un code PIN de sécurité de 4 chiffres exactement.');
      return;
    }

    setIsLoading(true);

    // Format full phone with dial code
    const fullPhone = phoneNumber.startsWith('+') 
      ? phoneNumber.trim() 
      : `${selectedCountry.dialCode} ${phoneNumber.trim()}`;

    const target = otpChannel === 'phone' ? fullPhone : email.trim();

    try {
      const res = await requestVerificationCode(target, otpChannel);
      if (res.success && res.code) {
        setExpectedCode(res.code);
        setStep('otp');
        setResendCountdown(30);
        setCanResend(false);
        setSuccessMessage(
          `Code de confirmation envoyé avec succès par ${otpChannel === 'phone' ? 'SMS' : 'E-mail'} !`
        );
        playNotificationSound();
      } else {
        setErrorMessage(res.message || "Erreur lors de l'envoi du code.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de l'envoi du code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Validate OTP and advance to Step 3 (Mandatory 4-digit PIN unlock)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otpCode.trim()) {
      setErrorMessage('Veuillez saisir le code de confirmation à 6 chiffres.');
      return;
    }

    setIsLoading(true);

    // Check code against expected code or fallback
    const isCodeValid = expectedCode 
      ? otpCode.trim() === expectedCode 
      : (otpCode.trim().length === 6 || otpCode.trim() === incomingOtpCode?.code);

    if (!isCodeValid) {
      setErrorMessage('Le code de confirmation est incorrect. Vérifiez le code reçu.');
      setIsLoading(false);
      return;
    }

    // Success: OTP verified! Transition directly to Step 3: 4-digit PIN unlock to access discussions
    setStep('pin_unlock');
    setUnlockPin('');
    setSuccessMessage(`Numéro vérifié avec succès ! Veuillez maintenant taper votre mot de passe à 4 chiffres pour déverrouiller vos discussions.`);
    playNotificationSound();
    setIsLoading(false);
    setTimeout(() => {
      unlockPinInputRef.current?.focus();
    }, 150);
  };

  // Step 3: Confirm 4-digit PIN to finalize account creation & unlock discussions
  const handleConfirmPinUnlock = (e?: React.FormEvent, pinOverride?: string) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const pinToTest = (pinOverride !== undefined ? pinOverride : unlockPin).trim();

    if (!pinToTest || pinToTest.length !== 4) {
      setErrorMessage('Veuillez saisir votre mot de passe de 4 chiffres.');
      return;
    }

    if (pinToTest !== securityPin.trim()) {
      setErrorMessage('Mot de passe incorrect. Saisissez les 4 chiffres choisis lors de votre inscription.');
      setUnlockPin('');
      return;
    }

    setIsLoading(true);

    const fullPhone = phoneNumber.startsWith('+') 
      ? phoneNumber.trim() 
      : `${selectedCountry.dialCode} ${phoneNumber.trim()}`;

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    registerUser({
      name: fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      country: selectedCountry.name,
      countryCode: selectedCountry.dialCode,
      phone: fullPhone,
      email: email.trim(),
      securityPin: securityPin.trim(),
      interests: selectedInterests.length > 0 ? selectedInterests : ['Littérature & Lecture', 'Technologies & Web', 'Partage & Amitié'],
    });

    setSuccessMessage(`Compte vérifié ! Bienvenue sur Flex Online, ${firstName}. Vous êtes directement admis à Hi Flex !`);
    playNotificationSound();
    setIsLoading(false);
  };

  const handleKeypadPress = (num: string) => {
    if (unlockPin.length >= 4) return;
    const next = (unlockPin + num).slice(0, 4);
    setUnlockPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        handleConfirmPinUnlock(undefined, next);
      }, 100);
    }
  };

  const handleKeypadBackspace = () => {
    setUnlockPin((prev) => prev.slice(0, -1));
  };

  const handleUnlockPinChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 4);
    setUnlockPin(clean);
    if (clean.length === 4) {
      setTimeout(() => {
        handleConfirmPinUnlock(undefined, clean);
      }, 100);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setErrorMessage(null);
    setIsLoading(true);

    const fullPhone = phoneNumber.startsWith('+') 
      ? phoneNumber.trim() 
      : `${selectedCountry.dialCode} ${phoneNumber.trim()}`;
    const target = otpChannel === 'phone' ? fullPhone : email.trim();

    try {
      const res = await requestVerificationCode(target, otpChannel);
      if (res.success && res.code) {
        setExpectedCode(res.code);
        setResendCountdown(30);
        setCanResend(false);
        setSuccessMessage('Un nouveau code de confirmation a été envoyé.');
        playNotificationSound();
      }
    } catch (err: any) {
      setErrorMessage('Impossible de renvoyer le code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login with existing account (Requires 4-digit PIN)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage('Veuillez saisir votre numéro de téléphone ou adresse e-mail.');
      return;
    }

    if (!loginPin.trim() || loginPin.trim().length !== 4) {
      setErrorMessage('Le mot de passe de sécurité à 4 chiffres est obligatoire pour déverrouiller vos discussions.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser(loginIdentifier.trim(), loginPin.trim());
      if (res.success) {
        setSuccessMessage('Connexion réussie ! Vos discussions sont déverrouillées.');
        playNotificationSound();
      } else {
        setErrorMessage(res.error || 'Compte introuvable ou mot de passe à 4 chiffres incorrect.');
      }
    } catch (err: any) {
      setErrorMessage('Erreur lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950 text-neutral-100 overflow-y-auto p-4 sm:p-6 select-none">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg my-auto bg-neutral-900/90 backdrop-blur-xl border border-teal-700/60 rounded-3xl shadow-2xl shadow-teal-950/60 p-6 sm:p-8 flex flex-col">
        {/* App Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <FlexLogo size="xl" className="mb-2" />
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-sm">
            Discussions instantanées, appels audio & vidéo chiffrés et fil d'actualités exclusif.
          </p>
        </div>

        {/* Mode Switcher Tabs (Créer un compte / Se connecter) */}
        {step === 'form' && (
          <div className="flex p-1 bg-neutral-950/80 rounded-2xl border border-neutral-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-md shadow-teal-950/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Créer un compte
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white shadow-md shadow-teal-950/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              J'ai déjà un compte
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/80 text-rose-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-teal-950/60 border border-teal-800/80 text-teal-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ================= REGISTER FLOW ================= */}
        {mode === 'register' && step === 'form' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="text-left mb-2">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Inscription obligatoire Flex Online</span>
                <span className="text-[10px] uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-bold">
                  Étape 1/2
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Veuillez renseigner vos coordonnées pour recevoir votre code de confirmation.
              </p>
            </div>

            {/* Nom & Prénoms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Nom <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dioh"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Prénom(s) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Franck Alex"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pays & Indicatif Téléphonique */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Pays de résidence <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                <select
                  value={selectedCountry.code}
                  onChange={handleCountryChange}
                  className="w-full pl-9 pr-8 py-2 bg-neutral-950 border border-neutral-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl text-xs sm:text-sm text-white appearance-none outline-none cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-neutral-900 text-white">
                      {c.flag} {c.name} ({c.dialCode})
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-3 text-neutral-400 text-xs pointer-events-none">▼</span>
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Numéro de téléphone <span className="text-rose-400">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center px-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm font-bold text-teal-300 shrink-0">
                  {selectedCountry.flag} {selectedCountry.dialCode}
                </div>
                <div className="relative flex-1">
                  <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    placeholder="07 00 00 00 00"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Adresse E-mail */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Adresse e-mail <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 outline-none"
                />
              </div>
            </div>

            {/* Code PIN de sécurité (4 chiffres obligatoires) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">
                  Mot de passe de sécurité (4 chiffres) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] text-teal-400 font-semibold">Exigé pour déverrouiller vos discussions</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  maxLength={4}
                  inputMode="numeric"
                  placeholder="4 chiffres (ex: 1234)"
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                  className="w-full pl-9 pr-10 py-2 bg-neutral-950 border border-neutral-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl text-xs sm:text-sm text-white tracking-widest placeholder-neutral-600 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-200"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Choisissez 4 chiffres faciles à retenir. Vous les confirmerez juste après pour ouvrir vos discussions.
              </p>
            </div>

            {/* Centres d'intérêt & Passions pour Hi Flex */}
            <div className="bg-neutral-950/70 p-3.5 sm:p-4 rounded-2xl border border-neutral-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="block text-xs font-bold text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Centres d'intérêt & Passions (Admis sur Hi Flex)
                </span>
                <span className="text-[10px] text-neutral-400 font-semibold">
                  {selectedInterests.length} sélectionnés
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Ces passions apparaîtront sur votre profil Hi Flex pour vous lier automatiquement avec des correspondants qui partagent les mêmes passions.
              </p>

              {/* Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-neutral-950 font-bold shadow-md shadow-teal-500/20 scale-102'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>

              {/* Add custom interest input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Autre passion (ex: Cinéma, Échecs, Danse...)"
                  value={customInterestInput}
                  onChange={(e) => setCustomInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomInterest();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-teal-300 font-bold text-xs rounded-xl border border-neutral-700 transition"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Mode d'envoi du code de confirmation */}
            <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800/80">
              <span className="block text-xs font-bold text-neutral-200 mb-2">
                Où souhaitez-vous recevoir le code de confirmation ?
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOtpChannel('phone')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    otpChannel === 'phone'
                      ? 'bg-teal-950/60 border-teal-500 text-teal-200 shadow-sm'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  <span>Par SMS / Message</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOtpChannel('email')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    otpChannel === 'email'
                      ? 'bg-teal-950/60 border-teal-500 text-teal-200 shadow-sm'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span>Par E-mail</span>
                </button>
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-[#0F6E56] via-teal-600 to-[#1D9E75] hover:from-teal-600 hover:to-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-teal-950/40 active:scale-98 transition disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Recevoir le code de confirmation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= OTP VERIFICATION STEP ================= */}
        {mode === 'register' && step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-left mb-2">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setErrorMessage(null);
                }}
                className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-bold mb-2 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Modifier mes coordonnées</span>
              </button>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Confirmation du compte</span>
                <span className="text-[10px] uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-bold">
                  Étape 2/2
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Saisissez le code à 6 chiffres envoyé par{' '}
                <strong className="text-teal-300">
                  {otpChannel === 'phone' ? `SMS au ${selectedCountry.dialCode} ${phoneNumber}` : `E-mail à ${email}`}
                </strong>.
              </p>
            </div>

            {/* Code Simulator Banner for easy instant testing */}
            {expectedCode && (
              <div className="p-3.5 bg-teal-950/50 border border-teal-800/70 rounded-2xl text-xs text-teal-200 flex items-center justify-between gap-2 shadow-inner">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black shrink-0">
                    OTP
                  </div>
                  <div>
                    <span className="text-[10px] text-teal-300/80 block uppercase tracking-wider font-semibold">
                      Code de sécurité reçu :
                    </span>
                    <strong className="font-mono text-base tracking-widest text-white">{expectedCode}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(expectedCode)}
                  className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold rounded-lg transition"
                >
                  Remplir
                </button>
              </div>
            )}

            {/* Saisie du code à 6 chiffres */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 text-center">
                Code de confirmation à 6 chiffres
              </label>
              <input
                type="text"
                autoFocus
                maxLength={6}
                required
                placeholder="Ex: 849216"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-center py-3.5 px-4 bg-neutral-950 border-2 border-teal-600/60 focus:border-teal-400 rounded-2xl text-xl sm:text-2xl font-mono tracking-[0.4em] text-white placeholder-neutral-700 outline-none shadow-inner"
              />
            </div>

            {/* Renvoi du code */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-neutral-400">Vous n'avez pas reçu de code ?</span>
              <button
                type="button"
                disabled={!canResend || isLoading}
                onClick={handleResendOtp}
                className={`font-bold transition ${
                  canResend 
                    ? 'text-teal-400 hover:text-teal-300' 
                    : 'text-neutral-600 cursor-not-allowed'
                }`}
              >
                {canResend ? 'Renvoyer le code' : `Renvoyer dans (${resendCountdown}s)`}
              </button>
            </div>

            {/* Bouton de validation OTP menant au mot de passe 4 chiffres */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-[#0F6E56] via-teal-600 to-[#1D9E75] hover:from-teal-600 hover:to-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-teal-950/40 active:scale-98 transition disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Vérifier le code & Déverrouiller mes discussions</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 3: OBLIGATOIRE - MOT DE PASSE 4 CHIFFRES POUR ACCÉDER AUX DISCUSSIONS ================= */}
        {mode === 'register' && step === 'pin_unlock' && (
          <form onSubmit={handleConfirmPinUnlock} className="space-y-5 animate-fade-in text-center">
            {/* Header of Security Gate */}
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0F6E56] to-[#1D9E75] flex items-center justify-center text-white shadow-xl shadow-teal-950/80 border-2 border-teal-400/80 ring-4 ring-teal-500/20">
                  <KeyRound className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-950/80 border border-teal-800/80 rounded-full text-teal-300 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Compte créé avec succès • Étape 2/2</span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white">
                Accès sécurisé à vos discussions
              </h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm leading-relaxed">
                Bravo <strong className="text-teal-300">{firstName}</strong> ! Pour déverrouiller vos discussions et ancrer votre code pour ne jamais l'oublier, veuillez entrer votre <strong className="text-white">mot de passe à 4 chiffres</strong> :
              </p>
            </div>

            {/* 4-digit PIN Visual Indicator Boxes */}
            <div className="flex items-center justify-center gap-3 my-2">
              {[0, 1, 2, 3].map((idx) => {
                const digit = unlockPin[idx];
                const isCurrent = unlockPin.length === idx;
                return (
                  <div
                    key={idx}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-mono font-black transition-all ${
                      digit
                        ? 'bg-teal-950 border-teal-400 text-white shadow-md shadow-teal-950/40 scale-105'
                        : isCurrent
                        ? 'border-teal-500 bg-neutral-900 animate-pulse ring-2 ring-teal-500/30'
                        : 'border-neutral-800 bg-neutral-950/80 text-neutral-600'
                    }`}
                  >
                    {digit ? (showUnlockPin ? digit : '●') : ''}
                  </div>
                );
              })}
            </div>

            {/* Hidden Input for direct physical keyboard typing */}
            <input
              ref={unlockPinInputRef}
              type={showUnlockPin ? 'text' : 'password'}
              maxLength={4}
              autoFocus
              inputMode="numeric"
              value={unlockPin}
              onChange={(e) => handleUnlockPinChange(e.target.value)}
              className="sr-only"
            />

            {/* Toggle Show/Hide PIN */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowUnlockPin(!showUnlockPin)}
                className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-900/60 border border-neutral-800 transition"
              >
                {showUnlockPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showUnlockPin ? 'Masquer les chiffres' : 'Afficher les chiffres'}</span>
              </button>
            </div>

            {/* Interactive Numerical Keypad */}
            <div className="max-w-xs mx-auto grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="h-12 sm:h-13 rounded-2xl bg-neutral-950 hover:bg-neutral-800 active:bg-teal-600 active:text-white border border-neutral-800 text-lg sm:text-xl font-bold font-mono text-white transition active:scale-95 shadow-sm"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setUnlockPin('')}
                className="h-12 sm:h-13 rounded-2xl bg-neutral-950/60 hover:bg-rose-950/40 border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-rose-300 transition active:scale-95"
              >
                Effacer
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-12 sm:h-13 rounded-2xl bg-neutral-950 hover:bg-neutral-800 active:bg-teal-600 active:text-white border border-neutral-800 text-lg sm:text-xl font-bold font-mono text-white transition active:scale-95 shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="h-12 sm:h-13 rounded-2xl bg-neutral-950/60 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-300 transition active:scale-95 flex items-center justify-center"
                title="Supprimer un chiffre"
              >
                ⌫
              </button>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading || unlockPin.length !== 4}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-[#0F6E56] via-teal-600 to-[#1D9E75] hover:from-teal-600 hover:to-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-teal-950/40 active:scale-98 transition disabled:opacity-40"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Déverrouiller mes discussions</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= LOGIN EXISTING ACCOUNT FLOW ================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="text-left mb-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                Connexion à votre compte
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Entrez vos identifiants et votre mot de passe à 4 chiffres pour accéder à vos discussions.
              </p>
            </div>

            {/* Identifiant */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Numéro de téléphone ou Adresse e-mail <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  placeholder="Ex: +225 07... ou nom@mail.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-teal-500 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-600 outline-none"
                />
              </div>
            </div>

            {/* Mot de passe de sécurité (4 chiffres obligatoires) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">
                  Mot de passe de sécurité (4 chiffres) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] text-amber-400 font-bold">Obligatoire pour déverrouiller</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                <input
                  type={showLoginPin ? 'text' : 'password'}
                  required
                  maxLength={4}
                  inputMode="numeric"
                  placeholder="4 chiffres (ex: 1234)"
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                  className="w-full pl-9 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-teal-500 rounded-xl text-xs sm:text-sm text-white tracking-widest font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPin(!showLoginPin)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-200"
                >
                  {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Le mot de passe de 4 chiffres défini lors de votre inscription est exigé pour protéger vos discussions.
              </p>
            </div>

            {/* Comptes rapides enregistrés sur cet appareil */}
            {users && users.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                  Ou sélectionner un compte sur cet appareil :
                </span>
                <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {users.slice(0, 3).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setLoginIdentifier(u.phone || u.email || u.username);
                        setLoginPin('');
                      }}
                      className="flex items-center gap-2.5 p-2 bg-neutral-950/70 hover:bg-neutral-800 border border-neutral-800/60 rounded-xl transition text-left"
                    >
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full bg-neutral-800 object-cover" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{u.name}</span>
                        <span className="text-[10px] text-neutral-400 block truncate">{u.phone || u.username}</span>
                      </div>
                      <span className="text-[10px] text-teal-400 font-semibold px-2 py-0.5 bg-teal-950/60 rounded-md border border-teal-800/40">
                        Choisir
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-[#0F6E56] via-teal-600 to-[#1D9E75] hover:from-teal-600 hover:to-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-teal-950/40 active:scale-98 transition disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Se connecter à Flex Online</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Official Commercial Video Ad Trigger & Flex IA Preview */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setIsCommercialOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-950/70 hover:bg-teal-900/80 border border-teal-700/60 text-teal-300 hover:text-white text-xs font-bold transition shadow-sm group active:scale-95"
          >
            <Film className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
            <span>🎬 Spot Publicitaire (35s)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-600/30 to-emerald-600/30 hover:from-teal-600/50 hover:to-emerald-600/50 border border-teal-500/50 text-teal-200 hover:text-white text-xs font-bold transition shadow-sm group active:scale-95"
          >
            <Bot className="w-3.5 h-3.5 text-teal-300 group-hover:rotate-12 transition-transform" />
            <span>🤖 Poser une question à Flex IA</span>
          </button>
        </div>

        {/* Footer Security Notice */}
        <div className="mt-4 pt-4 border-t border-neutral-800/60 flex items-center justify-center gap-2 text-[11px] text-neutral-500 text-center">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Sécurité renforcée par Chiffrement de bout en bout & Code SIM</span>
        </div>
      </div>

      {/* 35s Official Commercial Video Modal */}
      <FlexCommercialModal
        isOpen={isCommercialOpen}
        onClose={() => setIsCommercialOpen(false)}
      />

      {/* Flex IA Assistant Modal */}
      <FlexAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
