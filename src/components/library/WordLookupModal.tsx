import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookMarked, 
  Volume2, 
  Languages, 
  Sparkles, 
  Copy, 
  Check, 
  Info,
  GraduationCap,
  History,
  FileText
} from 'lucide-react';
import { WordDefinitionResult } from '../../utils/lexiconHelper';

interface WordLookupModalProps {
  lookupData: WordDefinitionResult | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  targetLangName?: string;
}

export const WordLookupModal: React.FC<WordLookupModalProps> = ({
  lookupData,
  isLoading,
  isOpen,
  onClose,
  targetLangName = 'Français'
}) => {
  const [copied, setCopied] = useState(false);
  const [isPronouncing, setIsPronouncing] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [lookupData?.word]);

  if (!isOpen) return null;

  const handlePronounce = () => {
    if (!lookupData?.word || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(lookupData.word);
    utter.lang = 'fr-FR';
    utter.rate = 0.9;
    utter.onend = () => setIsPronouncing(false);
    utter.onerror = () => setIsPronouncing(false);
    setIsPronouncing(true);
    window.speechSynthesis.speak(utter);
  };

  const handleCopy = () => {
    if (!lookupData) return;
    const text = `${lookupData.word} (${lookupData.gender}) : ${lookupData.definition}\nÉtymologie : ${lookupData.etymology || 'N/A'}\nContexte : ${lookupData.contextExplanation || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-text"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-teal-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl text-neutral-100 space-y-4 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-black text-teal-400 block">
                Dictionnaire Pédagogique & Grammatical
              </span>
              <span className="text-xs text-neutral-400">
                Analyse complète pour les étudiants & lecteurs
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-teal-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-teal-300 font-medium">Recherche lexicale, étymologique et grammaticale...</p>
          </div>
        ) : lookupData ? (
          <div className="space-y-4">
            
            {/* Word Title & Pronunciation & Nature */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide capitalize">
                  {lookupData.word}
                </h3>
                
                {/* Audio voice pronunciation */}
                <button
                  onClick={handlePronounce}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isPronouncing 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' 
                      : 'bg-neutral-800 hover:bg-neutral-700 text-teal-300 border-neutral-700'
                  }`}
                  title="Écouter la prononciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Grammatical Nature & Gender Badge */}
              <span className="px-3 py-1.5 rounded-full bg-teal-950 text-teal-300 border border-teal-600/70 font-bold text-xs shadow-xs">
                {lookupData.gender}
              </span>
            </div>

            {/* Phonetic & Etymology row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {lookupData.phonetic && (
                <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                  <span className="font-bold text-neutral-400 block mb-0.5">Phonétique :</span>
                  <span className="font-mono text-teal-300 text-sm">{lookupData.phonetic}</span>
                </div>
              )}
              {lookupData.etymology && (
                <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex items-start gap-2">
                  <History className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-400 block mb-0.5">Étymologie :</span>
                    <span className="text-neutral-300 leading-snug">{lookupData.etymology}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Définition Complète */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Définition & Portée Sémantique
              </span>
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-serif">
                {lookupData.definition}
              </p>
            </div>

            {/* Context Explanation */}
            {lookupData.contextExplanation && (
              <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-800/50 space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Portée dans l'œuvre & nuance littéraire :
                </span>
                <p className="text-neutral-300 italic leading-relaxed">
                  « {lookupData.contextExplanation} »
                </p>
              </div>
            )}

            {/* Example sentence */}
            {lookupData.exampleSentence && (
              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-1 text-xs">
                <span className="font-bold text-neutral-400 flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-teal-400" />
                  Exemple d'usage littéraire :
                </span>
                <p className="text-neutral-200 font-mono text-[11px] leading-relaxed">
                  {lookupData.exampleSentence}
                </p>
              </div>
            )}

            {/* Synonyms, Antonyms & Translation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {lookupData.synonyms && lookupData.synonyms.length > 0 && (
                <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
                  <span className="font-bold text-neutral-400">Synonymes :</span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {lookupData.synonyms.map((syn, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-neutral-800 text-teal-300 text-[11px]">
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {lookupData.antonyms && lookupData.antonyms.length > 0 && (
                <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
                  <span className="font-bold text-neutral-400">Antonymes :</span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {lookupData.antonyms.map((ant, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-neutral-800 text-red-300 text-[11px]">
                        {ant}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {lookupData.translation && (
                <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1 sm:col-span-2">
                  <span className="font-bold text-neutral-400 flex items-center gap-1">
                    <Languages className="w-3 h-3 text-cyan-400" />
                    Traduction ({targetLangName}) :
                  </span>
                  <p className="text-white font-semibold text-sm pt-0.5 capitalize">
                    {lookupData.translation}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-neutral-800 text-xs">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copié !" : "Copier la fiche complète"}</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold transition cursor-pointer"
              >
                Reprendre la lecture
              </button>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};
