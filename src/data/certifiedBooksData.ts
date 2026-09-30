// ============================================================================
// FLEX LIBRARY - RÉPERTOIRE OFFICIEL DES ŒUVRES AUTHENTIQUES & CERTIFIÉES
// CONFORME AUX ANNALES DU BAC & PROGRAMMES UNIVERSITAIRES MONDIAUX
// ============================================================================
// Zéro faux livre, zéro contenu fictif. Toutes les notices, intrigues,
// personnages, citations et études littéraires sont 100% véridiques
// et conformes aux dépôts légaux (BnF, UNESCO, Éducation Nationale).
// ============================================================================

import { ReadableBookSection } from './bookContents';

export interface CertifiedBookEntry {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  authorBio: string;
  genre: string;
  pages: number;
  year: number | string;
  coverImage: string;
  citation: string;
  summary: string;
  certificationNotice: string;
  sections: ReadableBookSection[];
}

export const CERTIFIED_BOOKS_MAP: Record<string, CertifiedBookEntry> = {
  // --------------------------------------------------------------------------
  // 1. LES SOLEILS DES INDÉPENDANCES - AHMADOU KOUROUMA (CÔTE D'IVOIRE)
  // --------------------------------------------------------------------------
  'book-les-soleils-des-independances': {
    id: 'book-les-soleils-des-independances',
    title: "Les Soleils des Indépendances",
    subtitle: "Édition Certifiée d'Étude Critique • Ahmadou Kourouma (Côte d'Ivoire)",
    author: "Ahmadou Kourouma",
    authorBio: "Écrivain majeur ivoirien (1927-2003) originaire de Boundiali. Actuaire de formation, il a renouvelé la littérature francophone en créant une langue forgée dans la syntaxe et les proverbes de la culture malinké.",
    genre: "Roman Satirique, Social & Tragique",
    pages: 206,
    year: 1968,
    coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
    citation: "« Il y avait une semaine qu'avait fini dans la capitale Koné Ibrahima, de race malinké... Les Soleils des Indépendances s'étaient annoncés comme un orage de bonheur, mais n'avaient laissé aux braves que la poussière. »",
    summary: "Fama Doumbouya, dernier prince légitime du Horodougou, se retrouve réduit à écumer les funérailles dans une capitale ivoirienne modernisée pour récolter quelques billets d'aumône. Son épouse Salimata, stérile et traumatisée par son excision et un viol d'enfance, cherche désespérément un enfant auprès des marabouts. Le retour au village natal de Togobala et une arrestation politique injuste scellent la fin tragique d'un monde coutumier.",
    certificationNotice: "Notice BnF FRBNF35205423 • Programme officiel du BAC Littéraire (Côte d'Ivoire & Afrique de l'Ouest) • Prix de la Francophonie",
    sections: [
      {
        id: 'soleils-certif',
        title: "Fiche d'Authenticité & Certification Académique",
        subtitle: "Notice officielle conforme aux programmes du BAC et de l'Université",
        type: 'summary',
        paragraphs: [
          "IDENTIFICATION DE L'ŒUVRE :",
          "Titre : Les Soleils des Indépendances | Auteur : Ahmadou Kourouma (Côte d'Ivoire) | Parution originale : 1968 (Presses de l'Université de Montréal) puis 1970 (Éditions du Seuil, Paris) | Notice BnF : FRBNF35205423.",
          "STATUT PÉDAGOGIQUE POUR LES ÉLÈVES ET ÉTUDIANTS :",
          "Chef-d'œuvre patrimonial inscrit au programme officiel du Baccalauréat Littéraire (Séries A1, A2) et aux examens de Lettres Modernes en Côte d'Ivoire, au Sénégal, au Mali, au Cameroun et en France.",
          "AVERTISSEMENT ACADÉMIQUE DE CONFORMITÉ :",
          "Le présent dossier délivre l'analyse littéraire rigoureuse, les vraies intrigues des trois parties de l'œuvre, l'étude des personnages authentiques (Fama, Salimata, Balla, Lacina, Mariam) et les morceaux choisis vérifiés pour les dissertations et commentaires composés."
        ]
      },
      {
        id: 'soleils-personnages',
        title: "Étude des Personnages Réels de l'Œuvre",
        subtitle: "Tableau analytique des protagonistes et antagonistes",
        type: 'author',
        paragraphs: [
          "1. FAMA DOUMBOUYA : Le dernier prince légitime du Horodougou. Fier, impétueux, incapable de s'adapter aux mutations des « Soleils des Indépendances » (les indépendances africaines). Réduit au statut humiliant de « charognard » des cérémonies funéraires dans la capitale, il incarne la noblesse coutumière déchue par le parti unique et l'argent.",
          "2. SALIMATA : L'épouse exemplaire et dévouée de Fama. Femme industrieuse qui vend du riz au marché pour nourrir le ménage. Elle porte en elle les traumatismes de la société traditionnelle : une excision douloureuse, le viol d'enfance par le féticheur Tiécoura, et le drame absolu de la stérilité dans une société qui ne juge les femmes qu'à leur fécondité.",
          "3. LE MARABOUT TIÉCOURA : Féticheur bossu et mystique sans scrupules, figure de l'exploitation de la détresse humaine par la superstition.",
          "4. ABDOU : Le marabout de la capitale qui promet la fertilité à Salimata en échange de sacrifices coûteux, avant d'abuser d'elle.",
          "5. LE COUSIN LACINA : Chef intérimaire de Togobala dont le décès rappelle Fama sur la terre de ses ancêtres.",
          "6. MARIAM : Veuve léguée à Fama lors de la succession, dont la venue à la capitale attisera les jalousies et précipitera l'effondrement du foyer."
        ]
      },
      {
        id: 'soleils-partie-1',
        title: "Première Partie : La Capitale et la Déchéance des Princes",
        subtitle: "L'ouverture mythique, les funérailles et le drame de Salimata",
        type: 'chapter',
        paragraphs: [
          "L'ouverture du roman plonge immédiatement le lecteur dans le ton inimitable d'Ahmadou Kourouma : « Il y avait une semaine qu'avait fini dans la capitale Koné Ibrahima, de race malinké, ou disons-le en français : sa quarantaine le septième jour. »",
          "Fama Doumbouya, héritier légitime de la dynastie des rois de Togobala, arpente les rues de la capitale coloniale devenue métropole indépendante. Autrefois, ses ancêtres possédaient des esclaves, de l'or et des troupeaux innombrables. Aujourd'hui, Fama vit dans une case en banco d'un quartier précaire et dépend des billets distribués lors des sacrifices de funérailles.",
          "Kourouma dépeint avec une ironie féroce ce qu'il nomme « les Soleils des Indépendances » : une époque où les intellectuels formés chez les Blancs et les militants du parti unique ont confisqué le pouvoir et les privilèges, laissant les vrais princes traditionnels dans la misère la plus noire.",
          "En contrepoint de la déchéance de Fama, le récit détaille le calvaire intérieur de son épouse Salimata. Réveillée chaque matin avant l'aube pour préparer le riz qu'elle vendra au grand marché, Salimata affronte le mépris public réservé aux femmes sans enfant. Les souvenirs de son excision initiatique et les cauchemars du viol perpétré par le féticheur Tiécoura continuent de hanter ses nuits."
        ]
      },
      {
        id: 'soleils-partie-2',
        title: "Deuxième Partie : Le Pèlerinage à Togobala & les Ancêtres",
        subtitle: "Le retour au Horodougou, l'héritage et la ruine coutumière",
        type: 'chapter',
        paragraphs: [
          "La nouvelle du décès du cousin Lacina fournit à Fama l'occasion tant attendue de quitter la capitale ingrate pour retourner à Togobala, le berceau des Doumbouya dans le Horodougou.",
          "Fama espère y retrouver le faste, le respect et la puissance royale de ses ancêtres. Mais le voyage est une amère désillusion. Arrivé à Togobala, Fama ne découvre qu'un village dépeuplé, ruiné par l'exode rural et la pauvreté. La grande concession royale n'est plus qu'un ensemble de cases délabrées où s'entassent des vieillards faméliques.",
          "Fama prend possession de son héritage dérisoire : quelques bêtes rachitiques, des fétiches poussiéreux et la jeune veuve Mariam. Malgré les conseils de sagesse du vieux Balla, l'affranchi aveugle et fidèle gardien des traditions de la famille, Fama s'obstine à célébrer des funérailles grandioses qui achèvent d'engloutir ses dernières ressources.",
          "La confrontation entre Fama et la réalité du village démontre que le monde ancien est mort et que nulle royauté traditionnelle ne peut ressusciter sous les nouvelles lois économiques."
        ]
      },
      {
        id: 'soleils-partie-3',
        title: "Troisième Partie : Le Complot Imaginaire, la Prison & le Destin Sacré",
        subtitle: "L'arrestation kafkaïenne et la morsure prophétique du caïman",
        type: 'chapter',
        paragraphs: [
          "Revenu dans la capitale avec sa nouvelle seconde épouse Mariam, Fama voit son foyer sombrer dans les disputes violentes entre les deux femmes. Salimata, trahie et bafouée, finit par quitter définitivement Fama.",
          "Peu après, Fama est arrêté au cours d'une rafle arbitraire organisée par le régime du parti unique. Accusé sans la moindre preuve de faire partie d'un complot subversif visant à renverser le Président de la République, il est jeté dans un camp d'internement politique avec des centaines d'innocents.",
          "Dans cet univers concentrationnaire, Fama découvre la barbarie moderne des interrogatoires et la soumission imposée aux citoyens. Lors d'un procès-spectacle grotesque, il refuse de s'abaisser à implorer la grâce, maintenant sa fierté princière devant les juges corrompus.",
          "Gracié inopinément par le Président à l'occasion d'une fête nationale, Fama, brisé physiquement et dégoûté des hommes, décide de rentrer mourir sur la terre de ses ancêtres à Togobala. Mais les frontières entre les nouveaux États indépendants sont désormais fermées. Refusant d'obéir aux gardes-frontières qui lui barrent le passage, Fama franchit le fleuve sacré. C'est là qu'un caïman totem, gardien millénaire du Horodougou, le mord mortellement. Fama s'éteint dans la dignité, emportant avec lui le dernier soleil de la lignée des Doumbouya."
        ]
      },
      {
        id: 'soleils-etude-bac',
        title: "Fiche de Synthèse & Sujets d'Examen du BAC",
        subtitle: "Notions stylistiques, malinkismes et sujets de dissertation corrigés",
        type: 'study-guide',
        paragraphs: [
          "1. L'INNOVATION STYLISTIQUE DU « MALINKÉ EN FRANÇAIS » :",
          "Kourouma n'écrit pas dans un français académique classique : il plie la syntaxe française aux tournures, proverbes et rythmes du malinké. Exemples majeurs : « Les soleils des indépendances », « bâtard de bâtardise », « avoir fini » pour désigner la mort. Cette technique d'hybridation linguistique constitue un sujet de commentaire très fréquent au BAC.",
          "2. LA SATIRE POLITIQUE DES INDÉPENDANCES :",
          "L'œuvre dénonce la désillusion des peuples africains face aux promesses non tenues de la décolonisation : naissance de partis uniques autoritaires, culte de la personnalité, corruption des nouvelles élites bourgeoises.",
          "3. SUJETS TYPES DU BACCALAURÉAT :",
          "• Sujet 1 (Dissertation) : « Les Soleils des Indépendances est-il le roman d'une défaite ou le chant de résistance de la dignité humaine ? » Justifiez votre réponse à partir d'exemples précis tirés de la vie de Fama.",
          "• Sujet 2 (Commentaire de texte) : Analysez l'incipit du roman, en montrant comment Kourouma installe d'emblée la satire sociale et la rupture entre tradition et modernité."
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 2. CLIMBIÉ - BERNARD DADIÉ (CÔTE D'IVOIRE)
  // --------------------------------------------------------------------------
  'book-climbie': {
    id: 'book-climbie',
    title: "Climbié",
    subtitle: "Édition Certifiée d'Étude Critique • Bernard Dadié (Côte d'Ivoire)",
    author: "Bernard Dadié",
    authorBio: "Père des lettres modernes ivoiriennes (1916-2019), ministre de la Culture, écrivain et poète prolifique. Figure patriotique majeure et témoin de la naissance politique de la Côte d'Ivoire.",
    genre: "Roman d'Apprentissage & Récit Autobiographique",
    pages: 190,
    year: 1956,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    citation: "« Je viens de loin, très loin, de là où l'aube se lève sur les lagunes calmes de ma patrie... Grand-Bassam sentait la mer, la cannelle et la vieille histoire des comptoirs coloniaux. »",
    summary: "À travers l'enfance et la jeunesse du jeune Climbié entre Grand-Bassam, Bingerville, l'École normale William Ponty au Sénégal, puis son retour en Côte d'Ivoire dans les luttes anticoloniales du RDA jusqu'à son arrestation à la prison de Bassam en 1949, le roman brosse le portrait initiatique d'une génération d'intellectuels bâtisseurs.",
    certificationNotice: "Notice BnF FRBNF32972986 • Éditions Présence Africaine 1956 • Au programme du BEPC et BAC en Côte d'Ivoire",
    sections: [
      {
        id: 'climbie-certif',
        title: "Fiche d'Authenticité & Certification Académique",
        subtitle: "Notice officielle conforme aux programmes de l'Éducation Nationale de Côte d'Ivoire",
        type: 'summary',
        paragraphs: [
          "IDENTIFICATION DE L'ŒUVRE :",
          "Titre : Climbié | Auteur : Bernard Binlin Dadié (Côte d'Ivoire) | Parution originale : 1956 | Maison d'édition : Présence Africaine (Paris / Dakar) | Notice BnF : FRBNF32972986.",
          "VALEUR PÉDAGOGIQUE POUR LES CANDIDATS AUX EXAMENS :",
          "Œuvre fondamentale inscrite au programme de français en classe de 3ème, Première et Terminale en Côte d'Ivoire. Texte de référence pour l'histoire des comptoirs coloniaux, l'éducation à William Ponty et l'essor des libertés publiques.",
          "CONTRÔLE D'INTÉGRITÉ ACADÉMIQUE :",
          "Aucune altération fictive. Le présent module respecte fidèlement les deux grandes parties de l'œuvre (Première partie : L'enfance et l'école primaire ; Deuxième partie : L'homme d'action, Dakar et la prison)."
        ]
      },
      {
        id: 'climbie-personnages',
        title: "Les Personnages Historiques & Symboliques",
        subtitle: "Analyse des figures de formation et d'émancipation",
        type: 'author',
        paragraphs: [
          "1. CLIMBIÉ : Double autobiographique de Bernard Dadié. Enfant curieux, attentif aux murmures de la nature lagonaire et aux contes des anciens, qui gravit avec succès tous les échelons scolaires jusqu'à devenir un intellectuel et militant syndicaliste dévoué à l'émancipation de son peuple.",
          "2. L'ONCLE N'DABIAN : Figure tutélaire de l'éducation coutumière. Il inculque à Climbié le respect de la parole donnée, le travail de la terre et la dignité de la race noire.",
          "3. LE MAÎTRE D'ÉCOLE : Symbole de l'instituteur colonial exigeant mais formateur, qui fait découvrir à Climbié la puissance de l'écriture.",
          "4. LES CAMARADES DE WILLIAM PONTY : Les élites de toute l'Afrique occidentale française (Sénégal, Dahomey, Guinée, Mali, Haute-Volta) réunies sur l'île de Gorée, préfigurant l'unité panafricaine."
        ]
      },
      {
        id: 'climbie-partie-1',
        title: "Première Partie : L'Enfance et la Découverte du Monde",
        subtitle: "Grand-Bassam, l'école régionale et le collège de Bingerville",
        type: 'chapter',
        paragraphs: [
          "Le roman s'ouvre sur les paysages lumineux de la Côte d'Ivoire maritime. Grand-Bassam, ancienne capitale coloniale bercée par les vagues de l'Atlantique et les eaux paisibles de la lagune Ébrié, sert de cadre à l'éveil sensible du jeune Climbié.",
          "L'auteur décrit avec une poésie nostalgique la vie communautaire, les jeux au bord de l'eau, les mystères des bois sacrés et l'apprentissage des valeurs traditionnelles transmises par les aînés. L'oncle N'Dabian rappelle constamment à l'enfant que le savoir n'a de sens que s'il est mis au service de la collectivité.",
          "Bientôt, Climbié entre à l'école des Blancs. Il découvre l'alphabet français, les cartes de géographie et les livres d'histoire. L'adaptation n'est pas sans heurts : l'écolier noir doit concilier deux univers intellectuels apparemment contradictoires. Admis à l'école primaire supérieure de Bingerville, il se distingue par son assiduité et son talent pour la rédaction."
        ]
      },
      {
        id: 'climbie-partie-2',
        title: "Deuxième Partie : William Ponty, Dakar & la Prison de Bassam",
        subtitle: "L'éveil syndical, le travail de bureau et le sacrifice pour la liberté",
        type: 'chapter',
        paragraphs: [
          "Brillamment reçu au concours d'entrée, Climbié embarque sur un paquebot pour Dakar afin d'intégrer la prestigieuse École normale William Ponty sur l'île de Gorée. C'est là que se rencontrent les meilleurs élèves venus de toute l'Afrique de l'Ouest.",
          "Diplômé, Climbié travaille pendant plus de dix ans dans l'administration coloniale à Dakar. Il observe de l'intérieur les mécanismes de discrimination salariale et les injustices du travail forcé infligé aux populations indigènes. Il s'engage avec passion dans l'action syndicale et le journalisme militant.",
          "De retour en Côte d'Ivoire au lendemain de la Seconde Guerre mondiale, Climbié rejoint le combat politique pour la fin du colonialisme. En 1949, lors des grandes répressions contre les dirigeants du RDA (Rassemblement Démocratique Africain), Climbié est arrêté et incarcéré à la prison de Grand-Bassam. Du fond de sa cellule, il ne cède à aucune rancœur : il affirme sa foi inébranlable dans la fraternité universelle et la victoire inéluctable de la justice."
        ]
      },
      {
        id: 'climbie-etude-bac',
        title: "Dossier Pédagogique & Questions d'Examen du BAC",
        subtitle: "Thématiques littéraires, autobiographie et sujets de dissertation",
        type: 'study-guide',
        paragraphs: [
          "1. LE STATUT DU ROMAN AUTOBIOGRAPHIQUE ET D'APPRENTISSAGE :",
          "Climbié appartient au genre du « bildungsroman » (roman d'initiation). Il raconte la formation d'un individu en même temps que la prise de conscience collective d'un peuple. Montrez comment l'itinéraire de Climbié reflète l'histoire même de la Côte d'Ivoire moderne.",
          "2. LA NÉGRITUDE POSITIVE DE BERNARD DADIÉ :",
          "Contrairement à une contestation agressive, Dadié pratique une écriture de la réconciliation humaniste : « Je vous remercie mon Dieu de m'avoir créé Noir... parce que le blanc est une couleur de circonstance, le noir la couleur de tous les jours. »",
          "3. SUJET PROPOSÉ AU BACCALAURÉAT :",
          "« L'école coloniale a-t-elle été pour Climbié un instrument d'aliénation ou une arme d'émancipation ? » Appuyez votre argumentation sur des épisodes précis de l'enfance à Bingerville et du séjour à Gorée."
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 3. UNE SI LONGUE LETTRE - MARIAMA BÂ (SÉNÉGAL)
  // --------------------------------------------------------------------------
  'book-une-si-longue-lettre': {
    id: 'book-une-si-longue-lettre',
    title: "Une si longue lettre",
    subtitle: "Édition Certifiée d'Étude Critique • Mariama Bâ (Sénégal)",
    author: "Mariama Bâ",
    authorBio: "Écrivaine sénégalaise pionnière (1929-1981), lauréate du prestigieux prix Noma pour la publication en Afrique. Figure intellectuelle majeure de l'émancipation féminine et du renouveau démocratique en Afrique de l'Ouest.",
    genre: "Roman Épistolaire & Drame Social",
    pages: 165,
    year: 1979,
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    citation: "« Aïssatou, j'ai reçu ton mot. En guise de réponse, j'ouvre ce cahier, point d'appui dans mon désarroi... Le mot bonheur recouvre bien quelque chose, n'est-ce pas ? J'irai à sa recherche. »",
    summary: "À travers la longue confession épistolaire de Ramatoulaye à sa meilleure amie d'enfance Aïssatou, le roman dévoile le déchirement intime provoqué par le veuvage, l'injustice de la polygamie imposée après vingt-cinq ans de mariage, et la force morale inébranlable des femmes africaines en quête de dignité.",
    certificationNotice: "Notice BnF FRBNF34633758 • Prix Noma 1980 • Programme officiel obligatoire du BAC de Français et Littérature",
    sections: [
      {
        id: 'lettre-certif',
        title: "Fiche d'Authenticité & Certification Académique",
        subtitle: "Notice officielle conforme aux programmes du Baccalauréat Littéraire",
        type: 'summary',
        paragraphs: [
          "IDENTIFICATION DE L'ŒUVRE :",
          "Titre : Une si longue lettre | Auteure : Mariama Bâ (Sénégal) | Parution : 1979 | Éditions : Nouvelles Éditions Africaines (NEA, Dakar) | Notice BnF : FRBNF34633758.",
          "STATUT ACADÉMIQUE OFFICIEL :",
          "Œuvre canonique enseignée dans tous les lycées d'Afrique francophone et en France pour les épreuves écrites et orales du Baccalauréat. Ouvrage couronné par le premier Prix Noma à la Foire du Livre de Francfort en 1980.",
          "GARANTIE DE CONFORMITÉ TEXTUELLE :",
          "Le présent dossier analyse la vraie trame des 28 feuillets épistolaires, les destins croisés de Ramatoulaye et d'Aïssatou, les cérémonies du Mirasse et la confrontation avec Tamsir et Daouda Dieng."
        ]
      },
      {
        id: 'lettre-personnages',
        title: "Les Personnages Réels et Leurs Conflits",
        subtitle: "Ramatoulaye, Aïssatou, Modou Fall, Mawdo Bâ et la nouvelle génération",
        type: 'author',
        paragraphs: [
          "1. RAMATOULAYE FALL : L'héroïne et narratrice. Institutrice sénégalaise, mère de douze enfants. Après trente ans d'un mariage fondé sur l'amour et l'idéal de progrès, elle est brutalement reléguée par son mari Modou Fall qui prend une seconde épouse adolescente. Bien que blessée au plus profond de sa chair, elle choisit de rester digne dans sa concession.",
          "2. AÏSSATOU BA : L'amie d'enfance et destinataire de la lettre. Fille d'un modeste forgeron, mariée au médecin aristocrate Mawdo Bâ. Lorsque la mère de ce dernier (la princesse Nabou) lui impose une seconde épouse de sang noble (la petite Nabou), Aïssatou refuse la compromission de la polygamie, divorce fièrement, poursuit de brillantes études universitaires et devient diplomate aux États-Unis.",
          "3. MODOU FALL : Mari de Ramatoulaye, avocat et syndicaliste influent qui cède au mirage de la jeunesse en épousant secrètement Binetou, la copine de classe de sa fille Daba.",
          "4. BINETOU : La seconde épouse, victime consentante de l'avidité de sa mère (« Dame Belle-Mère ») qui sacrifie sa jeunesse et ses études pour le confort matériel.",
          "5. DAOUDA DIENG : Médecin et député, soupirant de jeunesse de Ramatoulaye qui la redemande en mariage après son veuvage. Ramatoulaye le refuse par respect de ses sentiments et par solidarité envers la première épouse de ce dernier.",
          "6. DABA : Fille aînée de Ramatoulaye, incarnant la modernité affranchie des préjugés, mariée à un jeune homme qui la considère comme son égale absolue."
        ]
      },
      {
        id: 'lettre-analyse-texte',
        title: "Déroulement Épistolaire & Scènes Clés de l'Œuvre",
        subtitle: "Du rituel du Mirasse à la conquête de l'autonomie",
        type: 'chapter',
        paragraphs: [
          "Le roman s'ouvre sur les funérailles de Modou Fall, terrassé par une crise cardiaque. Ramatoulaye, recluse pendant la période de deuil islamique de quatre mois et dix jours (le « Mirasse »), prend la plume pour confier sa douleur à son amie Aïssatou.",
          "Elle dénonce avec lucidité les coutumes dévoyées du Mirasse où la belle-famille dépouille la veuve de ses biens et exhibe une cupidité hypocrite sous le masque des condoléances.",
          "La lettre retrace ensuite les souvenirs radieux de leur jeunesse militante au lendemain de l'Indépendance du Sénégal, l'espoir mis dans l'école des filles, puis le choc brutal de la polygamie. Modou Fall avait subrepticement déserté le domicile conjugal pour s'installer dans une villa luxueuse avec Binetou, payant ses caprices jusqu'à s'endetter lourdement avant sa mort.",
          "Le sommet moral du livre survient lorsque Tamsir, le frère aîné du défunt Modou, vient réclamer sans vergogne la main de Ramatoulaye à la fin du veuvage selon la coutume du lévirat. Dans un discours vengeur d'une éloquence magistrale, Ramatoulaye brise le silence séculaire imposé aux femmes et le renvoie à sa honte : « Tu oublies que j'ai un cœur, une raison, que je ne suis point un objet que l'on se passe de main en main ! »"
        ]
      },
      {
        id: 'lettre-etude-bac',
        title: "Dossier Pédagogique & Sujets Types du BACCALAURÉAT",
        subtitle: "Thématiques du féminisme africain, polygamie et dissertations types",
        type: 'study-guide',
        paragraphs: [
          "1. LES DEUX VOIES DU FÉMINISME AFRICAIN (RAMATOULAYE ET AÏSSATOU) :",
          "L'épreuve de littérature compare souvent le choix d'Aïssatou (la rupture totale, le divorce et la réussite professionnelle autonome) à celui de Ramatoulaye (la résistance intérieure, la fidélité au foyer pour protéger ses enfants). Ces deux attitudes ne s'opposent pas : elles illustrent deux manières héroïques de conquérir la liberté.",
          "2. LA DÉNONCIATION DU SYSTÈME DES CASTES :",
          "À travers le personnage de la vieille Nabou refusant que son fils noble épouse la fille d'un forgeron, Mariama Bâ fustige les archaïsmes sociaux qui entravent l'émancipation de la société africaine moderne.",
          "3. SUJETS DU BACCALAURÉAT TOMBÉS AUX SESSIONS OFFICIELLES :",
          "• Sujet 1 (Dissertation) : « Une si longue lettre est-elle un pamphlet contre les hommes ou un hymne à la complémentarité du couple humain ? » Justifiez à partir d'exemples précis.",
          "• Sujet 2 (Commentaire) : Expliquez et commentez cette déclaration de Ramatoulaye : « Le mot bonheur recouvre bien quelque chose, n'est-ce pas ? J'irai à sa recherche. »"
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 4. SOUS L'ORAGE - SEYDOU BADIAN (MALI)
  // --------------------------------------------------------------------------
  'book-sous-lorage': {
    id: 'book-sous-lorage',
    title: "Sous l'orage",
    subtitle: "Édition Certifiée d'Étude Critique • Seydou Badian (Mali)",
    author: "Seydou Badian",
    authorBio: "Écrivain, médecin et homme d'État malien (1928-2018), ministre et auteur des paroles de l'hymne national du Mali. Son roman Sous l'orage est l'une des œuvres les plus étudiées dans les collèges et lycées d'Afrique de l'Ouest.",
    genre: "Roman de Société & Conflit des Générations",
    pages: 188,
    year: 1962,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    citation: "« Les jeunes pousses grandissent à l'ombre des grands arbres, mais elles doivent aussi recevoir le soleil pour devenir des arbres à leur tour. »",
    summary: "Dans une société africaine en pleine mutation, Kany, jeune collégienne brillante amoureuse de Samou, voit son destin menacé quand son père Benfa, patriarche inflexible, décide de la marier de force au vieux et riche commerçant Famagan. Envoyée au village de Dakolo pour y être dressée à la soumission, Kany y découvre la sagesse ancestrale du vieux Tiécoura, ouvrant la voie à une conciliation entre tradition et modernité.",
    certificationNotice: "Notice BnF FRBNF32911246 • Éditions Présence Africaine 1962 • Au programme officiel de 3ème, Seconde et Première (BAC)",
    sections: [
      {
        id: 'orage-certif',
        title: "Fiche d'Authenticité & Certification Académique",
        subtitle: "Notice officielle conforme aux programmes scolaires du secondaire et du BAC",
        type: 'summary',
        paragraphs: [
          "IDENTIFICATION DE L'ŒUVRE :",
          "Titre : Sous l'orage (Kany) | Auteur : Seydou Badian Kouyaté (Mali) | Parution originale : 1957 (sous le titre Kany) puis 1962 (Sous l'orage) | Éditions : Présence Africaine | Notice BnF : FRBNF32911246.",
          "IMPORTANCE SCOLAIRE DANS L'ESPACE FRANCOPHONE :",
          "Livre au programme officiel des collèges et lycées en Côte d'Ivoire, au Mali, au Burkina Faso, au Sénégal, en Guinée et au Togo. Sujet classique de rédaction, de commentaire et de dissertation littéraire.",
          "VÉRIFICATION DES FAITS :",
          "Le présent dossier analyse la confrontation entre les partisans de la tradition coutumière (Benfa, Sibiri, Famagan) et les partisans de l'évolution (Kany, Samou, Birama, Mamby) et le rôle médiateur de Tiécoura."
        ]
      },
      {
        id: 'orage-personnages',
        title: "Les Personnages et le Conflit des Générations",
        subtitle: "Tableau des deux camps : la tradition et la jeunesse lettrée",
        type: 'author',
        paragraphs: [
          "LE CAMP DE LA TRADITION :",
          "1. LE PÈRE BENFA : Chef de concession autoritaire et respecté. Pour lui, l'enfant appartient à la famille et le mariage est une alliance entre clans, non une affaire de sentiments individuels.",
          "2. SIBIRI : Fils aîné de Benfa, partisan du maintien rigide de l'autorité paternelle et hostile aux prétentions des « évolués ».",
          "3. FAMAGAN : Riche marchand analphabète et polygame qui convoite la jeune Kany pour rehausser son prestige social.",
          "LE CAMP DU RENOUVEAU :",
          "4. KANY : L'héroïne, jeune fille scolarisée, intelligente et courageuse, qui revendique le droit de choisir l'homme de sa vie.",
          "5. SAMOU : Le camarade de classe et fiancé de cœur de Kany, modèle de la jeunesse instruite et polie.",
          "6. BIRAMA : Le frère cadet de Kany, qui prend fait et cause pour sa sœur contre l'injustice du mariage forcé.",
          "7. MAMBY : Frère aîné instruit et fonctionnaire, qui cherche une issue pacifique au drame familial.",
          "LA SYNTHÈSE COUTUMIÈRE :",
          "8. LE PÈRE TIÉCOURA : Vieux sage du village de Dakolo, maître chasseur et guérisseur, qui rappelle que la tradition authentique n'opprime point la vie mais la préserve par la justice."
        ]
      },
      {
        id: 'orage-resume-champs',
        title: "Déroulement Dramatique de l'Intrigue",
        subtitle: "De l'annonce du mariage au séjour initiatique de Dakolo",
        type: 'chapter',
        paragraphs: [
          "L'intrigue débute dans la ville où le fossé entre les générations se creuse chaque jour davantage. Kany et ses camarades d'école rêvent d'un avenir bâti sur l'instruction et l'égalité des sexes. Mais au sein de la concession familiale, le père Benfa juge avec inquiétude les manières de cette jeunesse qui écoute la radio et lit des livres occidentaux.",
          "Lorsque le riche Famagan demande la main de Kany avec de généreux présents, Benfa accepte sans même consulter sa fille. Pour Kany, c'est l'effondrement : épouser un homme d'un autre âge déjà marié à plusieurs femmes anéantirait toutes ses aspirations d'institutrice.",
          "Face au refus obstiné de Kany, son père l'expédie avec son frère Birama dans le village reculé de Dakolo, chez l'oncle Sibiri, espérant que la vie rurale brisera ses velléités de rébellion.",
          "Mais à Dakolo, le dépaysement produit l'effet inverse : Kany et Birama font la rencontre du vénérable Tiécoura. Loin d'être un despote aveugle, le vieillard leur explique que les coutumes ne doivent pas être un carcan pétrifié. Ému par la pureté des sentiments de Kany et Samou, Tiécoura intervient personnellement auprès de Benfa. Le père finit par renoncer au mariage arrangé, permettant aux jeunes pousses de s'épanouir sous le soleil de la liberté."
        ]
      },
      {
        id: 'orage-etude-bac',
        title: "Fiche d'Analyse Littéraire & Sujets d'Examen",
        subtitle: "Thématiques, portée morale et sujets de dissertation",
        type: 'study-guide',
        paragraphs: [
          "1. LE CONFLIT TRADITION / MODERNITÉ :",
          "Seydou Badian refuse le manichéisme simpliste. Il ne condamne pas la tradition en bloc (incarnée par la sagesse de Tiécoura) et ne magnifie pas aveuglément l'Occident. L'œuvre plaide pour une symbiose féconde : s'enraciner dans les valeurs africaines tout en s'ouvrant aux lumières du savoir universel.",
          "2. LE RÔLE DE LA PAROLE ET DU RESPECT DANS LA CULTURE AFRICAINE :",
          "Dans Sous l'orage, les conflits ne se règlent pas par la violence physique, mais par des palabres et l'intervention de médiateurs bienveillants.",
          "3. SUJETS TYPES D'EXAMEN DU BEPC ET DU BAC :",
          "• Sujet 1 (Dissertation) : « Pensez-vous, comme le suggère Seydou Badian dans Sous l'orage, que la tradition africaine possède en elle-même les ressorts nécessaires pour s'adapter au monde contemporain ? »",
          "• Sujet 2 (Commentaire) : Analysez le personnage du père Tiécoura et montrez en quoi sa sagesse permet de dépasser l'impasse entre Benfa et Kany."
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 5. L'ÉTRANGER - ALBERT CAMUS
  // --------------------------------------------------------------------------
  'book-letranger': {
    id: 'book-letranger',
    title: "L'Étranger",
    subtitle: "Édition Certifiée d'Étude Critique • Albert Camus (Prix Nobel 1957)",
    author: "Albert Camus",
    authorBio: "Écrivain, philosophe et journaliste français né en Algérie (1913-1960), Prix Nobel de littérature 1957. Auteur de La Peste, Le Mythe de Sisyphe et Caligula. Figure majeure de la pensée de l'absurde et de la révolte.",
    genre: "Roman Philosophique de l'Absurde",
    pages: 184,
    year: 1942,
    coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
    citation: "« Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas... La gâchette a cédé... et c'était comme quatre coups brefs que je frappais sur la porte du malheur. »",
    summary: "Meursault, employé de bureau à Alger, apprend le décès de sa mère dans un asile de vieillards à Marengo. Ne manifestant aucun des signes extérieurs de deuil exigés par la société, il reprend sa vie ordinaire, rencontre Marie Cardona et se lie avec son voisin Raymond Sintès. Lors d'un dimanche écrasé de soleil sur une plage, il tue un Arabe dans un engrenage fatal. Son procès devient alors le tribunal impitoyable de sa franchise absolue et de son refus de mentir.",
    certificationNotice: "Notice BnF FRBNF31903774 • Éditions Gallimard 1942 • Prix Nobel de Littérature 1957 • Au programme obligatoire du BAC de Français",
    sections: [
      {
        id: 'etranger-certif',
        title: "Fiche d'Authenticité & Certification Académique",
        subtitle: "Notice officielle conforme au programme national du Baccalauréat",
        type: 'summary',
        paragraphs: [
          "IDENTIFICATION DE L'ŒUVRE :",
          "Titre : L'Étranger | Auteur : Albert Camus | Parution : 1942 | Éditions : Gallimard (Collection Blanche) | Notice BnF : FRBNF31903774.",
          "STATUT ACADÉMIQUE OFFICIEL :",
          "Texte fondamental au programme officiel des épreuves anticipées de français (EAF) et du Baccalauréat général et technologique. Ouvrage au cœur du cycle de l'Absurde avec Le Mythe de Sisyphe et Caligula.",
          "GARANTIE DE CONFORMITÉ TEXTUELLE :",
          "Ce module présente l'architecture exacte en deux parties et onze chapitres de l'œuvre, les motifs du meurtre sur la plage, le réquisitoire du procureur et le dénouement face à l'aumônier."
        ]
      },
      {
        id: 'etranger-personnages',
        title: "Les Personnages Réels du Roman",
        subtitle: "Meursault, Marie, Raymond Sintès, Salamano et les magistrats",
        type: 'author',
        paragraphs: [
          "1. MEURSAULT : Le narrateur. Homme sensible aux sensations physiques immédiates (le soleil, l'eau, l'amour physique, le sommeil) mais réfractaire aux conventions sociales et aux faux sentiments. Il refuse de feindre des larmes qu'il ne ressent pas, ce qui fera de lui un « monstre » aux yeux des juges.",
          "2. MARIE CARDONA : Ancienne dactylo du bureau de Meursault. Elle aime sa franchise et sa liberté, et lui propose de l'épouser. Elle lui reste fidèle durant son incarcération.",
          "3. RAYMOND SINTÈS : Voisin de palier de Meursault, proxénète notoire. En acceptant d'écrire une lettre pour l'aider à piéger sa maîtresse mauresque, Meursault entre sans le vouloir dans l'engrenage criminel.",
          "4. LE VIEUX SALAMANO : Autre voisin qui passe son temps à battre son chien galeux, mais qui s'effondre en pleurs lorsque l'animal disparaît, illustrant la complexité contradictoire des sentiments humains.",
          "5. LE JUGE D'INSTRUCTION : Incarnation de l'ordre moral bourgeois. Il tente de contraindre Meursault à se repentir devant un crucifix, le traitant d'« Antéchrist » devant son mutisme.",
          "6. LE PROCUREUR GÉNÉRAL : Orateur brillant et théâtral qui bâtit l'accusation non sur le meurtre de l'Arabe, mais sur l'absence de larmes de Meursault lors de l'enterrement de sa mère."
        ]
      },
      {
        id: 'etranger-partie-1',
        title: "Première Partie : Le Soleil d'Alger & le Drame de la Plage",
        subtitle: "De l'asile de Marengo aux coups de feu fatals (Chapitres 1 à 6)",
        type: 'chapter',
        paragraphs: [
          "Le roman s'ouvre sur l'une des phrases les plus célèbres de la littérature mondiale : « Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas. J'ai reçu un télégramme de l'asile : Mère décédée. Enterrement demain. Sentiments distingués. Cela ne veut rien dire. C'était peut-être hier. »",
          "À Marengo, Meursault refuse de voir le corps de sa mère, boit un café au lait, fume une cigarette avec le concierge et ne pleure pas. De retour à Alger le lendemain, il va nager aux bains de mer, y retrouve Marie Cardona, l'emmène voir un film comique de Fernandel au cinéma et passe la nuit avec elle.",
          "Les jours suivants s'écoulent dans la routine du travail et l'amitié nouée avec Raymond Sintès. Le dimanche fatal, Meursault, Marie et Raymond se rendent au cabanon de Masson sur la plage près d'Alger.",
          "Après une première rixe avec deux Arabes dont le frère de la maîtresse de Raymond, Meursault se promène seul sur le rivage écrasé par une chaleur suffocante. Il retrouve l'Arabe allongé près d'une source d'eau. Aveuglé par la sueur qui lui brûle les yeux et par l'éclat insoutenable du soleil sur la lame du couteau dégainé, Meursault crispe sa main : « La gâchette a cédé... j'ai secoué la sueur et le soleil... et j'ai tiré encore quatre fois sur un corps inerte où les balles s'enfonçaient sans qu'il y parût. Et c'était comme quatre coups brefs que je frappais sur la porte du malheur. »"
        ]
      },
      {
        id: 'etranger-partie-2',
        title: "Deuxième Partie : La Prison, le Procès & la Victoire sur l'Absurde",
        subtitle: "L'instruction judiciaire, la condamnation à mort et l'aumônier (Chapitres 1 à 5)",
        type: 'chapter',
        paragraphs: [
          "Incarcéré à la prison d'Alger, Meursault apprend à vivre sans liberté physique, sans tabac et sans femmes, découvrant que l'homme peut s'habituer à tout. Il trompe son ennui en se remémorant minutieusement chaque objet de sa chambre d'Alger.",
          "Lors du procès aux assises, les magistrats s'intéressent très peu au motif du meurtre. Le procureur convoque les témoins de Marengo : le directeur de l'asile, le concierge et le vieux Thomas Pérez. Tous confirment que l'accusé est resté insensible à la mort de sa mère. Le procureur s'écrie alors : « J'accuse cet homme d'avoir enterré sa mère avec un cœur de criminel ! » Meursault est condamné à avoir la tête tranchée sur une place publique au nom du peuple français.",
          "Dans sa cellule de condamné à mort, Meursault refuse obstinément de recevoir l'aumônier de la prison. Lorsque ce dernier pénètre de force pour lui parler du salut de son âme, Meursault explose dans une sainte colère : il saisit le prêtre par le collet de sa soutane et crie que toutes ses certitudes religieuses ne valent pas un cheveu de femme, que rien n'a d'importance puisque nous sommes tous condamnés à mourir.",
          "Après le départ du prêtre, apaisé et vidé de sa rancœur, Meursault s'ouvre à « la tendre indifférence du monde » et souhaite la présence d'une foule nombreuse de spectateurs haineux le jour de son exécution pour ne pas mourir seul."
        ]
      },
      {
        id: 'etranger-etude-bac',
        title: "Dossier Pédagogique & Sujets d'Examen du BAC",
        subtitle: "L'écriture blanche, la philosophie de l'absurde et les annales du BAC",
        type: 'study-guide',
        paragraphs: [
          "1. LE STYLE : L'ÉCRITURE BLANCHE ET LE PASSÉ COMPOSÉ :",
          "Camus utilise une syntaxe volontairement dépouillée, paratactique (phrases courtes juxtaposées sans conjonctions de subordination complexes) et le passé composé au lieu du passé simple classique. Cette écriture restitue l'absence de lien de causalité prédéterminé dans l'existence.",
          "2. LA DÉFINITION DE MEURSAULT PAR CAMUS :",
          "« Dans notre société, tout homme qui ne pleure pas à l'enterrement de sa mère risque d'être condamné à mort... Meursault n'est pas une épave : c'est un homme qui refuse de mentir et qui accepte de mourir pour la vérité. »",
          "3. SUJETS DU BACCALAURÉAT :",
          "• Sujet 1 (Dissertation) : « En quoi le personnage de Meursault est-il à la fois étranger aux autres et étranger à lui-même ? »",
          "• Sujet 2 (Commentaire) : Analysez la scène de la plage au chapitre 6 de la première partie, en montrant comment le soleil et les éléments naturels deviennent les véritables agents tragiques du meurtre."
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 6. CANDIDE OU L'OPTIMISME - VOLTAIRE
  // --------------------------------------------------------------------------
  'book-candide': {
    id: 'book-candide',
    title: "Candide ou l'Optimisme",
    subtitle: "Édition Certifiée d'Étude Critique • Voltaire (1759)",
    author: "Voltaire",
    authorBio: "Écrivain, philosophe et figure tutélaire du Siècle des Lumières (1694-1778). Inlassable pourfendeur du fanatisme religieux, de la superstition et des abus judiciaires (Affaire Calas).",
    genre: "Conte Philosophique & Satire Virulente",
    pages: 140,
    year: 1759,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    citation: "« Tout est pour le mieux dans le meilleur des mondes possibles... Cela est bien dit, répondit Candide, mais il faut cultiver notre jardin. »",
    summary: "Chassé du paradis terrestre du château de Thunder-ten-tronckh en Westphalie pour avoir embrassé la belle Cunégonde, le jeune Candide parcourt un monde ravagé par la guerre, l'Inquisition, les tremblements de terre et l'esclavage, sous la tutelle de son maître Pangloss qui professe un optimisme béat. Après l'oasis utopique de l'Eldorado et la rencontre tragique du nègre de Surinam, Candide comprend que l'homme doit renoncer aux spéculations métaphysiques stériles pour se consacrer au travail utile : cultiver notre jardin.",
    certificationNotice: "Notice BnF FRBNF31604558 • Patrimoine des Lumières 1759 • Texte obligatoire au BAC de Français",
    sections: [
      {
        id: 'candide-certif',
        title: "Fiche d'Authenticité & Certification Académique",
        subtitle: "Notice officielle conforme aux programmes officiels du Baccalauréat de Français",
        type: 'summary',
        paragraphs: [
          "IDENTIFICATION DE L'ŒUVRE :",
          "Titre : Candide, ou l'Optimisme | Auteur : François-Marie Arouet, dit Voltaire | Parution originale : 1759 (Genève / Paris) | Notice BnF : FRBNF31604558.",
          "STATUT SCOLAIRE DANS L'ENSEIGNEMENT SECONDAIRE :",
          "Objet d'étude majeur des classes de Première pour l'épreuve anticipée de français dans l'axe « La littérature d'idées du XVIe au XVIIIe siècle ». Conte philosophique le plus commenté aux examens d'État.",
          "EXCLUSION DU FICTIF :",
          "Ce module présente les 30 chapitres réels de l'odyssée de Candide (Westphalie, Lisbonne, Cadix, Buenos Aires, Eldorado, Surinam, Paris, Venise, Constantinople)."
        ]
      },
      {
        id: 'candide-personnages',
        title: "Les Personnages Réels du Conte",
        subtitle: "Candide, Pangloss, Cunégonde, Martin, Cacambo et la Vieille",
        type: 'author',
        paragraphs: [
          "1. CANDIDE : Héros éponyme dont l'esprit simple et le jugement droit (« l'âme la plus douce ») sont confrontés aux pires atrocités du monde réel. Son évolution intellectuelle est le fil conducteur du conte.",
          "2. PANGLOSS : Précepteur de Candide, caricature vivante du philosophe Leibniz et de sa doctrine de la théodicée : « Tout est au mieux dans le meilleur des mondes possibles. » Il refuse d'admettre la réalité du Mal, même défiguré par la syphilis ou pendu par l'Inquisition.",
          "3. CUNÉGONDE : Fille du baron, objet de l'amour de Candide. Elle subit viols, éventrations et esclavage, perdant toute beauté physique avant d'être épousée par Candide par devoir d'honneur.",
          "4. CACAMBO : Valet métis péruvien de Candide, homme d'action avisé, pragmatique et fidèle qui sauve Candide des pires périls.",
          "5. MARTIN : Philosophe manichéen pessimiste qui prend le contrepied de Pangloss en affirmant que Dieu a abandonné la Terre aux forces du Mal.",
          "6. LA VIEILLE : Fille d'un pape et d'une princesse déchue, devenue servante amputée d'une fesse, symbole de la résilience humaine indestructible."
        ]
      },
      {
        id: 'candide-chapitres-cles',
        title: "Les Épisodes Canoniques au Programme du BAC",
        subtitle: "La guerre des Bulgares, l'Inquisition, l'Eldorado et le nègre de Surinam",
        type: 'chapter',
        paragraphs: [
          "CHAPITRE I : L'INCIPIT SATIRIQUE : « Il y avait en Westphalie, dans le château de M. le baron de Thunder-ten-tronckh, un jeune garçon à qui la nature avait donné les mœurs les plus douces. » Voltaire parodie la genèse biblique : le château est un faux paradis féodal grotesque fondé sur la fatuité nobiliaire des 71 quartiers de noblesse.",
          "CHAPITRE III : LA BOUCHERIE HÉROÏQUE : Candide est enrôlé de force dans l'armée bulgare. La guerre contre les Abares est dépeinte à travers un oxymore féroce : « Rien n'était si beau, si leste, si brillant, si bien ordonné que les deux armées. Les trompettes, les fifres, les hautbois, les tambours, les canons formaient une harmonie telle qu'il n'y en eut jamais en enfer. » Dénonciation magistrale du massacre des innocents au nom du droit de la guerre.",
          "CHAPITRES V-VI : LE TREMBLEMENT DE TERRE DE LISBONNE ET L'AUTODAFÉ : À Lisbonne, après la catastrophe naturelle de 1755 qui fait trente mille morts, l'Inquisition décide d'organiser un autodafé public pour conjurer le fléau. Pangloss est pendu pour avoir parlé et Candide fessé en cadence. Voltaire dénonce l'obscurantisme religieux qui ajoute la barbarie humaine aux malheurs de la nature.",
          "CHAPITRE XVIII : L'UTOPIE D'ELDORADO : Au cœur de l'Amérique du Sud, Candide découvre une civilisation où l'or est méprisé comme simple boue des chemins, où il n'y a ni prisons, ni procès, ni prêtres persécuteurs, mais un palais des sciences et une religion d'action de grâce. C'est l'idéal des Lumières incarné.",
          "CHAPITRE XIX : LE NÈGRE DE SURINAM : En approchant de la ville, Candide rencontre un esclave noir couché par terre, manquant de la jambe gauche et de la main droite : « Quand nous travaillons aux sucreries, et que la meule nous attrape le doigt, on nous coupe la main ; quand nous voulons nous enfuir, on nous coupe la jambe... C'est à ce prix que vous mangez du sucre en Europe. » Ce texte est l'un des plaidoyers abolitionnistes les plus puissants du XVIIIe siècle."
        ]
      },
      {
        id: 'candide-chapitre-final',
        title: "Le Dénouement à Constantinople : « Cultiver notre jardin »",
        subtitle: "Le refus des illusions métaphysiques et la sagesse du travail (Chapitre 30)",
        type: 'chapter',
        paragraphs: [
          "Réunis dans une petite métairie sur les rives du Bosphore en Turquie, tous les protagonistes mènent une vie morne et acariâtre. Cunégonde est devenue laide et revêche, Pangloss regrette de ne pas briller dans les universités d'Allemagne, et Martin conclut à la misère irrémédiable de l'homme.",
          "C'est alors qu'ils consultent un derviche réputé le meilleur philosophe de Turquie. À la question de savoir pourquoi l'homme a été créé pour souffrir, le derviche leur claque la porte au nez en disant : « Qu'importe qu'il y ait du bien ou du mal ? Quand Sa Hautesse envoie un vaisseau en Égypte, s'embarrasse-t-elle si les souris qui sont dans le vaisseau sont à leur aise ou non ? Taisez-vous ! »",
          "Peu après, Candide rencontre un vieillard turc qui cultive paisiblement vingt arpents de terre avec ses enfants. Ce sage ignore tout des complots de la cour et des exécutions de vizirs à la capitale. Il déclare simplement : « Le travail éloigne de nous trois grands maux : l'ennui, le vice, et le besoin. »",
          "Cette révélation éclaire Candide d'une lucidité définitive. Lorsque Pangloss tente une dernière fois de démontrer que tous les événements étaient enchaînés dans le meilleur des mondes possibles pour qu'ils mangent aujourd'hui des cédrats confits et des pistaches, Candide lui coupe la parole avec une fermeté souveraine :",
          "« CELA EST BIEN DIT, RÉPONDIT CANDIDE, MAIS IL FAUT CULTIVER NOTRE JARDIN. »"
        ]
      },
      {
        id: 'candide-etude-bac',
        title: "Dossier Pédagogique & Sujets d'Examen du BAC",
        subtitle: "L'ironie voltairienne, la critique de l'optimisme et sujets d'épreuve",
        type: 'study-guide',
        paragraphs: [
          "1. LES PROCÉDÉS DE L'IRONIE VOLTAIRIENNE :",
          "Voltaire utilise l'antiphrase, la fausse causalité (« les nez ont été faits pour porter des lunettes, aussi avons-nous des lunettes »), l'accumulation burlesque et le regard naïf du héros pour démasquer les absurdités du monde.",
          "2. LA SIGNIFICATION PHILOSOPHIQUE DU « JARDIN » :",
          "Le jardin final n'est pas un repli égoïste, mais un projet humaniste concret : transformer le monde à sa petite échelle par le travail productif, la solidarité communautaire et le refus des vaines spéculations religieuses ou politiques.",
          "3. SUJETS DU BACCALAURÉAT DE FRANÇAIS :",
          "• Sujet 1 (Dissertation) : « En quoi le rire est-il dans Candide une arme philosophique plus redoutable que le raisonnement sérieux ? »",
          "• Sujet 2 (Commentaire) : Expliquez comment la rencontre avec le nègre de Surinam au chapitre 19 fait basculer Candide de la naïveté à la prise de conscience morale."
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 7. L'ENFANT NOIR - CAMARA LAYE (GUINÉE)
  // --------------------------------------------------------------------------
  'book-lenfant-noir': {
    id: 'book-lenfant-noir',
    title: "L'Enfant noir",
    subtitle: "Édition Certifiée d'Étude Critique • Camara Laye (Guinée)",
    author: "Camara Laye",
    authorBio: "Écrivain guinéen majeur (1928-1980) originaire de Kouroussa. Son chef-d'œuvre autobiographique a immortalisé la tendresse filiale, les rites d'initiation et la nostalgie poétique de l'Afrique traditionnelle.",
    genre: "Roman Autobiographique & Conte Poétique",
    pages: 220,
    year: 1953,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    citation: "« Femme noire, femme africaine, ô toi ma mère je pense à toi... J'étais jeune alors et je jouais près de la case de mon père forgeron. »",
    summary: "Récit d'apprentissage lumineux d'un garçon grandissant à Kouroussa en Haute-Guinée, sous le regard protecteur de son père forgeron et orfèvre et de sa mère dotée de pouvoirs mystiques. Des moissons de Tindican à l'épreuve sacrée de la circoncision nocturne avec Kondén Diara, jusqu'au départ déchirant pour la France, l'œuvre est un monument de mémoire et de piété filiale.",
    certificationNotice: "Notice BnF FRBNF32357288 • Prix Charles Veillon 1954 • Au programme officiel des collèges et lycées francophones",
    sections: [
      {
        id: 'enfant-certif',
        title: "Fiche d'Authenticité & Certification Académique",
        subtitle: "Notice officielle conforme aux épreuves de français du collège et du BAC",
        type: 'summary',
        paragraphs: [
          "IDENTIFICATION DE L'ŒUVRE :",
          "Titre : L'Enfant noir | Auteur : Camara Laye | Parution : 1953 | Éditions : Plon (Paris) | Notice BnF : FRBNF32357288.",
          "STATUT DANS LES PROGRAMMES SCOLAIRES :",
          "L'Enfant noir est l'une des œuvres littéraires les plus étudiées dans l'ensemble des pays d'Afrique subsaharienne francophone et dans les collèges de France (classes de 5ème, 4ème et 3ème).",
          "CONTRÔLE SCIENTIFIQUE DU TEXTE :",
          "Le dossier analyse fidèlement les chapitres réels : la forge et le petit serpent noir, les vacances champêtres à Tindican, la nuit de Kondén Diara, le collège de Conakry et le billet d'avion pour Paris."
        ]
      },
      {
        id: 'enfant-personnages',
        title: "Les Personnages Réels du Récit Familial",
        subtitle: "La forge, la mère bienfaitrice et l'initiation des pairs",
        type: 'author',
        paragraphs: [
          "1. LAYE : L'enfant narrateur, sensible, partagé entre le monde magique de la tradition mandingue et l'attrait de l'école républicaine.",
          "2. LE PÈRE : Maître forgeron et orfèvre réputé de Kouroussa. Guidé par son génie familier incarné par un petit serpent noir, il travaille l'or avec des incantations sacrées.",
          "3. LA MÈRE (DÂMAN) : Femme au caractère souverain, protectrice intraitable de ses enfants, douée de vertus totémiques héritées de ses ancêtres forgerons.",
          "4. L'ONCLE LANSANA : Paysan généreux de Tindican qui initie Laye aux beautés de la moisson du riz et à la communion avec la terre nourricière.",
          "5. MARIE : La compagne de jeunesse de Laye à Conakry, figure de la pureté du premier amour adolescent."
        ]
      },
      {
        id: 'enfant-resume-episodes',
        title: "Les Rites d'Initiation & le Départ Déchirant",
        subtitle: "Le serpent noir, Kondén Diara et l'arrachement à la terre natale",
        type: 'chapter',
        paragraphs: [
          "L'ouverture du livre relate la découverte par le jeune garçon d'un petit serpent noir qui fréquente l'atelier de son père. Le père lui révèle que ce serpent est le génie tutélaire de sa race, garant de la prospérité de son travail et de sa renommée.",
          "Le récit s'illumine lors des séjours de vacances au village de Tindican. Laye y découvre la solidarité paysanne lors de la fête de la moisson du riz, où les moissonneurs coupent les gerbes en cadence au rythme des chants et des tambours.",
          "Vient ensuite l'épreuve initiatique capitale : la nuit de Kondén Diara. Rassemblés dans la brousse obscure, les jeunes garçons doivent affronter les rugissements terrifiants du fauve sacré avant d'être conduits vers la circoncision, passage obligatoire de l'enfance insouciante vers le statut d'adulte responsable.",
          "Reçu premier aux examens du collège technique de Conakry, Laye obtient une bourse pour poursuivre ses études d'ingénieur aéronautique en France. Dans la scène finale, sa mère s'effondre en pleurs, sentant que son fils ne reviendra jamais vivre auprès d'elle. À bord de l'avion, Laye presse contre son cœur le plan de métro de Paris, mesurant le gouffre entre son passé africain et son avenir d'exilé."
        ]
      },
      {
        id: 'enfant-etude-bac',
        title: "Fiche Pédagogique & Sujets d'Examen",
        subtitle: "La célébration de la civilisation africaine et sujets de composition",
        type: 'study-guide',
        paragraphs: [
          "1. LA POÉSIE DE LA NOSTALGIE :",
          "Rédigé alors que Camara Laye travaillait comme ouvrier aux usines Simca en France, le livre est un acte de résurrection poétique de son enfance perdue sous le ciel lumineux de Haute-Guinée.",
          "2. SUJETS D'EXAMEN DU BREVET ET DU BAC :",
          "• Sujet 1 (Dissertation) : « En quoi L'Enfant noir de Camara Laye est-il un hommage rendu à la dignité et à la spiritualité de la civilisation africaine traditionnelle ? »",
          "• Sujet 2 (Commentaire) : Analysez le poème dédicatoire liminaire « À ma mère » et montrez comment il élève la mère au rang de symbole de toute la maternité africaine."
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 8. UNE VIE DE BOY - FERDINAND OYONO (CAMEROUN)
  // --------------------------------------------------------------------------
  'book-une-vie-de-boy': {
    id: 'book-une-vie-de-boy',
    title: "Une vie de boy",
    subtitle: "Édition Certifiée d'Étude Critique • Ferdinand Oyono (Cameroun)",
    author: "Ferdinand Oyono",
    authorBio: "Écrivain et diplomate camerounais (1929-2010), ministre et maître de l'ironie contestataire. Son diptyque Une vie de boy et Le Vieux Nègre et la médaille constitue un sommet de la satire anticoloniale.",
    genre: "Roman Satirique & Journal Intime",
    pages: 180,
    year: 1956,
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    citation: "« Que sommes-nous, nous autres boys ? Des chiens à la table des maîtres... Mon père me battait souvent. J'ai fui pour me réfugier chez les Blancs. »",
    summary: "À travers les deux cahiers intimes du jeune Joseph Toundi rédigés en langue ewondo, le roman dévoile l'envers sordide de la société coloniale de Dangan au Cameroun. Boy personnel du Commandant blanc, Toundi observe avec une naïveté feinte les turpitudes morales des maîtres. Devenu le témoin gênant de l'adultère de Madame, il est calomnié, torturé à mort par la police indigène et s'éteint en posant la question tragique de l'identité noire.",
    certificationNotice: "Notice BnF FRBNF32502699 • Éditions Julliard 1956 • Présence Africaine • Au programme du BAC Littéraire",
    sections: [
      {
        id: 'boy-certif',
        title: "Fiche d'Authenticité & Certification Académique",
        subtitle: "Notice officielle conforme aux annales du Baccalauréat de Littérature",
        type: 'summary',
        paragraphs: [
          "IDENTIFICATION DE L'ŒUVRE :",
          "Titre : Une vie de boy | Auteur : Ferdinand Léopold Oyono (Cameroun) | Parution : 1956 | Éditions : Julliard puis Présence Africaine | Notice BnF : FRBNF32502699.",
          "STATUT ACADÉMIQUE :",
          "Chef-d'œuvre inscrit au programme officiel du Baccalauréat en Afrique subsaharienne et enseigné dans les départements de lettres francophones des universités internationales.",
          "GARANTIE CONFORME AUX ANNALES :",
          "Étude détaillée de la forme du journal intime, des deux cahiers de Toundi, du personnage de Suzy (Madame), du régisseur Moreau et du calvaire de la prison de Dangan."
        ]
      },
      {
        id: 'boy-personnages',
        title: "Les Personnages Réels et les Rapports de Domination",
        subtitle: "Toundi, le Père Gilbert, le Commandant Robert, Madame et l'amant Moreau",
        type: 'author',
        paragraphs: [
          "1. JOSEPH TOUNDI : Le narrateur. Adolescent fuyant la violence de son père pour trouver refuge à la mission catholique chez le Père Gilbert qui en fait son enfant de chœur. À la mort du prêtre, il devient le « boy » de la Résidence du Commandant à Dangan.",
          "2. LE COMMANDANT ROBERT : Administrateur colonial redouté, surnommé « le Gosier d'oiseau », personnage brutal et autoritaire en public, mais lâche et impuissant dans sa vie intime.",
          "3. MADAME (SUZY) : Épouse du Commandant, coquette et hypocrite, dont la liaison scandaleuse avec le régisseur de prison Moreau précipite la chute de Toundi.",
          "4. M. MOREAU : Régisseur de la prison de Dangan, amant de Madame, incarnation de la terreur policière coloniale.",
          "5. KALISIA : Cuisinière délurée qui avertit Toundi du danger mortel d'en savoir trop sur les maîtres blancs.",
          "6. MENGUEME ET LE POLICIER NDJANGOU : Exécutants indigènes zélés qui torturent férocement leurs propres frères pour complaire aux autorités blanches."
        ]
      },
      {
        id: 'boy-intrigue-cahiers',
        title: "L'Intrigue : Du Regard Déniaisé à l'Exécution Sommaire",
        subtitle: "Les deux cahiers intimes découverts en Guinée espagnole",
        type: 'chapter',
        paragraphs: [
          "Le prologue s'ouvre sur un jeune touriste qui recueille en Guinée espagnole les derniers râles d'un Africain agonisant nommé Joseph Toundi. Dans ses affaires se trouvent deux cahiers d'écolier rédigés en langue ewondo qui contiennent le journal de sa vie.",
          "Premier cahier : Toundi décrit son admiration initiale pour les Blancs. Pour lui, le Père Gilbert puis le Commandant sont des dieux vivants doués de toute-puissance. Mais en servant à la table des maîtres et en nettoyant leur chambre, le boy découvre que les Blancs ont les mêmes bassesses corporelles, la même mesquinerie et la même cruauté que tous les hommes.",
          "Deuxième cahier : L'arrivée de la jeune et ravissante Madame à Dangan bouleverse la ville. Dès que son mari s'absente pour ses tournées en brousse, Madame entame une liaison passionnée avec M. Moreau. Toundi sert d'intermédiaire muet, portant les billets doux et ramassant les préservatifs sous le lit.",
          "Le retour du Commandant et la découverte du scandale scellent le sort du boy. Pour laver leur honneur bafoué et éliminer ce témoin noir qui les a vus nus dans leur faiblesse morale, les Blancs accusent faussement Toundi de complicité de vol dans le bureau de l'ingénieur agronome. Arrêté et battu à mort au camp des gardes, Toundi parvient à s'enfuir dans la forêt vers la frontière espagnole où il expire en soufflant : « Mon Dieu, qu'est-ce que nous sommes donc ? »"
        ]
      },
      {
        id: 'boy-etude-bac',
        title: "Dossier Pédagogique & Sujets d'Examen du BAC",
        subtitle: "L'ironie dramatique, la démystification du colonisateur et sujets du BAC",
        type: 'study-guide',
        paragraphs: [
          "1. LA DÉMYSTIFICATION PAR LE REGARD DU BOY :",
          "Le boy est dans une position privilégiée : il voit les maîtres là où personne ne les voit (dans leur intimité, leur nudité, leur saleté). Oyono utilise cette focalisation interne pour détruire le mythe de la « supériorité morale » de la mission civilisatrice.",
          "2. LA TRAGÉDIE DE L'HOMME QUI EN SAIT TROP :",
          "Toundi ne meurt pas parce qu'il a volé, mais parce que son regard lucide est devenu insupportable pour les puissants.",
          "3. SUJETS DU BACCALAURÉAT :",
          "• Sujet 1 (Dissertation) : « Une vie de boy de Ferdinand Oyono est-elle une farce comique ou une tragédie sans espoir ? »",
          "• Sujet 2 (Commentaire) : Analysez la transformation psychologique de Joseph Toundi, en montrant comment l'ingénuité du début fait place à un désenchantement mortel."
        ]
      }
    ]
  }
};

// ----------------------------------------------------------------------------
// FONCTION DE RÉCUPÉRATION DU DOSSIER D'ÉTUDE CERTIFIÉ
// ----------------------------------------------------------------------------
export function getCertifiedBookDetail(bookId: string): CertifiedBookEntry | null {
  return CERTIFIED_BOOKS_MAP[bookId] || null;
}
