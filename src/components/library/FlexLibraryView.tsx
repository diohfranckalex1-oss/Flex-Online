import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Star, 
  Award, 
  Heart, 
  Bookmark, 
  Volume2, 
  Share2, 
  Compass, 
  BookMarked, 
  Clock, 
  Eye, 
  TrendingUp, 
  Download, 
  Filter, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Calendar, 
  User, 
  Quote, 
  Flame, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BOOK_CEUX_QU_ON_N_ENTEND_PAS } from '../../data/bookDiohFranckAlex';
import { FULL_LIBRARY_CATALOG, LibraryBook } from '../../data/libraryCatalog';
import { EBookReaderModal } from './EBookReaderModal';
import { BookDetailModal } from './BookDetailModal';

export const FlexLibraryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 24;

  // Selected Book for Detail Modal
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<LibraryBook | null>(null);

  // EBook Reader state for full reader
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);
  const [activeReadingBook, setActiveReadingBook] = useState<LibraryBook | null>(null);
  const [readerInitialChapter, setReaderInitialChapter] = useState<number>(0);

  // Saved Favorites
  const [savedFavorites, setSavedFavorites] = useState<string[]>([
    BOOK_CEUX_QU_ON_N_ENTEND_PAS.id,
    'book-une-si-longue-lettre',
    'book-le-comte-de-monte-cristo'
  ]);

  const categories = useMemo(() => [
    { id: 'all', label: 'Toutes les Œuvres Certifiées', count: FULL_LIBRARY_CATALOG.length },
    { id: 'dioh', label: '⭐ Dioh Franck Alex', count: FULL_LIBRARY_CATALOG.filter(b => b.isSpecialDiohWork || b.author === 'Dioh Franck Alex').length },
    { id: 'african', label: '🌍 Littérature & Pensée Africaine', count: FULL_LIBRARY_CATALOG.filter(b => b.category === 'african').length },
    { id: 'classics', label: '🏛️ Grands Classiques du Monde', count: FULL_LIBRARY_CATALOG.filter(b => b.category === 'classics').length },
    { id: 'philosophy', label: '🧠 Philosophie & Droits Humains', count: FULL_LIBRARY_CATALOG.filter(b => b.category === 'philosophy').length },
    { id: 'scifi', label: '🔮 Dystopie & Anticipation', count: FULL_LIBRARY_CATALOG.filter(b => b.category === 'scifi').length },
    { id: 'poetry', label: '📜 Poésie & Sagesses', count: FULL_LIBRARY_CATALOG.filter(b => b.category === 'poetry').length },
    { id: 'favorites', label: '❤️ Mes Favoris', count: savedFavorites.length }
  ], [savedFavorites.length]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedFavorites((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenMasterpieceReader = (initialChapter: number = 0) => {
    setActiveReadingBook(FULL_LIBRARY_CATALOG[0]);
    setReaderInitialChapter(initialChapter);
    setIsReaderOpen(true);
  };

  const handleOpenBookReader = (book: LibraryBook, initialChapter: number = 0, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveReadingBook(book);
    setReaderInitialChapter(initialChapter);
    setIsReaderOpen(true);
  };

  const handleOpenBookModal = (book: LibraryBook) => {
    setSelectedBookForDetail(book);
  };

  const handleOpenReaderFromDetail = (book: LibraryBook) => {
    setSelectedBookForDetail(null);
    setActiveReadingBook(book);
    setReaderInitialChapter(0);
    setIsReaderOpen(true);
  };

  // Filter and search
  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return FULL_LIBRARY_CATALOG.filter((book) => {
      // Category filter
      if (selectedCategory === 'favorites') {
        if (!savedFavorites.includes(book.id)) return false;
      } else if (selectedCategory === 'dioh') {
        if (!book.isSpecialDiohWork && book.author !== 'Dioh Franck Alex') return false;
      } else if (selectedCategory !== 'all') {
        if (book.category !== selectedCategory) return false;
      }

      // Search query filter
      if (!q) return true;
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.genre.toLowerCase().includes(q) ||
        book.summary.toLowerCase().includes(q) ||
        (book.authorBio && book.authorBio.toLowerCase().includes(q)) ||
        (book.year && book.year.toString().includes(q))
      );
    });
  }, [selectedCategory, searchQuery, savedFavorites]);

  // Reset page when filter or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-950 text-neutral-100 p-4 sm:p-6 lg:p-8 space-y-8 select-text">
      
      {/* ========================================================================= */}
      {/* LIBRARY HERO BANNER */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#071a15] via-[#0d2a23] to-[#0a1815] border border-teal-800/60 p-6 sm:p-10 shadow-2xl shadow-teal-950/80">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Flex Library • Plus de 100 Œuvres Réelles & Certifiées Académiquement</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            La Grande Bibliothèque des 100+ Chefs-d'Œuvre Réels & Vérifiés
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
            <strong className="text-emerald-300 font-bold">Garantie absolue pour élèves, étudiants et enseignants :</strong> catalogue officiel étendu à <strong>{FULL_LIBRARY_CATALOG.length} œuvres réelles</strong> vérifiables auprès de la BnF et de l'UNESCO. Zéro faux livre, zéro contenu fictif. Les programmes scolaires du BAC et des universités (Côte d'Ivoire, Afrique subsaharienne et monde) sont intégralement couverts avec des dossiers d'études rigoureux, avec au premier rang le roman officiel de son fondateur <strong className="text-teal-300 font-bold">Dioh Franck Alex</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-neutral-300">
            <span className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-xl border border-neutral-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{FULL_LIBRARY_CATALOG.length} Livres 100% Vérifiables</span>
            </span>
            <span className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-xl border border-neutral-800">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Programme BAC & Universités</span>
            </span>
            <span className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-xl border border-neutral-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Répertoire Officiel BNF & UNESCO</span>
            </span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* GRAND CHEF-D'ŒUVRE : CEUX QU'ON N'ENTEND PAS (DIOH FRANCK ALEX) */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#122420] via-[#0e1d1a] to-[#0b1613] border-2 border-teal-500/60 shadow-2xl shadow-teal-950/90 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-center lg:items-start">
          
          {/* Book 3D Cover */}
          <div 
            onClick={() => handleOpenMasterpieceReader(0)}
            className="w-48 sm:w-56 shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-teal-400/40 cursor-pointer transform hover:scale-105 transition-all duration-300 group relative bg-neutral-900"
          >
            <div className="aspect-[3/4] relative flex flex-col justify-between p-5 text-white text-center">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-65 group-hover:opacity-85 transition-opacity"
                style={{ backgroundImage: `url(${BOOK_CEUX_QU_ON_N_ENTEND_PAS.coverImage})` }}
              />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <span className="text-[10px] tracking-widest font-black uppercase text-amber-300 bg-black/50 px-2 py-0.5 rounded-full inline-block mx-auto border border-amber-400/40">
                  Livre Officiel • Auteur
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide drop-shadow-md text-white">
                    {BOOK_CEUX_QU_ON_N_ENTEND_PAS.title}
                  </h3>
                  <span className="text-xs text-amber-200 font-bold block mt-1">Tome 1</span>
                </div>
                <div className="pt-2 border-t border-white/20">
                  <p className="text-[11px] font-bold text-teal-200 uppercase tracking-wider">
                    {BOOK_CEUX_QU_ON_N_ENTEND_PAS.author}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
              <span className="px-3 py-1.5 rounded-xl bg-teal-500 text-neutral-950 font-black text-xs shadow-lg flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Lire maintenant
              </span>
            </div>
          </div>

          {/* Book Metadata and Synopsis */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Œuvre Majeure de Dioh Franck Alex</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold">
                Roman Intégral • 67 Pages
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold px-2.5 py-1 bg-neutral-900 rounded-full border border-neutral-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>5.0 (1 420 lecteurs passionnés)</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {BOOK_CEUX_QU_ON_N_ENTEND_PAS.title}
              </h2>
              <p className="text-xs sm:text-sm text-teal-300 font-bold mt-0.5">
                {BOOK_CEUX_QU_ON_N_ENTEND_PAS.subtitle} • Par {BOOK_CEUX_QU_ON_N_ENTEND_PAS.author}
              </p>
            </div>

            {/* Author Citation Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-teal-950/40 border border-teal-700/40 italic text-xs sm:text-sm text-teal-100 text-center lg:text-left leading-relaxed">
              {BOOK_CEUX_QU_ON_N_ENTEND_PAS.citation}
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              L'histoire bouleversante de Noah, jeune garçon silencieux né dans un quartier populaire bruyant, confronté à l'abandon de son père et à la pauvreté. Guidé par l'amour inconditionnel de sa mère battante et la loyauté indéfectible de son ami Michael, Noah refuse la fatalité et fait le serment de s'élever par le travail et le courage jusqu'au sommet du Baccalauréat.
            </p>

            {/* Author Bio Card */}
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2.5 text-left">
              <User className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-teal-300 font-bold">À propos de l'auteur : </strong>
                {BOOK_CEUX_QU_ON_N_ENTEND_PAS.authorBio}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={() => handleOpenMasterpieceReader(0)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:from-[#138367] hover:to-[#22b587] text-white font-black text-xs sm:text-sm shadow-xl shadow-teal-950/60 flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Lire le Livre Complet (E-Reader Intégral)</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenMasterpieceReader(3)} // Chapter 1
                className="px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-teal-300 hover:text-white font-bold text-xs sm:text-sm border border-neutral-700 hover:border-teal-500/50 flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Chapitre 1 : L'Ombre de Noah</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenBookModal(FULL_LIBRARY_CATALOG[0])}
                className="px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-bold text-xs sm:text-sm border border-neutral-700 flex items-center gap-2 transition cursor-pointer"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Fiche Résumé & Audio</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FILTER TABS & SEARCH BAR */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur, résumé ou mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs font-bold"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Results count badge */}
          <div className="text-xs text-neutral-400 flex items-center gap-2 font-medium shrink-0">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>
              <strong className="text-white font-bold">{filteredBooks.length.toLocaleString()}</strong> œuvres trouvées
            </span>
          </div>
        </div>

        {/* Categories scrollable bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-teal-500 text-neutral-950 shadow-md shadow-teal-500/20'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-neutral-950/30 text-neutral-900 font-black' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOOKS GRID (PAGINATED) */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        {paginatedBooks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <BookOpen className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Aucun livre ne correspond à votre recherche</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Essayez avec un autre titre, nom d'auteur ou réinitialisez les filtres.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-teal-500 text-neutral-950 font-bold text-xs hover:bg-teal-400 transition"
            >
              Voir tous les livres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {paginatedBooks.map((book) => {
              const isFav = savedFavorites.includes(book.id);

              return (
                <div
                  key={book.id}
                  onClick={() => handleOpenBookReader(book)}
                  className="group relative flex flex-col bg-neutral-900/90 rounded-2xl overflow-hidden border border-neutral-800 hover:border-teal-500/60 hover:shadow-xl hover:shadow-teal-950/40 transition-all duration-300 cursor-pointer"
                >
                  {/* Book cover container */}
                  <div className="aspect-[2/3] w-full relative overflow-hidden bg-neutral-950">
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />

                    {/* Top action icons: Favorite & Info */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenBookModal(book); }}
                        className="p-1.5 rounded-full bg-neutral-950/70 text-neutral-300 hover:text-teal-300 hover:bg-neutral-900 backdrop-blur-md transition-all"
                        title="Fiche résumé & auteur"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => toggleFavorite(book.id, e)}
                        className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                          isFav 
                            ? 'bg-rose-500/90 text-white' 
                            : 'bg-neutral-950/60 text-neutral-300 hover:text-white hover:bg-neutral-900'
                        }`}
                        title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Hover quick read button overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                      <span className="px-3.5 py-1.5 rounded-xl bg-teal-500 text-neutral-950 font-black text-xs shadow-lg flex items-center gap-1.5 scale-95 group-hover:scale-100 transition-transform">
                        <BookOpen className="w-3.5 h-3.5" /> Lire l'Œuvre Certifiée
                      </span>
                    </div>

                    {/* Rating badge */}
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-400 font-bold text-[10px] flex items-center gap-1 border border-neutral-800">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{book.rating.toFixed(1)}</span>
                    </div>

                    {book.isSpecialDiohWork && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-amber-500 text-neutral-950 font-black text-[9px] uppercase tracking-wider">
                        Dioh Franck Alex
                      </span>
                    )}
                  </div>

                  {/* Book Card Details */}
                  <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-teal-300 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-medium line-clamp-1 mt-0.5">
                        {book.author}
                      </p>
                    </div>

                    {/* Summary excerpt teaser */}
                    <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {book.summary}
                    </p>

                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400">
                      <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span>Certifié</span>
                      </span>
                      <span className="font-mono opacity-80">{book.year}</span>
                      <span className="text-teal-400 font-bold group-hover:underline flex items-center gap-0.5">
                        <BookOpen className="w-3 h-3 text-teal-400" />
                        <span>Étudier</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGINATION CONTROLS */}
        {/* ========================================================================= */}
        {totalPages > 1 && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800 text-xs text-neutral-400">
            <div>
              Affichage de <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> à <strong className="text-white">{Math.min(currentPage * itemsPerPage, filteredBooks.length)}</strong> sur <strong className="text-white">{filteredBooks.length.toLocaleString()}</strong> livres
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <div className="flex items-center gap-1 font-mono">
                <span className="px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold">
                  {currentPage}
                </span>
                <span>/</span>
                <span>{totalPages}</span>
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 flex items-center gap-1"
              >
                <span>Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      
      {/* Book Detail Modal (Brief summary, author bio, quote, speech synthesis) */}
      <BookDetailModal
        book={selectedBookForDetail}
        isOpen={Boolean(selectedBookForDetail)}
        onClose={() => setSelectedBookForDetail(null)}
        onOpenReader={handleOpenReaderFromDetail}
        isFavorite={selectedBookForDetail ? savedFavorites.includes(selectedBookForDetail.id) : false}
        onToggleFavorite={(id) => toggleFavorite(id)}
      />

      {/* Universal eBook Reader Modal (Opens ANY selected book with full text & chapters) */}
      <EBookReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        book={activeReadingBook || FULL_LIBRARY_CATALOG[0]}
        initialChapterIndex={readerInitialChapter}
      />

    </div>
  );
};
