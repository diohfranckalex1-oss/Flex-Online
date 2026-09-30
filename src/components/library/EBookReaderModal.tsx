import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  List, 
  Award, 
  Languages, 
  BookMarked, 
  User, 
  Quote, 
  RotateCcw,
  Sparkles,
  Loader2,
  Check,
  Search,
  ArrowLeft,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { BOOK_CEUX_QU_ON_N_ENTEND_PAS, BookDetail } from '../../data/bookDiohFranckAlex';
import { LibraryBook } from '../../data/libraryCatalog';
import { getFullReadableBook, FullReadableBook } from '../../data/bookContents';
import { lookupWordInfo, WordDefinitionResult } from '../../utils/lexiconHelper';
import { WordLookupModal } from './WordLookupModal';

interface EBookReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: LibraryBook | BookDetail | null;
  initialChapterIndex?: number;
}

type ReaderTheme = 'sepia' | 'ivory' | 'light' | 'dark';

interface ReaderThemeConfig {
  id: ReaderTheme;
  name: string;
  bg: string;
  text: string;
  headerBg: string;
  headerText: string;
  border: string;
  cardBg: string;
  cardBorder: string;
  hoverBg: string;
  buttonBg: string;
  buttonHover: string;
  buttonText: string;
}

const THEMES: Record<ReaderTheme, ReaderThemeConfig> = {
  sepia: {
    id: 'sepia',
    name: 'Sépia Papier',
    bg: '#fbf0d9',
    text: '#2e2014',
    headerBg: '#f0e2c5',
    headerText: '#23170d',
    border: '#dfceac',
    cardBg: '#f7ecd2',
    cardBorder: '#dfceac',
    hoverBg: 'rgba(46, 32, 20, 0.06)',
    buttonBg: '#dfceac',
    buttonHover: '#d2be97',
    buttonText: '#2e2014'
  },
  ivory: {
    id: 'ivory',
    name: 'Ivoire Doux',
    bg: '#faf7f2',
    text: '#1c1917',
    headerBg: '#ede7de',
    headerText: '#1c1917',
    border: '#dfd7cc',
    cardBg: '#ffffff',
    cardBorder: '#dfd7cc',
    hoverBg: 'rgba(28, 25, 23, 0.05)',
    buttonBg: '#dfd7cc',
    buttonHover: '#cec4b6',
    buttonText: '#1c1917'
  },
  light: {
    id: 'light',
    name: 'Blanc Pur',
    bg: '#ffffff',
    text: '#0f172a',
    headerBg: '#f8fafc',
    headerText: '#020617',
    border: '#e2e8f0',
    cardBg: '#f1f5f9',
    cardBorder: '#cbd5e1',
    hoverBg: 'rgba(15, 23, 42, 0.04)',
    buttonBg: '#e2e8f0',
    buttonHover: '#cbd5e1',
    buttonText: '#0f172a'
  },
  dark: {
    id: 'dark',
    name: 'Nuit Confort',
    bg: '#12181d',
    text: '#f1f5f9',
    headerBg: '#0b1014',
    headerText: '#ffffff',
    border: '#222f3a',
    cardBg: '#192229',
    cardBorder: '#273845',
    hoverBg: 'rgba(241, 245, 249, 0.06)',
    buttonBg: '#222f3a',
    buttonHover: '#2b3b48',
    buttonText: '#f1f5f9'
  }
};

const SUPPORTED_LANGUAGES = [
  { code: 'fr', label: '🇫🇷 Français (Original)' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'ar', label: '🇸🇦 العربية (Arabe)' },
  { code: 'zh', label: '🇨🇳 中文 (Mandarin)' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'pt', label: '🇵🇹 Português' },
  { code: 'ru', label: '🇷🇺 Русский' },
  { code: 'ja', label: '🇯🇵 日本語 (Japonais)' },
  { code: 'it', label: '🇮🇹 Italiano' },
  { code: 'sw', label: '🇰🇪 Kiswahili' },
  { code: 'wo', label: '🇸🇳 Wolof' },
  { code: 'bci', label: '🇨🇮 Baoulé' }
];

export const EBookReaderModal: React.FC<EBookReaderModalProps> = ({
  isOpen,
  onClose,
  book = BOOK_CEUX_QU_ON_N_ENTEND_PAS,
  initialChapterIndex = 0
}) => {
  // Resolved full readable book data
  const readableBook: FullReadableBook = useMemo(() => {
    return getFullReadableBook(book || BOOK_CEUX_QU_ON_N_ENTEND_PAS);
  }, [book]);

  const [currentSection, setCurrentSection] = useState<number>(initialChapterIndex);
  const [theme, setTheme] = useState<ReaderTheme>('sepia');
  const [fontSize, setFontSize] = useState<number>(18);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(false);

  // Side drawers for Summary & Author
  const [showSummaryDrawer, setShowSummaryDrawer] = useState<boolean>(false);
  const [showAuthorDrawer, setShowAuthorDrawer] = useState<boolean>(false);

  // Multi-Language Translation State
  const [selectedLang, setSelectedLang] = useState<string>('fr');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translatedParagraphsCache, setTranslatedParagraphsCache] = useState<Record<string, string[]>>({});

  // Interactive Smart Dictionary / Lexicon State
  const [selectedWordData, setSelectedWordData] = useState<WordDefinitionResult | null>(null);
  const [isLookingUpWord, setIsLookingUpWord] = useState<boolean>(false);
  const [isWordModalOpen, setIsWordModalOpen] = useState<boolean>(false);
  const [floatingSelectedWord, setFloatingSelectedWord] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  // Reset section when book changes
  useEffect(() => {
    setCurrentSection(initialChapterIndex);
    setShowToc(false);
    setShowSummaryDrawer(false);
    setShowAuthorDrawer(false);
    setFloatingSelectedWord(null);
  }, [readableBook.id, initialChapterIndex]);

  // Scroll to top and stop audio when section changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setFloatingSelectedWord(null);
  }, [currentSection]);

  // Clean speech when closing
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const sectionsList = readableBook.sections || [];
  const totalSections = sectionsList.length || 1;
  const safeSectionIndex = Math.min(Math.max(0, currentSection), totalSections - 1);
  const activeSection = sectionsList[safeSectionIndex] || {
    id: 'sec-fallback',
    title: readableBook.title,
    paragraphs: [readableBook.summary || "Bonne lecture sur Flex Library."]
  };

  // Translation handling
  const cacheKey = `${readableBook.id}_${activeSection.id}_${selectedLang}`;
  const currentParagraphs: string[] = selectedLang === 'fr' 
    ? (activeSection.paragraphs || [])
    : (translatedParagraphsCache[cacheKey] || activeSection.paragraphs || []);

  // Translate active section when language changes - MUST be called unconditionally
  useEffect(() => {
    if (!isOpen || selectedLang === 'fr' || translatedParagraphsCache[cacheKey]) {
      return;
    }

    let isMounted = true;
    setIsTranslating(true);

    const fullSectionText = (activeSection.paragraphs || []).join('\n\n---FLEX_SPLIT---\n\n');

    fetch('/api/ai/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: fullSectionText, targetLang: selectedLang }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.translation) {
          if (data.translation.includes('QUERY LENGTH LIMIT') || data.translation.includes('MYMEMORY') || data.translation.includes('<!DOCTYPE')) {
            setTranslatedParagraphsCache((prev) => ({
              ...prev,
              [cacheKey]: activeSection.paragraphs || []
            }));
            return;
          }
          const split = data.translation.split('---FLEX_SPLIT---').map((p: string) => p.trim());
          setTranslatedParagraphsCache((prev) => ({
            ...prev,
            [cacheKey]: split
          }));
        }
      })
      .catch((err) => {
        console.warn('Translation error in reader handled:', err);
      })
      .finally(() => {
        if (isMounted) setIsTranslating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedLang, currentSection, readableBook.id, cacheKey, activeSection.paragraphs, translatedParagraphsCache]);

  // Listen for text selection changes to offer quick definition popover
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!isOpen) return;
      const sel = window.getSelection()?.toString().trim();
      if (sel && sel.length >= 2 && sel.length <= 40 && !sel.includes('\n')) {
        setFloatingSelectedWord(sel.replace(/^[.,;:\'\"«»()\s\d]+|[.,;:\'\"«»()\s\d]+$/g, ''));
      } else {
        setFloatingSelectedWord(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isOpen]);

  // Global Keyboard Navigation: ArrowLeft = Page précédente, ArrowRight = Page suivante, Escape = Sortir
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSection((s) => Math.max(0, s - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentSection((s) => Math.min(totalSections - 1, s + 1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, totalSections, onClose]);

  if (!isOpen) return null;

  // Handle Double Click or Long-press / Selection on ANY word
  const handleWordSelection = async (e: React.MouseEvent | React.TouchEvent, paragraphText: string) => {
    const selection = window.getSelection()?.toString().trim();
    let wordToLookup = selection;

    if (!wordToLookup && 'target' in e) {
      const target = e.target as HTMLElement;
      const text = target.innerText || paragraphText;
      const words = text.split(/\s+/).filter(w => w.length > 2);
      if (words.length > 0) {
        wordToLookup = words[0];
      }
    }

    if (!wordToLookup || wordToLookup.length < 2) return;

    const cleanWord = wordToLookup.replace(/^[.,;:\'\"«»()\s\d—–-]+|[.,;:\'\"«»()\s\d—–-]+$/g, '');
    if (!cleanWord) return;

    executeLookup(cleanWord, paragraphText);
  };

  const executeLookup = async (word: string, context: string = '') => {
    setIsLookingUpWord(true);
    setIsWordModalOpen(true);
    setFloatingSelectedWord(null);

    try {
      const result = await lookupWordInfo(word, context, selectedLang);
      setSelectedWordData(result);
    } catch (err) {
      console.warn('Lexicon lookup failed:', err);
    } finally {
      setIsLookingUpWord(false);
    }
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${activeSection.title}. ${currentParagraphs.join(' ')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = selectedLang === 'en' ? 'en-US' : selectedLang === 'es' ? 'es-ES' : 'fr-FR';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const curTheme = THEMES[theme] || THEMES.sepia;
  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  // Calculated realistic academic page numbers
  const calculatedPage = Math.min(
    readableBook.pages,
    Math.max(1, Math.round(((safeSectionIndex + 1) / totalSections) * readableBook.pages))
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-text"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
    >
      <div 
        className="relative w-full h-full sm:h-[95vh] sm:max-w-5xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-colors duration-300 border"
        style={{ 
          backgroundColor: curTheme.bg, 
          color: curTheme.text,
          borderColor: curTheme.border
        }}
      >
        
        {/* ========================================================================= */}
        {/* TOP READER CONTROLS HEADER */}
        {/* ========================================================================= */}
        <div 
          className="px-2 sm:px-6 py-2.5 sm:py-3 border-b flex items-center justify-between z-20 backdrop-blur-md transition-colors duration-300 gap-2"
          style={{
            backgroundColor: curTheme.headerBg,
            color: curTheme.headerText,
            borderColor: curTheme.border
          }}
        >
          {/* Left: Sortir, Page Précédente, Book title & Toc Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            {/* 1. Bouton SORTIR clair, immédiat et très visible */}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-md hover:scale-105 active:scale-95 border bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30"
              title="Sortir de la lecture et revenir à la bibliothèque (Touche Échap)"
            >
              <ArrowLeft className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="font-black">Sortir</span>
            </button>

            {/* 2. Bouton PAGE PRÉCÉDENTE visible et explicite */}
            <button
              disabled={safeSectionIndex === 0}
              onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
              className="px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-30 disabled:cursor-not-allowed border hover:scale-102 active:scale-95 shadow-xs"
              style={{ backgroundColor: curTheme.buttonBg, color: curTheme.buttonText, borderColor: curTheme.border }}
              title="Aller à la page ou au chapitre précédent (Flèche gauche)"
            >
              <ChevronLeft className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="font-extrabold text-[11px] sm:text-xs">Page précédente</span>
            </button>

            {/* 3. Bouton Sommaire */}
            <button
              onClick={() => setShowToc(!showToc)}
              className="p-1.5 sm:p-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 font-bold border"
              style={{ backgroundColor: curTheme.cardBg, color: curTheme.text, borderColor: curTheme.cardBorder }}
              title="Table des matières complète"
            >
              <List className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-xs hidden md:inline">Sommaire</span>
            </button>

            <div className="min-w-0 hidden lg:block">
              <h2 className="text-xs sm:text-sm font-black truncate leading-tight">
                {readableBook.title}
              </h2>
              <p className="text-[10px] opacity-80 truncate">
                {readableBook.author} • Chap. {safeSectionIndex + 1}/{totalSections}
              </p>
            </div>
          </div>

          {/* Center / Right: Helper Tools (Summary, Author, Languages, Font, Audio) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* 1. Résumé de l'œuvre button */}
            <button
              onClick={() => setShowSummaryDrawer(true)}
              className="px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              style={{
                backgroundColor: curTheme.cardBg,
                borderColor: curTheme.cardBorder,
                color: curTheme.text
              }}
              title="Lire le résumé analytique pour mieux comprendre l'œuvre"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">Résumé</span>
            </button>

            {/* 2. À propos de l'Auteur button */}
            <button
              onClick={() => setShowAuthorDrawer(true)}
              className="px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              style={{
                backgroundColor: curTheme.cardBg,
                borderColor: curTheme.cardBorder,
                color: curTheme.text
              }}
              title="Notice biographique sur l'auteur"
            >
              <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Auteur</span>
            </button>

            {/* 3. Multi-Language Selector */}
            <div className="relative inline-block">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="text-xs font-bold py-1.5 px-2.5 rounded-xl border focus:outline-none cursor-pointer pr-7 appearance-none"
                style={{
                  backgroundColor: curTheme.cardBg,
                  borderColor: curTheme.cardBorder,
                  color: curTheme.text
                }}
                title="Traduire et lire l'œuvre dans une autre langue"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-neutral-900 text-white">
                    {l.label}
                  </option>
                ))}
              </select>
              <Languages className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>

            {/* 4. Font size adjustment */}
            <div 
              className="hidden sm:flex items-center gap-1 px-1.5 py-1 rounded-xl border"
              style={{ backgroundColor: curTheme.cardBg, borderColor: curTheme.cardBorder }}
            >
              <button
                onClick={() => setFontSize((s) => Math.max(14, s - 2))}
                className="px-2 py-0.5 text-xs font-bold rounded transition opacity-80 hover:opacity-100 cursor-pointer"
                title="Diminuer la taille de police"
              >
                A-
              </button>
              <span className="text-[11px] font-mono w-5 text-center font-bold">{fontSize}</span>
              <button
                onClick={() => setFontSize((s) => Math.min(26, s + 2))}
                className="px-2 py-0.5 text-xs font-bold rounded transition opacity-80 hover:opacity-100 cursor-pointer"
                title="Agrandir la taille de police"
              >
                A+
              </button>
            </div>

            {/* 5. Theme switcher */}
            <div 
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl border"
              style={{ backgroundColor: curTheme.cardBg, borderColor: curTheme.cardBorder }}
            >
              <button
                onClick={() => setTheme('sepia')}
                className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${theme === 'sepia' ? 'ring-2 ring-teal-500 scale-110' : ''}`}
                style={{ backgroundColor: THEMES.sepia.bg, borderColor: THEMES.sepia.border }}
                title="Papier Sépia"
              />
              <button
                onClick={() => setTheme('ivory')}
                className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${theme === 'ivory' ? 'ring-2 ring-teal-500 scale-110' : ''}`}
                style={{ backgroundColor: THEMES.ivory.bg, borderColor: THEMES.ivory.border }}
                title="Ivoire Doux"
              />
              <button
                onClick={() => setTheme('light')}
                className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${theme === 'light' ? 'ring-2 ring-teal-500 scale-110' : ''}`}
                style={{ backgroundColor: THEMES.light.bg, borderColor: THEMES.light.border }}
                title="Blanc Pur"
              />
              <button
                onClick={() => setTheme('dark')}
                className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${theme === 'dark' ? 'ring-2 ring-teal-500 scale-110' : ''}`}
                style={{ backgroundColor: THEMES.dark.bg, borderColor: THEMES.dark.border }}
                title="Nuit Confort"
              />
            </div>

            {/* 6. Text-to-speech audio reader */}
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isSpeaking 
                  ? 'bg-amber-500 text-black animate-pulse' 
                  : 'hover:opacity-80'
              }`}
              style={!isSpeaking ? { backgroundColor: curTheme.buttonBg, color: curTheme.buttonText } : {}}
              title={isSpeaking ? "Arrêter la lecture audio" : "Écouter la lecture à haute voix"}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* 7. Close reader */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:opacity-75 transition cursor-pointer ml-1"
              style={{ backgroundColor: curTheme.buttonBg, color: curTheme.buttonText }}
              title="Fermer le lecteur"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE HINT & TRANSLATION STATUS BANNER */}
        {/* ========================================================================= */}
        <div 
          className="px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs transition-colors duration-300"
          style={{ borderColor: curTheme.border, backgroundColor: curTheme.cardBg }}
        >
          <div className="flex items-center gap-2">
            <BookMarked className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              Astuce : <strong>Double-cliquez</strong> ou <strong>sélectionnez</strong> un mot pour connaître sa définition, son genre et son analyse littéraire complète.
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold">
            {selectedLang !== 'fr' && (
              <button
                onClick={() => setSelectedLang('fr')}
                className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-700 dark:text-teal-300 hover:bg-teal-500/30 transition cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Version Originale (FR)</span>
              </button>
            )}
            <span className="font-mono text-[10px] uppercase opacity-75">{activeLangObj.code}</span>
          </div>
        </div>

        {/* Translation in Progress Banner */}
        {isTranslating && (
          <div className="px-4 py-2 bg-teal-900/40 border-b border-teal-500/30 text-teal-200 text-xs flex items-center justify-center gap-2 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Traduction littéraire en cours vers {activeLangObj.label}... Veuillez patienter quelques instants.</span>
          </div>
        )}

        {/* Floating Quick Action when text is selected */}
        {floatingSelectedWord && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 animate-scale-up">
            <button
              onClick={() => executeLookup(floatingSelectedWord, currentParagraphs[0] || '')}
              className="px-4 py-2 rounded-full bg-teal-500 text-neutral-950 font-black text-xs shadow-2xl flex items-center gap-2 hover:bg-teal-400 transition cursor-pointer border-2 border-white"
            >
              <BookMarked className="w-4 h-4" />
              <span>Définir « {floatingSelectedWord} »</span>
              <Sparkles className="w-3 h-3 text-amber-900" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN READING AREA WITH SMOOTH SCROLL */}
        {/* ========================================================================= */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto p-6 sm:p-12 lg:p-16 space-y-8 max-w-3xl mx-auto w-full transition-colors duration-300"
          style={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: '1.9',
            color: curTheme.text
          }}
        >
          {/* Section Header */}
          <div className="border-b pb-6 space-y-3 text-center" style={{ borderColor: curTheme.border }}>
            {/* Quick in-text top action bar */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-2xl border text-xs max-w-lg mx-auto" style={{ backgroundColor: curTheme.cardBg, borderColor: curTheme.cardBorder }}>
              <button
                disabled={safeSectionIndex === 0}
                onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed hover:scale-102"
                style={{ backgroundColor: curTheme.buttonBg, color: curTheme.buttonText }}
                title="Revenir à la page ou au chapitre précédent"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Page précédente</span>
              </button>

              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 transition cursor-pointer text-rose-500 hover:bg-rose-500/10"
                title="Quitter la lecture et revenir aux livres"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sortir du livre</span>
              </button>

              <button
                disabled={safeSectionIndex === totalSections - 1}
                onClick={() => setCurrentSection((s) => Math.min(totalSections - 1, s + 1))}
                className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed hover:scale-102"
                style={{ backgroundColor: curTheme.buttonBg, color: curTheme.buttonText }}
                title="Passer à la page ou au chapitre suivant"
              >
                <span>Suivant</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {readableBook.isSpecialDiohWork ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Roman Officiel Intégral • Dioh Franck Alex</span>
              </span>
            ) : (
              <div className="flex flex-col items-center gap-1.5 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Œuvre Réelle Certifiée Conforme • Programme Officiel BAC & Universités</span>
                </span>
                <span className="text-[11px] font-medium opacity-85">
                  Notice authentique vérifiée BnF & UNESCO • Auteur : <strong>{readableBook.author}</strong> ({readableBook.year})
                </span>
              </div>
            )}
            
            <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
              {activeSection.title}
            </h1>
            {activeSection.subtitle && (
              <p className="text-sm font-sans font-medium opacity-80 pt-1">
                {activeSection.subtitle}
              </p>
            )}
          </div>

          {/* Section Paragraphs */}
          <div className="space-y-6 font-serif">
            {currentParagraphs.map((para, idx) => (
              <p 
                key={idx} 
                onDoubleClick={(e) => handleWordSelection(e, para)}
                className="text-justify leading-relaxed cursor-text selection:bg-teal-500/30 p-2.5 rounded-xl transition-colors"
                style={{ 
                  borderRadius: '10px'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = curTheme.hoverBg;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
                title="Double-cliquez sur n'importe quel mot pour afficher sa définition complète"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Dedicated Chapter Completion & Easy Navigation Box */}
          <div className="p-5 sm:p-6 rounded-3xl border text-center space-y-4 shadow-lg my-8" style={{ backgroundColor: curTheme.cardBg, borderColor: curTheme.cardBorder }}>
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-black uppercase tracking-wider">
                Fin du Chapitre {safeSectionIndex + 1} / {totalSections}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                disabled={safeSectionIndex === 0}
                onClick={() => {
                  setCurrentSection((s) => Math.max(0, s - 1));
                  if (contentRef.current) contentRef.current.scrollTop = 0;
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:scale-102 active:scale-95 shadow-md border"
                style={{ backgroundColor: curTheme.buttonBg, color: curTheme.buttonText, borderColor: curTheme.border }}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Aller à la page précédente</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer hover:scale-102 active:scale-95 shadow-md border bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Sortir du livre (Retour Bibliothèque)</span>
              </button>

              {safeSectionIndex < totalSections - 1 && (
                <button
                  onClick={() => {
                    setCurrentSection((s) => Math.min(totalSections - 1, s + 1));
                    if (contentRef.current) contentRef.current.scrollTop = 0;
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer hover:scale-102 active:scale-95 shadow-md text-white bg-gradient-to-r from-teal-600 to-emerald-600"
                >
                  <span>Chapitre suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Section Footer Quote / Navigation hint */}
          <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans opacity-75" style={{ borderColor: curTheme.border }}>
            <span>{readableBook.title} • {readableBook.author}</span>
            <span>Chapitre {safeSectionIndex + 1} sur {totalSections} (Page {calculatedPage}/{readableBook.pages})</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* FLOATING SIDE NAVIGATION BUTTONS (PAGE PRÉCÉDENTE / PAGE SUIVANTE) */}
        {/* ========================================================================= */}
        <button
          disabled={safeSectionIndex === 0}
          onClick={() => {
            setCurrentSection((s) => Math.max(0, s - 1));
            if (contentRef.current) contentRef.current.scrollTop = 0;
          }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none hover:scale-110 active:scale-95 flex items-center gap-1.5 group"
          style={{
            backgroundColor: curTheme.headerBg,
            color: curTheme.headerText,
            borderColor: curTheme.border,
            boxShadow: '0 8px 20px rgba(0,0,0,0.25)'
          }}
          title="Aller à la page ou au chapitre précédent (Flèche gauche)"
        >
          <ChevronLeft className="w-5 h-5 text-teal-600 dark:text-teal-400 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-black hidden md:inline">Page précédente</span>
        </button>

        <button
          disabled={safeSectionIndex === totalSections - 1}
          onClick={() => {
            setCurrentSection((s) => Math.min(totalSections - 1, s + 1));
            if (contentRef.current) contentRef.current.scrollTop = 0;
          }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none hover:scale-110 active:scale-95 flex items-center gap-1.5 group"
          style={{
            backgroundColor: curTheme.headerBg,
            color: curTheme.headerText,
            borderColor: curTheme.border,
            boxShadow: '0 8px 20px rgba(0,0,0,0.25)'
          }}
          title="Aller à la page ou au chapitre suivant (Flèche droite)"
        >
          <span className="text-xs font-black hidden md:inline">Page suivante</span>
          <ChevronRight className="w-5 h-5 text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Floating Quick Action Pill for rapid Exit & Previous Page */}
        <div className="absolute bottom-16 sm:bottom-14 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center gap-2 p-1.5 rounded-full bg-neutral-950/85 backdrop-blur-md border border-neutral-700/80 shadow-2xl text-xs font-bold pointer-events-auto">
          <button
            disabled={safeSectionIndex === 0}
            onClick={() => {
              setCurrentSection((s) => Math.max(0, s - 1));
              if (contentRef.current) contentRef.current.scrollTop = 0;
            }}
            className="px-3 py-1 rounded-full flex items-center gap-1 text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            title="Aller à la page précédente"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-teal-400" />
            <span>Page précédente</span>
          </button>

          <span className="w-px h-3 bg-neutral-700" />

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-full flex items-center gap-1 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
            title="Sortir de la lecture et revenir aux livres"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sortir du livre</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM PAGINATION BAR WITH EXPLICIT SORTIR & PAGE PRÉCÉDENTE */}
        {/* ========================================================================= */}
        <div 
          className="px-3 sm:px-6 py-2.5 sm:py-3 border-t flex items-center justify-between z-20 backdrop-blur-md gap-2"
          style={{
            backgroundColor: curTheme.headerBg,
            color: curTheme.headerText,
            borderColor: curTheme.border
          }}
        >
          {/* Bouton Page précédente */}
          <button
            disabled={safeSectionIndex === 0}
            onClick={() => {
              setCurrentSection((s) => Math.max(0, s - 1));
              if (contentRef.current) contentRef.current.scrollTop = 0;
            }}
            className="px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs font-extrabold disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shadow-xs hover:scale-102 active:scale-95 border"
            style={{ backgroundColor: curTheme.buttonBg, color: curTheme.buttonText, borderColor: curTheme.border }}
            title="Aller à la page ou au chapitre précédent (Flèche gauche)"
          >
            <ChevronLeft className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="font-black">Page précédente</span>
          </button>

          {/* Bouton Quitter / Sortir au centre */}
          <button
            onClick={onClose}
            className="px-3.5 sm:px-5 py-2 rounded-xl border flex items-center gap-1.5 text-xs font-black transition cursor-pointer bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30 active:scale-95 shadow-xs"
            title="Sortir de la lecture et revenir aux livres (Touche Échap)"
          >
            <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="font-black">Sortir du livre</span>
          </button>

          {/* Bouton Page suivante */}
          <button
            disabled={safeSectionIndex === totalSections - 1}
            onClick={() => {
              setCurrentSection((s) => Math.min(totalSections - 1, s + 1));
              if (contentRef.current) contentRef.current.scrollTop = 0;
            }}
            className="px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs font-extrabold disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shadow-xs hover:scale-102 active:scale-95 border"
            style={{ backgroundColor: curTheme.buttonBg, color: curTheme.buttonText, borderColor: curTheme.border }}
            title="Aller à la page ou au chapitre suivant (Flèche droite)"
          >
            <span className="font-black">Page suivante</span>
            <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          </button>

          {/* Comprehensive Academic Page Display */}
          <div className="hidden md:flex items-center gap-2 text-xs font-bold">
            <span className="opacity-80">
              Chap. {safeSectionIndex + 1}/{totalSections}
            </span>
            <span className="opacity-40">•</span>
            <div className="px-2.5 py-0.5 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono text-[11px]">
              Page {calculatedPage} / {readableBook.pages}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TABLE OF CONTENTS DRAWER */}
        {/* ========================================================================= */}
        {showToc && (
          <div 
            className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex animate-fade-in"
            onClick={() => setShowToc(false)}
          >
            <div 
              className="w-80 sm:w-96 h-full p-6 shadow-2xl flex flex-col justify-between border-r animate-slide-right"
              style={{ backgroundColor: curTheme.bg, color: curTheme.text, borderColor: curTheme.border }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: curTheme.border }}>
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <List className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Table des Matières ({totalSections} chapitres)</span>
                  </h3>
                  <button onClick={() => setShowToc(false)} className="p-1 rounded hover:opacity-75 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-[72vh] pr-2">
                  {sectionsList.map((sec, idx) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setCurrentSection(idx);
                        setShowToc(false);
                      }}
                      className="w-full text-left p-3 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer"
                      style={idx === safeSectionIndex ? {
                        backgroundColor: '#0d9488',
                        color: '#ffffff',
                        fontWeight: 'bold'
                      } : {
                        color: curTheme.text
                      }}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="truncate font-semibold">{sec.title}</p>
                        {sec.subtitle && (
                          <p className="text-[10px] opacity-75 truncate">{sec.subtitle}</p>
                        )}
                      </div>
                      <span className="text-[10px] font-mono opacity-70 shrink-0">#{idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t text-[11px] opacity-75" style={{ borderColor: curTheme.border }}>
                {readableBook.title} • {readableBook.pages} pages • Édition Universelle
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DRAWER: RÉSUMÉ ANALYTIQUE & COMPRÉHENSION DE L'ŒUVRE */}
        {/* ========================================================================= */}
        {showSummaryDrawer && (
          <div 
            className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in"
            onClick={() => setShowSummaryDrawer(false)}
          >
            <div 
              className="w-full max-w-md h-full p-6 sm:p-8 shadow-2xl flex flex-col justify-between border-l overflow-y-auto animate-slide-left"
              style={{ backgroundColor: curTheme.bg, color: curTheme.text, borderColor: curTheme.border }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: curTheme.border }}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <h3 className="font-bold text-base">Comprendre l'Œuvre</h3>
                  </div>
                  <button onClick={() => setShowSummaryDrawer(false)} className="p-1.5 rounded-xl hover:opacity-75 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div 
                    className="p-4 rounded-2xl border space-y-2"
                    style={{ backgroundColor: curTheme.cardBg, borderColor: curTheme.cardBorder }}
                  >
                    <span className="font-bold text-teal-600 dark:text-teal-400 uppercase text-xs tracking-wider block">
                      Bref Résumé Analytique
                    </span>
                    <p className="leading-relaxed">
                      {readableBook.summary}
                    </p>
                  </div>

                  {readableBook.citation && (
                    <div 
                      className="p-4 rounded-2xl border italic space-y-1"
                      style={{ backgroundColor: curTheme.cardBg, borderColor: curTheme.cardBorder }}
                    >
                      <Quote className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <p className="font-serif leading-relaxed">{readableBook.citation}</p>
                    </div>
                  )}

                  <div className="space-y-1.5 opacity-80 text-xs">
                    <p><strong>Genre littéraire :</strong> {readableBook.genre}</p>
                    <p><strong>Année de publication :</strong> {readableBook.year}</p>
                    <p><strong>Volume total :</strong> {readableBook.pages} pages complètes</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: curTheme.border }}>
                <button
                  onClick={() => setShowSummaryDrawer(false)}
                  className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition cursor-pointer"
                >
                  Continuer la lecture
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DRAWER: À PROPOS DE L'AUTEUR */}
        {/* ========================================================================= */}
        {showAuthorDrawer && (
          <div 
            className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in"
            onClick={() => setShowAuthorDrawer(false)}
          >
            <div 
              className="w-full max-w-md h-full p-6 sm:p-8 shadow-2xl flex flex-col justify-between border-l overflow-y-auto animate-slide-left"
              style={{ backgroundColor: curTheme.bg, color: curTheme.text, borderColor: curTheme.border }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: curTheme.border }}>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-bold text-base">À Propos de l'Auteur</h3>
                  </div>
                  <button onClick={() => setShowAuthorDrawer(false)} className="p-1.5 rounded-xl hover:opacity-75 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div 
                    className="flex items-center gap-3 p-3 rounded-2xl border"
                    style={{ backgroundColor: curTheme.cardBg, borderColor: curTheme.cardBorder }}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                      <img src={readableBook.coverImage} alt={readableBook.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm">{readableBook.author}</h4>
                      <p className="text-xs opacity-75">{readableBook.title}</p>
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-2xl border space-y-2"
                    style={{ backgroundColor: curTheme.cardBg, borderColor: curTheme.cardBorder }}
                  >
                    <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-xs tracking-wider block">
                      Biographie & Contexte Littéraire
                    </span>
                    <p className="leading-relaxed">
                      {readableBook.authorBio}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: curTheme.border }}>
                <button
                  onClick={() => setShowAuthorDrawer(false)}
                  className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition cursor-pointer"
                >
                  Fermer la notice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* INTERACTIVE WORD DEFINITION MODAL */}
        {/* ========================================================================= */}
        <WordLookupModal
          lookupData={selectedWordData}
          isLoading={isLookingUpWord}
          isOpen={isWordModalOpen}
          onClose={() => setIsWordModalOpen(false)}
          targetLangName={activeLangObj.label}
        />

      </div>
    </div>
  );
};
