import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle, Monitor, ExternalLink, ArrowRight } from 'lucide-react';
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
  const [showGuide, setShowGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [isInsideIframe, setIsInsideIframe] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeTab, setActiveTab] = useState<'pc' | 'mobile'>('pc');

  useEffect(() => {
    try {
      setIsInsideIframe(window.self !== window.top);
    } catch (e) {
      setIsInsideIframe(true);
    }
    const isMobileDevice = /iphone|ipad|ipod|android/.test(navigator.userAgent.toLowerCase());
    setIsDesktop(!isMobileDevice);
    setActiveTab(!isMobileDevice ? 'pc' : 'mobile');
  }, []);

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
        return;
      }
    }
    // If prompt is not available or inside iframe, show step-by-step guide
    setShowGuide(true);
  };

  const handleOpenInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  if (installedSuccess) {
    return (
      <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-violet-300 bg-violet-950/80 border border-violet-800/60 rounded-full animate-fade-in">
        <CheckCircle className="w-3.5 h-3.5 text-violet-400" />
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
          title="Installer Flex Online sur votre PC ou téléphone"
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-2xl shadow-md shadow-violet-950/50 transition-all active:scale-95 border border-violet-400/40 ${className}`}
        >
          {isDesktop ? (
            <Monitor className="w-3.5 h-3.5 shrink-0 text-violet-200" />
          ) : (
            <Smartphone className="w-3.5 h-3.5 shrink-0 text-violet-200" />
          )}
          <span className="whitespace-nowrap hidden sm:inline">Installer l'app</span>
          <span className="whitespace-nowrap sm:hidden">Installer</span>
        </button>
      )}

      {variant === 'full' && (
        <button
          id="btn-install-pwa-full"
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-violet-500 hover:to-indigo-500 transition-all active:scale-98 ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Installer l'application Flex Online (PC & Mobile)</span>
        </button>
      )}

      {/* Installation Guide Modal (PC & Mobile) */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            id="pwa-install-guide-modal"
            className="w-full max-w-md rounded-3xl bg-neutral-900 p-6 shadow-2xl border border-violet-900/60 text-neutral-100 relative"
          >
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-950/80 border border-violet-700/60 text-violet-300 flex items-center justify-center">
                {activeTab === 'pc' ? <Monitor className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight">Installer Flex Online</h3>
                <p className="text-xs text-neutral-400">Application de bureau et mobile sans magasin d'apps</p>
              </div>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex p-1 bg-neutral-950 rounded-xl mb-4 border border-neutral-800">
              <button
                onClick={() => setActiveTab('pc')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'pc'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sur PC (Windows / Mac)</span>
              </button>
              <button
                onClick={() => setActiveTab('mobile')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'mobile'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sur Téléphone</span>
              </button>
            </div>

            {/* PC Guide */}
            {activeTab === 'pc' && (
              <div className="space-y-3 text-xs text-neutral-300 mb-5">
                {isInsideIframe && (
                  <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-200 space-y-2">
                    <p className="font-semibold flex items-center gap-1.5 text-amber-300">
                      <span>Important pour l'installation sur PC :</span>
                    </p>
                    <p className="text-[11px] leading-relaxed text-amber-200/90">
                      Vous êtes actuellement dans l'aperçu intégré. Les navigateurs (Chrome, Edge) demandent d'ouvrir le site dans un onglet normal pour afficher le bouton d'installation sur le bureau.
                    </p>
                    <button
                      onClick={handleOpenInNewTab}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black rounded-lg text-xs transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ouvrir dans un nouvel onglet pour installer</span>
                    </button>
                  </div>
                )}

                <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                      1
                    </div>
                    <div className="pt-0.5">
                      Dans votre navigateur (<strong>Google Chrome</strong> ou <strong>Microsoft Edge</strong>), regardez à l'extrémité droite de la <strong>barre d'adresse</strong> (en haut).
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                      2
                    </div>
                    <div className="pt-0.5">
                      Cliquez sur la petite icône avec un écran et une flèche :{' '}
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-neutral-800 text-violet-300 rounded font-semibold border border-neutral-700">
                        <Download className="w-3 h-3 text-violet-400" />
                        Installer Flex Online
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                      3
                    </div>
                    <div className="pt-0.5">
                      Cliquez sur <strong>« Installer »</strong>. L'application s'ouvrira immédiatement dans sa propre fenêtre autonome avec un raccourci placé sur votre Bureau et dans le menu Démarrer !
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 text-center">
                  💡 <em>Astuce : vous pouvez aussi cliquer sur les 3 points du navigateur (⋮) &gt; « Enregistrer et partager » &gt; « Installer Flex Online ».</em>
                </p>
              </div>
            )}

            {/* Mobile Guide */}
            {activeTab === 'mobile' && (
              <div className="space-y-3 text-xs text-neutral-300 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                    1
                  </div>
                  <div className="pt-0.5">
                    Sur <strong>iPhone / iPad</strong> : appuyez sur le bouton <strong>Partager</strong>{' '}
                    <Share2 className="w-3.5 h-3.5 inline text-violet-400 ml-0.5" /> dans la barre Safari (en bas ou en haut).
                    <br />
                    Sur <strong>Android</strong> : appuyez sur les <strong>3 points (⋮)</strong> en haut à droite de Google Chrome.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                    2
                  </div>
                  <div className="pt-0.5">
                    Faites défiler vers le bas et appuyez sur{' '}
                    <strong className="text-white">« Sur l'écran d'accueil »</strong> ou <strong className="text-white">« Installer l'application »</strong>{' '}
                    <PlusSquare className="w-3.5 h-3.5 inline text-violet-400 ml-0.5" />.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                    3
                  </div>
                  <div className="pt-0.5">
                    Appuyez sur <strong>Ajouter</strong> (ou Installer). Le logo violet Flex Online apparaîtra directement sur l'écran d'accueil de votre téléphone comme une véritable application mobile !
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowGuide(false)}
                className="flex-1 rounded-xl bg-neutral-800 py-2.5 text-xs font-bold text-neutral-200 hover:bg-neutral-700 transition"
              >
                Fermer
              </button>
              {activeTab === 'pc' && (
                <button
                  onClick={handleOpenInNewTab}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 py-2.5 text-xs font-bold text-white hover:bg-violet-500 transition shadow-md shadow-violet-900/40"
                >
                  <span>Ouvrir en grand</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
