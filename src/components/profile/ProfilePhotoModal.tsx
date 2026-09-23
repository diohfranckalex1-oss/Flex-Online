import React, { useState, useRef } from 'react';
import { X, Camera, Check, ShieldCheck, Phone, Mail, User, ZoomIn, ZoomOut, RotateCcw, Edit3, Smartphone, Laptop } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfilePhotoModal: React.FC = () => {
  const { 
    isProfilePhotoModalOpen, 
    profilePhotoModalUser, 
    closeProfilePhotoModal, 
    currentUser, 
    updateUserProfile 
  } = useApp();

  const [zoom, setZoom] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isProfilePhotoModalOpen) return null;

  const targetUser = profilePhotoModalUser || currentUser;
  const isMe = targetUser.id === currentUser.id;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        updateUserProfile({ avatar: base64 });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = () => {
    setName(targetUser.name);
    setBio(targetUser.bio || '');
    setPhone(targetUser.phone || '');
    setEmail(targetUser.email || '');
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMe) {
      updateUserProfile({
        name: name.trim() || targetUser.name,
        bio: bio.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-fade-in text-neutral-100">
      <div 
        id="profile-photo-lightbox-card"
        className="w-full max-w-xl bg-neutral-900 border border-violet-900/40 rounded-3xl shadow-2xl shadow-violet-950/40 overflow-hidden flex flex-col max-h-[92vh] animate-scale-in"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{targetUser.name}</span>
                {targetUser.verified && (
                  <span title="Compte Flex Vérifié">
                    <ShieldCheck className="w-4 h-4 text-violet-400 inline" />
                  </span>
                )}
              </h2>
              <p className="text-xs text-violet-300/80 font-mono">
                @{targetUser.username} · {isMe ? 'Votre Profil' : 'Contact Flex'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isMe && !isEditing && (
              <button
                onClick={handleStartEdit}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-violet-300 border border-neutral-700 transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>
            )}
            <button
              onClick={closeProfilePhotoModal}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {saveSuccess && (
            <div className="p-3 bg-violet-950/80 border border-violet-700 text-violet-200 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-bounce">
              <Check className="w-4 h-4 text-violet-400" />
              <span>Profil et photo mis à jour avec succès !</span>
            </div>
          )}

          {/* Photo Display Zone */}
          <div className="relative flex flex-col items-center justify-center p-4 bg-neutral-950/60 rounded-3xl border border-neutral-800/80">
            <div className="relative overflow-hidden rounded-full w-52 h-52 sm:w-64 sm:h-64 border-4 border-violet-600/50 shadow-2xl shadow-violet-900/30 flex items-center justify-center bg-neutral-900">
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                referrerPolicy="no-referrer"
                style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease-out' }}
                className="w-full h-full object-cover select-none"
              />
            </div>

            {/* Photo Zoom Controls */}
            <div className="flex items-center gap-2 mt-4 bg-neutral-900/90 border border-neutral-800 rounded-full px-3 py-1 text-xs text-neutral-400">
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
                className="p-1.5 hover:text-white hover:bg-neutral-800 rounded-full"
                title="Dézoomer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px] px-1">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
                className="p-1.5 hover:text-white hover:bg-neutral-800 rounded-full"
                title="Zoomer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 hover:text-white hover:bg-neutral-800 rounded-full ml-1"
                title="Réinitialiser"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Photo Upload Trigger if Self */}
            {isMe && (
              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-violet-900/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Changer ma photo de profil</span>
                </button>
              </div>
            )}
          </div>

          {/* User Details Form or Presentation */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
              <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                Modifier mes informations
              </h3>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Nom d'affichage
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Bio / Statut
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Numéro de puce SIM (Sécurité active)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Adresse e-mail de secours
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs sm:text-sm font-bold hover:bg-neutral-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-900/30 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {/* Bio zone */}
              <div className="p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-2xl">
                <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider block mb-1">
                  Statut & Bio
                </span>
                <p className="text-sm sm:text-base font-medium text-neutral-200 leading-relaxed">
                  {targetUser.bio || 'Membre actif sur le réseau Flex Online.'}
                </p>
              </div>

              {/* Phone & Email zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-950 border border-violet-800/50 flex items-center justify-center text-violet-400 shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Puce SIM / Téléphone
                    </span>
                    <p className="text-xs sm:text-sm font-mono font-bold text-white truncate">
                      {targetUser.phone || 'Non renseigné'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      E-mail de secours
                    </span>
                    <p className="text-xs sm:text-sm font-mono font-bold text-white truncate">
                      {targetUser.email || 'diohfranckalex1@gmail.com'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Recovery Key (if self) */}
              {isMe && targetUser.recoveryKey && (
                <div className="p-3.5 bg-violet-950/30 border border-violet-800/50 rounded-2xl flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black text-violet-300 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                      Clé de récupération d'urgence
                    </span>
                    <p className="text-xs sm:text-sm font-mono font-bold text-violet-200 mt-0.5">
                      {targetUser.recoveryKey}
                    </p>
                  </div>
                  <span className="text-[10px] text-neutral-400 max-w-[150px] text-right">
                    Permet de restaurer votre compte en cas de perte de téléphone
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
