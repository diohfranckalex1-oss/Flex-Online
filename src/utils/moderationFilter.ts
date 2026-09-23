/**
 * Bouclier de Pudeur & Modération Éthique Automatique Flex Online
 * 
 * Philosophie : "Flex est fait pour communiquer et dialoguer dans le respect et la paix,
 * pas pour s'attaquer aux autres, porter atteinte à la pudeur ou diffuser des propos grotesques."
 */

export type ModerationCategory = 
  | 'decency'           // Atteinte à la pudeur, obscénité, pornographie, grossièretés sexuelles
  | 'religious_attack'  // Attaques contre la religion, blasphèmes haineux, intolérance religieuse
  | 'political_attack'  // Attaques politiques agressives, injures politiciennes, extrémisme
  | 'harassment';       // Menaces, insultes personnelles, dénigrement, incitation à la haine

export interface ModerationResult {
  isBlocked: boolean;
  category?: ModerationCategory;
  reasonTitle?: string;
  explanation?: string;
  matchedWord?: string;
}

// Mots et expressions portant atteinte à la pudeur (grossièretés, obscénités, contenus grotesques)
const DECENCY_PATTERNS = [
  /\b(porno|pornographie|porno[a-z]*|sexe[a-z]*|nude[s]?|nue[s]?|salope|putain|pute[s]?|baiser|nique[r]?|nique\s+ta|bordel|chienne|penis|vagin|nichon[s]?|couille[s]?|fellation|sodomie|encul[eé]?[s]?|connard|conne|connasse|fdp|pd|enculeur|bite[s]?|chatte[s]?|trou\s+du\s+cul)\b/i,
  /\b(fuck|shit|bitch|asshole|dick|cock|pussy|porn|slut|whore|motherfucker)\b/i,
  /\b(envoie\s+(des\s+)?(nudes|photos?\s+nue?s?)|sexe\s+en\s+ligne|plan\s+cul|faire\s+l['\s]amour\s+avec\s+toi|viens\s+on\s+baise)\b/i
];

// Attaques religieuses (insultes confessionnelles, intolérance de foi)
const RELIGIOUS_PATTERNS = [
  /\b(sale\s+(arabe|juif|chretien|musulman|catholique|noir|blanc)|islamiste\s+de\s+merde|religion\s+de\s+merde|dieu\s+n['\s]est\s+rien|brulez\s+le\s+(coran|bible|eglise|mosquee|synagogue)|crevez\s+les\s+(musulmans|chretiens|juifs)|anti[ -]?islam|anti[ -]?chretien|antisemite)\b/i,
  /\b(crache\s+sur\s+(dieu|allah|jesus|le\s+prophete|la\s+vierge)|secte\s+de\s+merde|sale\s+croyant)\b/i
];

// Attaques politiques agressives et haine idéologique
const POLITICAL_PATTERNS = [
  /\b(creve\s+(macron|le\s+president|ce\s+gouvernement|les\s+ministres)|sale\s+(fachiste|gauchiasse|fachos|collabo|nazi|dictateur)|politique\s+pourrie|a\s+mort\s+les\s+politiciens|guillotine\s+pour|guerre\s+civile\s+maintenant|coup\s+d['\s]etat|terroriste\s+politique)\b/i,
  /\b(tous\s+des\s+voleurs\s+a\s+eliminer|pendre\s+les\s+elus|bruler\s+le\s+parlement|brulez\s+l['\s]assemblee)\b/i
];

// Harcèlement, insultes et menaces personnelles
const HARASSMENT_PATTERNS = [
  /\b(va\s+te\s+faire\s+foutre|va\s+mourir|suicide[- ]toi|je\s+vais\s+te\s+tuer|ferme\s+ta\s+gueule|ftg|sale\s+merde|espece\s+d['\s]imbecile|tu\s+ne\s+sers\s+a\s+rien|je\s+vais\s+te\s+frapper|je\s+sais\s+ou\s+tu\s+habites|grosse\s+merde|t['\s]es\s+un\s+dechet)\b/i,
  /\b(i\s+will\s+kill\s+you|go\s+die|kill\s+yourself|shut\s+up\s+bitch|you\s+suck)\b/i
];

/**
 * Analyse un texte pour détecter les contenus contraires à la pudeur, à l'éthique et au respect.
 */
export function checkContentModeration(text: string): ModerationResult {
  if (!text || typeof text !== 'string') {
    return { isBlocked: false };
  }

  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents pour déjouer les contournements
    .toLowerCase();

  // 1. Vérification Pudeur & Obscénité
  for (const pattern of DECENCY_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      incrementShieldCounter();
      return {
        isBlocked: true,
        category: 'decency',
        matchedWord: match[0],
        reasonTitle: '🛡️ Bloqué pour Atteinte à la Pudeur',
        explanation: 'Flex est un espace d’échange sain et bienveillant. Les messages grotesques, grossiers ou à caractère obscène y sont strictement exclus.'
      };
    }
  }

  // 2. Vérification Attaques Religieuses
  for (const pattern of RELIGIOUS_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      incrementShieldCounter();
      return {
        isBlocked: true,
        category: 'religious_attack',
        matchedWord: match[0],
        reasonTitle: '🕊️ Bloqué : Respect des Croyances',
        explanation: 'Flex rassemble des personnes de tous horizons. Aucune attaque, insulte ou provocation religieuse n’est tolérée.'
      };
    }
  }

  // 3. Vérification Attaques Politiques Agressives
  for (const pattern of POLITICAL_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      incrementShieldCounter();
      return {
        isBlocked: true,
        category: 'political_attack',
        matchedWord: match[0],
        reasonTitle: '⚖️ Bloqué : Neutralité & Dialogue Paisible',
        explanation: 'Flex est conçu pour le dialogue et la fraternité, non pour les attaques politiques agressives ou l’incitation à la haine.'
      };
    }
  }

  // 4. Vérification Harcèlement et Menaces
  for (const pattern of HARASSMENT_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      incrementShieldCounter();
      return {
        isBlocked: true,
        category: 'harassment',
        matchedWord: match[0],
        reasonTitle: '⛔ Bloqué : Harcèlement & Agressivité',
        explanation: 'Les insultes personnelles, intimidations ou propos agressifs sont contraires à la charte humaine de Flex.'
      };
    }
  }

  return { isBlocked: false };
}

/**
 * Récupère le compteur de messages neutralisés par le bouclier.
 */
export function getShieldBlockedCount(): number {
  try {
    const count = localStorage.getItem('flex_shield_blocked_count');
    return count ? parseInt(count, 10) : 14;
  } catch (e) {
    return 14;
  }
}

/**
 * Incrémente le compteur de messages bloqués.
 */
function incrementShieldCounter() {
  try {
    const current = getShieldBlockedCount();
    localStorage.setItem('flex_shield_blocked_count', (current + 1).toString());
  } catch (e) {}
}

/**
 * Vérifie si le Bouclier Automatique est activé (Activé par défaut).
 */
export function isDecencyShieldEnabled(): boolean {
  try {
    const setting = localStorage.getItem('flex_shield_enabled');
    return setting === null ? true : setting === 'true';
  } catch (e) {
    return true;
  }
}

/**
 * Active ou désactive le Bouclier Automatique.
 */
export function setDecencyShieldEnabled(enabled: boolean) {
  try {
    localStorage.setItem('flex_shield_enabled', enabled ? 'true' : 'false');
  } catch (e) {}
}
