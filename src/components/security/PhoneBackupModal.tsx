import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  X, 
  Lock, 
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PhoneBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneBackupModal: React.FC<PhoneBackupModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateSecurityPin } = useApp();
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [restoreStatus, setRestoreStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentPin = currentUser.securityPin || '1234';
  const recoveryKey = currentUser.recoveryKey || 'FLEX-7A9B-44C1';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(recoveryKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleCopyUser = () => {
    navigator.clipboard.writeText(currentUser.username);
    setCopiedUser(true);
    setTimeout(() => setCopiedUser(false), 2500);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      alert('Le code PIN doit comporter au moins 4 chiffres.');
      return;
    }
    updateSecurityPin(newPin.trim());
    setIsEditingPin(false);
    setPinSuccess('Code PIN mis à jour avec succès !');
    setTimeout(() => setPinSuccess(''), 3500);
  };

  const handleDownloadBackup = () => {
    window.open(`/api/backup/export?userId=${encodeURIComponent(currentUser.id)}`, '_blank');
  };

  const handleFileRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setRestoreStatus(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const res = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (res.ok) {
        setRestoreStatus({
          type: 'success',
          message: 'Vos messages et contacts ont été restaurés avec succès !',
        });
      } else {
        setRestoreStatus({
          type: 'error',
          message: data.error || 'Erreur lors de la restauration du fichier.',
        });
      }
    } catch (err: any) {
      setRestoreStatus({
        type: 'error',
        message: 'Fichier invalide ou corrompu: ' + err.message,
      });
    } finally {
      setIsRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
      <div 
        id="phone-backup-modal-card"
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Sécurité & Changement de Téléphone</h3>
              <p className="text-xs text-emerald-200">Conservez l'accès à vos discussions sur tous vos appareils</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {pinSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{pinSuccess}</span>
            </div>
          )}

          {restoreStatus && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
              restoreStatus.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              {restoreStatus.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{restoreStatus.message}</span>
            </div>
          )}

          {/* Section 1: Vos identifiants de reconnexion */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                Vos identifiants de sécurité
              </h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Protégé
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Username row */}
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200/80">
                <div>
                  <p className="text-[11px] text-neutral-400 font-medium">Pseudo de connexion</p>
                  <p className="font-bold text-neutral-900">@{currentUser.username}</p>
                </div>
                <button
                  onClick={handleCopyUser}
                  className="p-1.5 text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold"
                >
                  {copiedUser ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUser ? 'Copié' : 'Copier'}</span>
                </button>
              </div>

              {/* Security PIN row */}
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200/80">
                <div>
                  <p className="text-[11px] text-neutral-400 font-medium">Code PIN de sécurité</p>
                  <p className="font-mono font-bold text-neutral-900 tracking-widest text-sm">
                    {currentPin}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditingPin(!isEditingPin)}
                  className="px-2.5 py-1 text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] font-bold transition-colors"
                >
                  {isEditingPin ? 'Annuler' : 'Modifier'}
                </button>
              </div>

              {/* Edit PIN Form */}
              {isEditingPin && (
                <form onSubmit={handleSavePin} className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2 animate-fade-in">
                  <label className="text-[11px] font-bold text-neutral-700 block">
                    Définir un nouveau code PIN (4 à 6 chiffres) :
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      maxLength={6}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Ex: 8492"
                      className="flex-1 px-3 py-1.5 text-sm font-mono tracking-widest border border-neutral-300 rounded-lg focus:outline-emerald-600"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {/* Recovery Key row */}
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200/80">
                <div>
                  <p className="text-[11px] text-neutral-400 font-medium">Clé secrète de secours</p>
                  <p className="font-mono font-semibold text-emerald-800 text-xs tracking-wider">
                    {recoveryKey}
                  </p>
                </div>
                <button
                  onClick={handleCopyKey}
                  className="p-1.5 text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copié' : 'Copier'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Comment faire sur votre nouveau téléphone */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              Comment retrouver vos données sur votre nouveau téléphone :
            </h4>
            <ol className="text-xs text-emerald-900 space-y-2 list-decimal list-inside leading-relaxed font-medium">
              <li>Ouvrez le lien de l'application ou installez <strong>Flex Online</strong> sur le nouveau téléphone.</li>
              <li>Dans le menu supérieur, appuyez sur <strong>« Se connecter »</strong>.</li>
              <li>Entrez votre pseudo <strong>@{currentUser.username}</strong> et votre code PIN (<strong>{currentPin}</strong>).</li>
              <li>Vos discussions privées, groupes, messages vocaux et publications réapparaissent instantanément !</li>
            </ol>
          </div>

          {/* Section 3: Sauvegarde manuelle & Restauration locale */}
          <div className="border border-neutral-200 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              Sauvegarde physique de secours
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Vous pouvez télécharger une archive complète de vos messages et contacts sur votre appareil pour une sécurité maximale hors-ligne.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                id="btn-download-backup"
                onClick={handleDownloadBackup}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Télécharger sauvegarde</span>
              </button>

              <button
                id="btn-trigger-restore"
                onClick={() => fileInputRef.current?.click()}
                disabled={isRestoring}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 shadow-2xs transition-colors disabled:opacity-50"
              >
                {isRestoring ? (
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>Restaurer un fichier</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileRestore}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-neutral-500 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" /> Données chiffrées & synchronisées
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
