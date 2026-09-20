import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '', 
  variant = 'compact' 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // If already installed as a standalone app, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // For browsers where beforeinstallprompt hasn't fired yet or manual install:
      setShowIOSGuide(true);
    }
  };

  if (installedSuccess) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-full animate-fade-in">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>Application installée !</span>
      </div>
    );
  }

  return (
    <>
      {variant === 'compact' && (
        <button
          id="btn-install-pwa-compact"
          onClick={handleInstallClick}
          title="Installer Flex Online sur votre téléphone"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full shadow-2xs transition-all active:scale-95 ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Installer l'app</span>
          <span className="sm:hidden">App</span>
        </button>
      )}

      {variant === 'full' && (
        <button
          id="btn-install-pwa-full"
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-xs hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-98 ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Installer l'application sur ce téléphone</span>
        </button>
      )}

      {/* iOS & Manual Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div 
            id="pwa-install-guide-modal"
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-neutral-200 text-neutral-900 relative"
          >
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Installer Flex Online</h3>
                <p className="text-xs text-neutral-500">Accédez-y en 1 clic comme une vraie application mobile</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-neutral-700 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                  1
                </div>
                <div className="pt-0.5">
                  Sur iPhone ou iPad : appuyez sur le bouton <strong>Partager</strong>{' '}
                  <Share2 className="w-3.5 h-3.5 inline text-emerald-600 ml-0.5" /> dans la barre Safari.
                  <br />
                  Sur Android : appuyez sur les <strong>3 points</strong> en haut à droite.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                  2
                </div>
                <div className="pt-0.5">
                  Faites défiler vers le bas et appuyez sur{' '}
                  <strong>« Sur l'écran d'accueil »</strong>{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline text-emerald-600 ml-0.5" />.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                  3
                </div>
                <div className="pt-0.5">
                  Appuyez sur <strong>Ajouter</strong> en haut à droite. L'icône Flex Online apparaîtra sur votre écran d'accueil avec vos données sécurisées !
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};
