import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center gap-3 rounded-2xl bg-amber-600 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in"
    >
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
        <WifiOff className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-bold">Mode Hors-Ligne</p>
        <p className="text-[11px] text-amber-100 font-normal">
          Connexion coupée. Vos messages et données enregistrées restent consultables.
        </p>
      </div>
    </div>
  );
};
