import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Smartphone, 
  ShieldCheck, 
  Trash2, 
  Plus, 
  Check, 
  Copy, 
  X,
  Monitor,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FlexQRCodeScanner } from './FlexQRCodeScanner';

interface LinkedDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile';
  browser: string;
  os: string;
  lastActive: string;
  isCurrent: boolean;
  ipLocation: string;
}

interface LinkedDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkedDevicesModal: React.FC<LinkedDevicesModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useApp();

  const [devices, setDevices] = useState<LinkedDevice[]>(() => {
    try {
      const saved = localStorage.getItem('flex_online_linked_devices');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'dev-1',
        name: 'Cet appareil (Navigateur principal)',
        type: 'mobile',
        browser: 'Navigateur Web PWA',
        os: 'Mobile / Bureau',
        lastActive: 'Actif maintenant',
        isCurrent: true,
        ipLocation: 'Paris, France',
      },
      {
        id: 'dev-2',
        name: 'Google Chrome (PC Windows 11)',
        type: 'desktop',
        browser: 'Chrome 128.0',
        os: 'Windows 11 Pro',
        lastActive: 'Aujourd’hui à 11:42',
        isCurrent: false,
        ipLocation: 'Paris, France',
      },
      {
        id: 'dev-3',
        name: 'Apple Safari (MacBook Air M2)',
        type: 'desktop',
        browser: 'Safari 18.0',
        os: 'macOS Sequoia',
        lastActive: 'Hier à 19:15',
        isCurrent: false,
        ipLocation: 'Lyon, France',
      }
    ];
  });

  const [pairingCode, setPairingCode] = useState(() => `FLX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [copied, setCopied] = useState(false);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<'desktop' | 'mobile'>('desktop');

  const saveDevices = (updated: LinkedDevice[]) => {
    setDevices(updated);
    try {
      localStorage.setItem('flex_online_linked_devices', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateCode = () => {
    setPairingCode(`FLX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleDisconnectDevice = (id: string) => {
    const updated = devices.filter((d) => d.id !== id);
    saveDevices(updated);
  };

  const handleDisconnectAll = () => {
    if (window.confirm('Déconnecter tous les appareils secondaires (PC, tablettes et autres téléphones) ?')) {
      const currentOnly = devices.filter((d) => d.isCurrent);
      saveDevices(currentOnly);
    }
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    const newDev: LinkedDevice = {
      id: `dev-${Date.now()}`,
      name: newDeviceName.trim(),
      type: newDeviceType,
      browser: newDeviceType === 'desktop' ? 'Chrome sur Desktop' : 'Safari Mobile',
      os: newDeviceType === 'desktop' ? 'Windows / Mac' : 'iOS / Android',
      lastActive: 'À l’instant',
      isCurrent: false,
      ipLocation: 'Session chiffrée P2P',
    };

    saveDevices([...devices, newDev]);
    setNewDeviceName('');
    setIsAddingDevice(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-neutral-100 animate-scale-in">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-violet-950/60 flex items-center justify-between sticky top-0 bg-neutral-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 border border-violet-500/40 text-white flex items-center justify-center shadow-lg shadow-violet-950/50">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Appareils connectés (Flex Web & PC)</h2>
              <p className="text-[11px] text-violet-300/80">Liez votre compte à un PC Windows ou un autre téléphone</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 flex-1">
          
          {/* QR Code & Pairing Section (Ready to be scanned or to scan) */}
          <FlexQRCodeScanner 
            onSuccessPair={(name) => {
              const newDev: LinkedDevice = {
                id: `dev-${Date.now()}`,
                name,
                type: 'desktop',
                browser: 'Flex Web Client',
                os: 'Windows 11',
                lastActive: 'Actif maintenant',
                isCurrent: false,
                ipLocation: 'Paris, France'
              };
              saveDevices([newDev, ...devices]);
            }}
          />

          {/* Connected Devices List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Appareils autorisés ({devices.length})
              </h3>
              <button
                onClick={() => setIsAddingDevice(!isAddingDevice)}
                className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Lier un appareil
              </button>
            </div>

            {/* Add Device Form Toggle */}
            {isAddingDevice && (
              <form onSubmit={handleAddDevice} className="p-3 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2.5 animate-fade-in">
                <p className="text-xs font-bold text-white">Ajouter un nouveau poste connecté</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nom de l'appareil (ex: PC Bureau, iPad Pro...)"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                    autoFocus
                  />
                  <select
                    value={newDeviceType}
                    onChange={(e) => setNewDeviceType(e.target.value as any)}
                    className="px-2.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300"
                  >
                    <option value="desktop">Ordinateur / PC</option>
                    <option value="mobile">Téléphone / Tablette</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingDevice(false)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 text-xs text-neutral-400 hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xs"
                  >
                    Valider le lien
                  </button>
                </div>
              </form>
            )}

            {/* Device Items */}
            <div className="space-y-2">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-2xl flex items-center justify-between gap-3 hover:border-neutral-700 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-neutral-300">
                      {device.type === 'desktop' ? (
                        <Monitor className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <Smartphone className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 truncate">
                        <p className="text-xs font-bold text-white truncate">{device.name}</p>
                        {device.isCurrent && (
                          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[9px] font-bold shrink-0">
                            Cet appareil
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {device.browser} • {device.os}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {device.lastActive} • {device.ipLocation}
                      </p>
                    </div>
                  </div>

                  {!device.isCurrent && (
                    <button
                      onClick={() => handleDisconnectDevice(device.id)}
                      className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 transition shrink-0"
                      title="Déconnecter cette session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Banner */}
          <div className="p-3 bg-neutral-950 border border-neutral-800/60 rounded-xl flex items-start gap-2.5 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Flex Online utilise une topologie multi-sessions chiffrée. Vous pouvez envoyer et recevoir des messages même si votre téléphone principal est éteint.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={handleDisconnectAll}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 transition"
          >
            Déconnecter tous les appareils
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
