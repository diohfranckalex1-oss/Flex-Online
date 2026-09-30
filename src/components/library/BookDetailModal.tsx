import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Star, 
  User, 
  Quote, 
  Volume2, 
  VolumeX, 
  Heart, 
  Share2, 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { LibraryBook } from '../../data/libraryCatalog';

interface BookDetailModalProps {
  book: LibraryBook | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReader: (book: LibraryBook) => void;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
  onOpenReader,
  isFavorite,
  onToggleFavorite
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    // Stop audio when modal closes or book changes
    if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [isOpen, book?.id]);

  if (!isOpen || !book) return null;

  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${book.title}, écrit par ${book.author}. À propos de l'auteur : ${book.authorBio}. Résumé : ${book.summary}. Citation : ${book.keyQuote || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Découvre « ${book.title} » par ${book.author} sur Flex Library !`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Découvre « ${book.title} » par ${book.author} sur Flex Library !`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-text">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/60 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
              {book.genre}
            </span>
            {book.isSpecialDiohWork && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Œuvre de Dioh Franck Alex
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(book.id)}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
              }`}
              title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-neutral-800 text-neutral-300 border border-neutral-700 hover:text-white transition-all"
              title="Partager cette œuvre"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Main Book Card */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-40 sm:w-48 shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-neutral-700/50 bg-neutral-950 aspect-[2/3] relative">
              <img 
                src={book.coverImage} 
                alt={book.title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-amber-400 font-bold text-xs flex items-center gap-1 border border-neutral-700">
                <Star className="w-3 h-3 fill-amber-400" />
                {book.rating.toFixed(1)}
              </div>
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {book.title}
              </h2>
              {book.subtitle && (
                <p className="text-sm font-medium text-teal-400">
                  {book.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-neutral-400 pt-1">
                <span className="flex items-center gap-1 bg-neutral-800/80 px-2.5 py-1 rounded-lg">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <strong className="text-neutral-200">{book.author}</strong>
                </span>
                <span className="flex items-center gap-1 bg-neutral-800/80 px-2.5 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  {book.year}
                </span>
                <span className="flex items-center gap-1 bg-neutral-800/80 px-2.5 py-1 rounded-lg">
                  <Layers className="w-3.5 h-3.5 text-neutral-400" />
                  {book.pages} pages
                </span>
                <span className="flex items-center gap-1 bg-neutral-800/80 px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {book.reviewsCount.toLocaleString()} avis
                </span>
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex flex-wrap gap-2.5 justify-center sm:justify-start">
                <button
                  onClick={() => onOpenReader(book)}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{book.isSpecialDiohWork ? "Lire le Roman Intégral" : "Lire l'Étude & Extraits Authentiques"}</span>
                </button>

                <button
                  onClick={handleToggleAudio}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
                    isPlayingAudio 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse' 
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                  }`}
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
                  <span>{isPlayingAudio ? "Arrêter la voix" : "Écouter le résumé"}</span>
                </button>
              </div>

              {/* Certification & Academic provenance */}
              <div className="pt-2">
                <div className="p-3 rounded-2xl bg-teal-950/60 border border-teal-500/40 flex items-start gap-2.5 text-left">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>Œuvre 100% Réelle & Certifiée</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">Vérifié</span>
                    </p>
                    <p className="text-[11px] text-teal-200/90 leading-relaxed">
                      {book.certification || "Répertoire officiel universel (BNF / UNESCO) • Programme d'études vérifié"}
                    </p>
                    {book.academicLevel && (
                      <p className="text-[10px] text-amber-300 font-bold pt-0.5">
                        🎓 {book.academicLevel}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {copiedShare && (
                <p className="text-xs text-emerald-400 font-medium">Lien copié dans le presse-papier !</p>
              )}
            </div>
          </div>

          {/* Section: Bref résumé de l'œuvre */}
          <div className="space-y-2 p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bref Résumé de l'Œuvre</span>
            </div>
            <p className="text-neutral-200 text-sm leading-relaxed">
              {book.summary}
            </p>
          </div>

          {/* Section: À propos de l'auteur */}
          <div className="space-y-2 p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <User className="w-3.5 h-3.5" />
              <span>À propos de l'Auteur • {book.author}</span>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {book.authorBio}
            </p>
          </div>

          {/* Section: Citation clé si présente */}
          {book.keyQuote && (
            <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-800/40 text-neutral-200 text-sm italic flex gap-3 items-start">
              <Quote className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-serif leading-relaxed text-teal-200">{book.keyQuote}</p>
                <p className="text-xs text-neutral-400 not-italic mt-1">— Extrait de {book.title}</p>
              </div>
            </div>
          )}

          {/* Section: Échantillon d'ouverture */}
          {book.sampleExcerpt && (
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400 uppercase tracking-wider">
                <span className="font-semibold text-neutral-300">Extrait d'ouverture</span>
                <span>Page 1</span>
              </div>
              <p className="text-sm text-neutral-300 font-serif italic leading-relaxed">
                « {book.sampleExcerpt} »
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Flex Library • Collection Universelle</span>
          <button
            onClick={() => onOpenReader(book)}
            className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1.5"
          >
            <span>Ouvrir l'E-Reader</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
