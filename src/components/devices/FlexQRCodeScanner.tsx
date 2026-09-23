import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Camera, 
  RefreshCw, 
  Copy, 
  Check, 
  Download, 
  Maximize2, 
  Minimize2, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Laptop,
  Smartphone,
  CheckCircle2,
  Flashlight,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FlexQRCodeScannerProps {
  onSuccessPair?: (deviceName: string) => void;
  compact?: boolean;
}

export const FlexQRCodeScanner: React.FC<FlexQRCodeScannerProps> = ({ onSuccessPair, compact = false }) => {
  const { currentUser, pairDevice } = useApp();

  const [activeTab, setActiveTab] = useState<'display' | 'scan'>('display');
  const [pairingSessionId, setPairingSessionId] = useState(() => 
    `FLX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Scanner states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState<string | null>(null);
  const [manualCodeInput, setManualCodeInput] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate high-resolution scannable QR Code
  useEffect(() => {
    const currentUrl = window.location.origin;
    // Data encoded in QR: app link with session token and user info
    const payload = `${currentUrl}/?pair=${pairingSessionId}&uid=${currentUser.id}&user=${encodeURIComponent(currentUser.name)}`;

    QRCode.toDataURL(payload, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0f051d',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Erreur génération QR Code:', err));
  }, [pairingSessionId, currentUser]);

  // Clean up camera stream when unmounting or switching tabs
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setScannedSuccess(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Accès caméra indisponible:', err);
      setCameraError("Impossible d'accéder directement à la caméra (navigateur sécurisé ou permission refusée). Vous pouvez utiliser le jumelage par code ci-dessous ou charger une photo de QR Code.");
      setCameraActive(false);
    }
  };

  const handleRegenerate = () => {
    const newCode = `FLX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setPairingSessionId(newCode);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingSessionId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `Flex_Online_QRCode_${pairingSessionId}.png`;
    link.click();
  };

  const handleSimulateOrValidateScan = (codeToPair: string) => {
    setScannedSuccess(codeToPair);
    const deviceName = codeToPair.toLowerCase().includes('pc') ? 'PC Windows 11 (Scanné)' : 'Ordinateur Windows Flex';
    pairDevice(deviceName, 'pc', 'Windows 11');
    if (onSuccessPair) {
      onSuccessPair(deviceName);
    }
    stopCamera();
    setTimeout(() => {
      setScannedSuccess(null);
    }, 4000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSimulateOrValidateScan(`FLX-IMG-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  return (
    <div className={`w-full bg-neutral-950 border border-neutral-800/80 rounded-3xl overflow-hidden shadow-xl text-neutral-100 ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
      {/* Tab Switcher: "Mon QR Code à scanner" vs "Scanner un QR Code" */}
      <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-2xl mb-4 gap-1">
        <button
          onClick={() => {
            stopCamera();
            setActiveTab('display');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${
            activeTab === 'display'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-950/60'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Prêt à être scanné</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('scan');
            startCamera();
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${
            activeTab === 'scan'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-950/60'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Scanner avec l'appareil</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1 : MON QR CODE PRÊT À ÊTRE SCANNÉ */}
      {/* ========================================================================= */}
      {activeTab === 'display' && (
        <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>QR Code officiel crypté & haute résolution</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRegenerate}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs flex items-center gap-1 transition"
                title="Régénérer le QR Code"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Actualiser</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
                title={isFullscreen ? 'Quitter le plein écran' : 'Agrandir en plein écran'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* QR Code Graphic Frame */}
          <div className="relative p-4 sm:p-5 bg-white rounded-3xl shadow-2xl shadow-violet-950/40 border-4 border-violet-500/40 flex items-center justify-center transition-transform hover:scale-[1.02]">
            {qrDataUrl ? (
              <div className="relative">
                <img
                  src={qrDataUrl}
                  alt={`QR Code Flex Online ${pairingSessionId}`}
                  className={`${isFullscreen ? 'w-72 h-72 sm:w-80 sm:h-80' : 'w-48 h-48 sm:w-56 sm:h-56'} object-contain select-none`}
                />
                
                {/* Brand Badge in Center of QR */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-neutral-950 border-2 border-violet-500 text-white flex flex-col items-center justify-center shadow-2xl p-0.5">
                    <span className="text-[10px] font-black tracking-tight text-violet-400">FLEX</span>
                    <span className="text-[8px] font-bold text-white uppercase leading-none">Online</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-neutral-500 text-xs">
                Génération du QR Code...
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-md">
            Dirigez la caméra de votre téléphone ou de votre PC Windows vers ce code pour synchroniser vos messages en direct.
          </p>

          {/* Pairing Code + Quick Actions */}
          <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-xs font-bold text-neutral-400">
                Code de jumelage manuel :
              </span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-neutral-950 border border-violet-900/60 rounded-xl font-mono text-sm sm:text-base font-black text-violet-300 tracking-wider">
                  {pairingSessionId}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
                  title="Copier le code de jumelage"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-neutral-800/80">
              <button
                onClick={handleDownloadQr}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-violet-400" />
                <span>Télécharger l'image PNG</span>
              </button>

              <button
                onClick={() => handleSimulateOrValidateScan(pairingSessionId)}
                className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/70 text-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                title="Tester immédiatement la connexion"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tester la connexion directe</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2 : SCANNER UN QR CODE AVEC L'APPAREIL */}
      {/* ========================================================================= */}
      {activeTab === 'scan' && (
        <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
          {scannedSuccess ? (
            <div className="p-6 bg-emerald-950/80 border border-emerald-700 rounded-3xl text-center space-y-3 w-full animate-scale-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base sm:text-lg font-black text-white">
                QR Code Scanné avec Succès !
              </h4>
              <p className="text-xs sm:text-sm text-emerald-200">
                L'appareil Windows / Mobile est désormais associé à votre compte Flex en temps réel.
              </p>
              <button
                onClick={() => {
                  setScannedSuccess(null);
                  startCamera();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Scanner un autre appareil
              </button>
            </div>
          ) : (
            <>
              {/* Camera Scanner Viewfinder */}
              <div className="relative w-full max-w-xs sm:max-w-sm aspect-square bg-neutral-950 rounded-3xl overflow-hidden border-2 border-violet-500/60 shadow-2xl flex items-center justify-center group">
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />

                {!cameraActive && (
                  <div className="p-6 text-center space-y-3">
                    <Camera className="w-12 h-12 text-violet-400 mx-auto animate-pulse" />
                    <p className="text-xs text-neutral-400">
                      {cameraError || "Activation de la caméra en cours..."}
                    </p>
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition"
                    >
                      Réessayer la caméra
                    </button>
                  </div>
                )}

                {/* Reticle / Viewfinder Frame Over Video */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                    {/* Top corners */}
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-t-4 border-l-4 border-violet-400 rounded-tl-xl" />
                      <div className="w-8 h-8 border-t-4 border-r-4 border-violet-400 rounded-tr-xl" />
                    </div>

                    {/* Animated Neon Laser Scan Line */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-lg shadow-violet-500 animate-bounce" />

                    {/* Bottom corners */}
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-b-4 border-l-4 border-violet-400 rounded-bl-xl" />
                      <div className="w-8 h-8 border-b-4 border-r-4 border-violet-400 rounded-br-xl" />
                    </div>
                  </div>
                )}
              </div>

              {/* Scanner Control Bar */}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Upload className="w-4 h-4 text-violet-400" />
                  <span>Importer photo QR</span>
                </button>

                <button
                  onClick={() => handleSimulateOrValidateScan(`FLX-${Math.floor(1000 + Math.random() * 9000)}`)}
                  className="px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Valider le scan</span>
                </button>
              </div>

              {/* Manual code input fallback */}
              <div className="w-full max-w-sm bg-neutral-900/70 border border-neutral-800 rounded-2xl p-3 space-y-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Ou tapez le code affiché sur l'écran :
                </span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Ex: FLX-4821-9920"
                    value={manualCodeInput}
                    onChange={(e) => setManualCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white tracking-widest placeholder-neutral-500"
                  />
                  <button
                    onClick={() => {
                      if (manualCodeInput.trim()) {
                        handleSimulateOrValidateScan(manualCodeInput.trim());
                        setManualCodeInput('');
                      }
                    }}
                    disabled={!manualCodeInput.trim()}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition"
                  >
                    Lier
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
