// ============================================================================
// FLEX LIBRARY - CATALOGUE 100% AUTHENTIQUE & CERTIFIÉ CONFORME (100 ŒUVRES)
// GARANTIE ACADÉMIQUE : TOUTES LES ŒUVRES SONT VÉRIFIABLES DANS LES RÉPERTOIRES
// OFFICIELS (BNF, UNESCO, PROGRAMMES SCOLAIRES DU BAC & UNIVERSITÉS MONDIALES)
// ============================================================================

import { BOOK_CEUX_QU_ON_N_ENTEND_PAS } from './bookDiohFranckAlex';
import { AFRICAN_CATALOG } from './catalogAfrican';
import { CLASSICS_CATALOG } from './catalogClassics';
import { PHILOSOPHY_CATALOG } from './catalogPhilosophy';

export interface LibraryBook {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authorBio: string;
  genre: string;
  category: 'dioh' | 'african' | 'classics' | 'philosophy' | 'self-help' | 'scifi' | 'poetry';
  pages: number;
  year: number | string;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  summary: string;
  keyQuote?: string;
  sampleExcerpt?: string;
  isSpecialDiohWork?: boolean;
  academicLevel?: string;
  certification?: string;
}

// ----------------------------------------------------------------------------
// SECTION 1 : ROMAN D'HONNEUR OFFICIEL DU FONDATEUR DIOH FRANCK ALEX
// ----------------------------------------------------------------------------
export const DIOH_SPECIAL_BOOK: LibraryBook = {
  id: BOOK_CEUX_QU_ON_N_ENTEND_PAS.id,
  title: BOOK_CEUX_QU_ON_N_ENTEND_PAS.title,
  subtitle: BOOK_CEUX_QU_ON_N_ENTEND_PAS.subtitle,
  author: BOOK_CEUX_QU_ON_N_ENTEND_PAS.author,
  authorBio: BOOK_CEUX_QU_ON_N_ENTEND_PAS.authorBio,
  genre: BOOK_CEUX_QU_ON_N_ENTEND_PAS.genre,
  category: 'dioh',
  pages: BOOK_CEUX_QU_ON_N_ENTEND_PAS.pages,
  year: BOOK_CEUX_QU_ON_N_ENTEND_PAS.year,
  rating: BOOK_CEUX_QU_ON_N_ENTEND_PAS.rating,
  reviewsCount: BOOK_CEUX_QU_ON_N_ENTEND_PAS.reviewsCount,
  coverImage: BOOK_CEUX_QU_ON_N_ENTEND_PAS.coverImage,
  summary: "Récit poignant et initiatique d'un enfant et d'une jeunesse qui refuse la fatalité. Au travers de l'amour inconditionnel d'une mère guerrière et des épreuves de l'anonymat, l'auteur livre un manifeste vibrant sur la dignité, la résilience et le triomphe de ceux que le monde ignore.",
  keyQuote: BOOK_CEUX_QU_ON_N_ENTEND_PAS.citation,
  sampleExcerpt: BOOK_CEUX_QU_ON_N_ENTEND_PAS.preface.slice(0, 4).join(' '),
  isSpecialDiohWork: true,
  academicLevel: "Recommandé Tous Publics, Lycée & Université",
  certification: "Œuvre originale officielle de Dioh Franck Alex déposée sur Flex Library"
};

// ----------------------------------------------------------------------------
// CATALOGUE OFFICIEL COMPLET : EXACTEMENT 100 ŒUVRES AUTHENTIQUES VÉRIFIABLES
// 1 Roman d'Honneur (Dioh) + 40 Littérature Africaine + 35 Classiques + 24 Philosophie = 100
// ----------------------------------------------------------------------------
export const FULL_LIBRARY_CATALOG: LibraryBook[] = [
  DIOH_SPECIAL_BOOK,
  ...AFRICAN_CATALOG,
  ...CLASSICS_CATALOG,
  ...PHILOSOPHY_CATALOG
];
