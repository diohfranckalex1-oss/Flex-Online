// ============================================================================
// ROMAN OFFICIEL : "CEUX QU'ON N'ENTEND PAS" (TOME 1)
// Auteur : DIOH FRANCK ALEX (Alex Dioh, Créateur de Flex Online)
// Version intégrale révisée, annotée et corrigée selon les règles strictes de l'Académie
// ============================================================================

export interface BookChapter {
  id: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  illustration?: string;
}

export interface BookDetail {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  authorBio: string;
  genre: string;
  pages: number;
  year: number;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  citation: string;
  dedicace: string[];
  remerciements: {
    intro: string[];
    sections: { to: string; text: string }[];
    sign: string;
  };
  preface: string[];
  chapters: BookChapter[];
  authorNote: string[];
}

export const BOOK_CEUX_QU_ON_N_ENTEND_PAS: BookDetail = {
  id: 'book-ceux-qu-on-n-entend-pas',
  title: "Ceux qu'on n'entend pas",
  subtitle: 'Tome 1 • Roman & Parcours de Résilience',
  author: 'Dioh Franck Alex',
  authorBio: "Écrivain, créateur de Flex Online et romancier ivoirien. À travers des récits poignants et profondément humains, Dioh Franck Alex donne une voix puissante aux silencieux, aux mères battantes et à la jeunesse déterminée d'Afrique et du monde entier.",
  genre: 'Roman initiatique, Drame & Résilience',
  pages: 67,
  year: 2024,
  rating: 5.0,
  reviewsCount: 1420,
  coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
  citation: "« Les plus grandes révolutions ne font pas de bruit. Elles naissent dans le cœur de ceux qu’on n’entend pas. »",
  dedicace: [
    "À ma mère.",
    "À toutes les mères qui se lèvent avant l'aube et se couchent après leurs rêves.",
    "À ceux qui ont grandi sans père, mais avec une force qu’aucune absence n’a pu briser.",
    "À ceux qu’on a regardés sans les voir.",
    "Qu’on a jugés sans les comprendre.",
    "Qu’on a fait taire sans les écouter.",
    "À l’enfant que j’étais.",
    "À celui que vous êtes peut-être encore.",
    "Et à tous ceux qu’on n’entend pas...",
    "Mais que l’avenir écoutera assurément."
  ],
  remerciements: {
    intro: [
      "Écrire ce livre a été un parcours.",
      "Mais le vivre a été une grâce inestimable.",
      "Avant toute chose, je rends grâce à Jéhovah Dieu pour la force, l’inspiration et la persévérance. Sans Lui, aucun mot n’aurait trouvé sa place."
    ],
    sections: [
      {
        to: "À ma mère",
        text: "Merci pour les sacrifices silencieux, pour les nuits d’inquiétude que je ne voyais pas, pour les prières murmurées quand je dormais. Merci d’avoir cru en moi avant même que je comprenne qui je pouvais devenir. Ta force inébranlable est la première fondation de cet ouvrage."
      },
      {
        to: "Au mari de ma mère",
        text: "Merci d’avoir choisi d’aimer, d’encadrer et de soutenir les enfants d’autrui que nous sommes. Le sang ne fait pas tout : la présence, l’exemple et la constance construisent véritablement un homme."
      },
      {
        to: "À mes frères et sœurs",
        text: "Merci pour les rires, les tensions, les conseils et l’amour partagé. Grandir à vos côtés a forgé mon caractère et constitue une part essentielle de mon équilibre."
      },
      {
        to: "À mon défunt père",
        text: "Merci pour les dures réalités que la vie m’a imposées si tôt. Certaines épreuves ont été déchirantes, mais elles m’ont appris la maturité précoce, le sens des responsabilités et la résilience. Repose en paix, Papa."
      },
      {
        to: "À mon père spirituel",
        text: "Merci pour l’accompagnement, les conseils avisés, la discipline et la guidance morale. Vous avez contribué à fortifier mon esprit lorsque la vie cherchait à l’ébranler."
      },
      {
        to: "À ma mère adoptive Chantal Koulaté",
        text: "Merci maman pour l’affection inconditionnelle, l’attention délicate et le soutien moral. Votre présence a été un rappel que l’amour véritable sait emprunter bien des chemins."
      },
      {
        to: "À tous ceux, de près comme de loin",
        text: "Qui m’ont encouragé, conseillé, corrigé, soutenu ou ont simplement cru en moi à un moment donné... Merci. Même les paroles les plus simples ont parfois un impact immense. Ce livre n’est pas seulement le mien : il est le reflet de toutes les mains bienveillantes qui ont soutenu mon parcours."
      }
    ],
    sign: "Avec gratitude et humilité, Dioh Franck Alex"
  },
  preface: [
    "Il existe des histoires qui crient.",
    "Et d’autres qui murmurent.",
    "Ce roman appartient à celles qui murmurent.",
    "« Ceux qu’on n’entend pas » n’est pas seulement le récit d’un jeune garçon nommé Noah. C’est le portrait fidèle de milliers de vies que l’on croise chaque jour sans réellement les voir. Des jeunes qui portent sur leurs frêles épaules des responsabilités trop lourdes pour leur âge. Des mères qui sacrifient leurs rêves pour que leurs enfants en aient un. Des familles éprouvées par l’absence, mais maintenues debout par la seule dignité.",
    "Noah grandit dans un quartier populaire où le bruit est permanent : radios criardes, disputes de voisinage, vrombissements de moteurs et rires nerveux. Pourtant, au milieu de ce vacarme étourdissant, il apprend le silence. Non pas le silence de la résignation, mais celui de la construction intérieure. Car c’est souvent dans le silence que naissent les plus grandes révolutions de l'âme.",
    "Ce roman est une traversée.",
    "Une traversée de l’enfance vers la maturité.",
    "De la précarité vers l’ambition.",
    "De l’abandon vers l’acceptation et le dépassement de soi.",
    "Le Baccalauréat, dans cette histoire, n’est pas qu’un simple examen académique. Il devient un symbole sacré. Une frontière invisible entre deux mondes : celui que l’on subit et celui que l’on choisit.",
    "Mais réussir ne signifie pas oublier.",
    "Partir ne signifie pas guérir instantanément.",
    "Et grandir n’efface pas toutes les cicatrices du passé.",
    "À travers Noah, c’est une question universelle qui se pose : que devient-on lorsqu’on a grandi sans avoir été entendu ?",
    "Ce livre s’adresse aux jeunes qui doutent. Aux mères qui espèrent en secret. À tous ceux que l’on sous-estime hâtivement.",
    "Il rappelle une vérité lumineuse : le monde finit toujours par entendre ceux qui persévèrent dans la droiture.",
    "Si, en refermant ces pages, vous pensez à quelqu’un que l’on n’écoute pas assez... alors ce roman aura accompli sa mission la plus noble."
  ],
  chapters: [
    {
      id: 'chap-1',
      title: 'Chapitre 1 : Le Bruit du Quartier',
      subtitle: 'La poussière des ruelles, le silence d’un fils et la première étincelle d’amitié',
      illustration: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "On ne choisit pas toujours l’endroit où l’on naît. Mais parfois, l’endroit où l’on naît choisit ce que l’on devient. Dans ce quartier poussiéreux d'Abidjan, les rêves avaient du mal à respirer...",
        "Ce quartier grondait comme un cœur trop plein. Des cris d’enfants courant après un ballon dégonflé, des moteurs fatigués crachant leur fumée noire, des casseroles qui s’entrechoquaient sur les réchauds à charbon — la vie hurlait son existence dans chaque ruelle. Mais au milieu de ce tumulte assourdissant, Noah demeurait silencieux.",
        "Assis sur un vieux muret fissuré à l'ombre d'un acacia, les coudes posés sur les genoux et les yeux fixés vers l'horizon, il cherchait une issue invisible. Ses pensées voguaient bien plus loin que les toits de tôle rouillée. Plus loin que la poussière ocre suspendue dans l’air brûlant de midi. Il pensait à sa mère. À ses silences pesants. À son regard las mais obstinément debout. Il pensait à lui-même, et à ce qu’il refusait de devenir sous la pression du désœuvrement.",
        "— Noah ! La voix fendit soudain l’air chaud. Il ne bougea point. Hé, tu vis encore ou tu es parti sans prévenir ?",
        "Michael apparut au bout de la venelle, essoufflé mais le sourire éclatant, une étincelle de pure franchise dans les yeux. Il s’approcha et administra une petite tape fraternelle sur l’épaule de Noah.",
        "— Je suis passé chez toi. Ta mère m’a dit que tu étais sorti. Elle a confié qu’elle aurait besoin de nous.",
        "Noah releva lentement la tête, ses sourcils se fronçant : — Elle a dit cela ?",
        "— Oui. Elle m’a regardé avec gravité, comme si c’était d'une grande importance. Tu connais ce regard-là.",
        "Noah connaissait intimement ce regard. Ce n’était point une simple sollicitation de complaisance : c’était un appel. Il se leva sans hâte. La fine poussière glissa de son pantalon usé jusqu'à la trame. La brume de ses doutes s'était dissipée d'un coup.",
        "— Elle a besoin de nous pour quoi exactement ?",
        "Michael haussa les épaules avec bonhomie : — Elle n’a pas précisé les détails. Mais quand une mère dit qu’elle a besoin de toi... tu accours sans marchander.",
        "Un sourire discret, mais d'une authenticité totale, éclaira le visage de Noah.",
        "Ils s'élancèrent côte à côte dans la ruelle grouillante. Deux silhouettes élancées dans une cité souvent trop vaste pour les humbles. Noah jeta un ultime coup d'œil par-dessus son épaule, comme s’il abandonnait sur ce muret décrépit ses tourments d'adolescent. Il ignorait encore que cette journée marquerait le point de départ d'une grande métamorphose. Quelque chose qui le pousserait à faire des choix capitaux, à grandir et à s'affirmer. Parce que bien souvent, les plus belles destinées débutent par les mots d'une mère qui murmure : « J’ai besoin de vous. »"
      ]
    },
    {
      id: 'chap-2',
      title: 'Chapitre 2 : Le Foyer et les Sacrifices Invisibles',
      subtitle: 'La tendresse d’un repas partagé et le panier du marché',
      illustration: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "Les deux garçons pressèrent le pas en approchant de la modeste cour familiale. Arrivés devant la porte de tôle ondulée, Noah frappa trois petits coups rythmés.",
        "— Maman, c’est nous.",
        "Le battant grinça aussitôt. Sa mère apparut dans l’encadrement. Lorsqu'elle les aperçut debout côte à côte, une lueur apaisante illumina son visage buriné par les labeurs. Un sourire franc, débarrassé pour un court instant de toute anxiété.",
        "— Ah... vous voilà enfin réunis.",
        "Elle les contempla avec attendrissement, comme si ce tableau fraternel suffisait à effacer les tourments de la semaine.",
        "— Entrez donc, mes enfants.",
        "Ils pénétrèrent dans la pièce unique, soigneusement balayée. L’odeur réconfortante du riz fumant et d'une sauce graine mijotée embaumait l’espace restreint.",
        "— Vous devez être affamés, dit-elle d'une voix douce. J’ai préparé de quoi vous sustenter. Ce n’est pas un grand festin... mais c’est cuisiné avec tout mon cœur.",
        "Michael inclina la tête avec un profond respect : — Merci infiniment, maman.",
        "Noah, lui, scruta discrètement le fond de la marmite. Il savait le coût réel de ce « pas grand-chose ». Il devinait les pièces de monnaie comptées une à une dans le coin de son pagne, les privations invisibles consenties pour que deux jeunes garçons ne connaissent point la honte de la faim.",
        "— Mangez à votre faim. Vous êtes ma raison de lutter chaque jour, vous le savez bien ?",
        "Noah ressentit une onde de chaleur dans la poitrine. Pas seulement celle du repas chaud, mais le sentiment sacré d’un foyer. Humble, vulnérable face aux aléas de la vie, mais inébranlable par la force de l'affection.",
        "Michael lança d’un ton joyeux pour détendre l’atmosphère : — Si tu nous mitonnes de tels délices à chaque visite, je vais finir par installer mon lit ici !",
        "La mère de Noah éclata d’un rire cristallin : — Vraiment ? Dans ce cas, il te faudra m’accompagner porter les fardeaux au marché chaque matin sans faillir !",
        "Les rires complices résonnèrent entre les cloisons. Durant cette parenthèse enchantée, il n’y eut ni peur du lendemain, ni créanciers menaçants, ni rancœur. Seulement le bruit rassurant des cuillères dans les assiettes en émail, et le regard d'une femme qui refuse de désespérer."
      ]
    },
    {
      id: 'chap-3',
      title: 'Chapitre 3 : L’Ombre du Père',
      subtitle: 'Les tempêtes domestiques, l’injustice et le serment sous la nuit étoilée',
      illustration: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "Contrairement à sa mère qui était une source inépuisable de bienveillance, Monsieur Ninky, le père de Noah, n’était qu’une ombre menaçante. Une ombre furtive qui traversait la maison sans jamais s’arrêter, une voix qui grondait sans jamais réconforter, une présence qui blessait bien plus qu’elle ne protégeait.",
        "Dans tout le quartier, chacun redoutait ses emportements imprévisibles. Il rentrait aux heures tardives de la nuit, l'haleine chargée d'alcool frelaté et l’esprit assombri par des rancœurs stériles. Là où son épouse s’exprimait avec douceur, lui imposait sa loi par la terreur. Là où elle s’échinait à bâtir, il démolissait d'un revers de main.",
        "Mais son père n’était pas simplement dur de caractère : il était absent même lorsqu'il se tenait physiquement dans la pièce. Son cœur et ses deniers s'en allaient ailleurs, auprès d'une autre femme qui, selon les rumeurs colportées par les voisines, l'avait ensorcelé. Qu'importaient les sornettes : la réalité crue était qu'il dilapidait auprès d'elle les modestes sommes qui faisaient cruellement défaut sous son propre toit.",
        "Un soir d'orage, la discorde éclata avec une violence inouïe. Les reproches fusèrent sans retenue : — Où est passé l’argent du loyer ? Pourquoi oses-tu me demander des comptes ? Tu oublies qui commande ici ?",
        "Sa mère tenta d’expliquer calmement : — Les enfants n'ont plus de cahiers, et le dispensaire réclame son dû... Mais sa modération n'attisa que la fureur de l'homme. L’invective se mua en insulte ordurière, et l’insulte se solda par un coup retentissant.",
        "Noah vit rouge. Son sang ne fit qu’un tour. Rejetant toute prudence d'enfant soumis, il s'interposa résolument, les poings serrés : — Ça suffit maintenant ! Ne pose plus jamais la main sur ma mère !",
        "— Tu oses lever les yeux sur moi, misérable ingrat ? éructa son père, stupéfait.",
        "— Je ne suis plus le petit garçon tremblant d'autrefois.",
        "La gifle cingla violemment la tempe de Noah. Un goût métallique de sang emplit sa bouche. Pourtant, il ne vacilla pas, soutenant le regard de son géniteur sans ciller.",
        "— Si cette bicoque ne vous convient plus, débarrassez le plancher ! cracha l'homme avant de claquer violemment la porte derrière lui.",
        "Noah aida sa mère éplorée à s'asseoir sur le grabat. Essuyant un filet de sang sur sa lèvre, il murmura avec une fermeté souveraine : — Nous nous relèverons sans lui, maman. Je te le jure."
      ]
    },
    {
      id: 'chap-4',
      title: 'Chapitre 4 : La Voix de l’Intelligence Artificielle',
      subtitle: 'La consultation solitaire et la naissance d’une résolution inaltérable',
      illustration: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "Cette nuit-là, incapable de trouver le sommeil, Noah s'installa dehors sous la voûte céleste d'Abidjan. Le quartier s'était enfin apaisé. Il alluma son modeste smartphone à l'écran fendu, précieux outil qu'il avait acquis grâce à de menus travaux de manutention.",
        "Il ouvrit l'interface de Flex IA, l'assistant intelligent développé pour instruire et accompagner la jeunesse studieuse. D'une main hésitante, il tapa : « Je me sens épuisé par tant d'injustices. Que faire face à un père destructeur ? »",
        "Une seconde plus tard, des mots d'une lucidité remarquable s'affichèrent avec bienveillance :",
        "« Noah, tu ne peux point changer les choix d'un homme adulte qui refuse ses devoirs. Cependant, tu détiens le pouvoir absolu de décider de ce que cette épreuve fera de toi. Tu peux laisser la douleur se transformer en haine stérile, ou la sublimer en une force de résilience inébranlable. Nourris ton esprit par l'étude. Consacre chaque heure à forger ton intelligence. Le savoir est l'unique arme capable de briser les chaînes de la précarité et de redonner le sourire à ta mère. »",
        "Cette réponse frappa son esprit comme un trait de foudre. Noah comprit que sa revanche ne se ferait ni par les coups ni par les rancunes, mais par l'excellence académique.",
        "Il leva les yeux vers les étoiles lointaines et pria dans son for intérieur : « Seigneur, donne-moi la sagesse d'apprendre sans faillir, la force de protéger les miens, et la grâce de ne jamais ressembler à ceux qui écrasent les faibles. »"
      ]
    },
    {
      id: 'chap-5',
      title: 'Chapitre 5 : Le Pacte de la Terminale',
      subtitle: 'Le programme de travail acharné et la promesse du Baccalauréat',
      illustration: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "Le lendemain au lycée moderne, Noah marchait d'un pas neuf. Finies les hésitations : l'objectif de son existence était désormais limpide. En classe de Terminale, chaque cours devenait un champ de bataille intellectuel.",
        "Pendant la récréation, assis sous l’ombre généreuse d’un flamboyant centenaire, Michael vint s'asseoir à ses côtés, partageant deux morceaux de pain garni d'arachides.",
        "— Noah, je te regarde depuis ce matin. Tes yeux ont changé. On dirait que tu as vu le futur.",
        "— J'ai compris que nous n'avions pas le droit à l'échec, Michael. Le Baccalauréat n'est pas un simple parchemin pour nous : c'est notre unique passeport pour sortir de cette poussière. Si nous échouons, nous serons condamnés à subir la fatalité.",
        "Michael approuva d'un hochement de tête déterminé : — Tu as raison à mille pour cent ! Dès aujourd'hui, nous instaurons une discipline de fer. Lundi : mathématiques et probabilités. Mardi : dissertation philosophique et histoire contemporaine. Mercredi : physique-chimie. Jeudi : littérature et anglais. Vendredi : synthèse et révisions générales. Et tout le week-end, épreuves blanches en conditions réelles !",
        "Ce jour-là, les deux adolescents scellèrent un pacte d'émulation réciproque. Ils allaient réviser jusqu'à ce que la fatigue cède le pas à la maîtrise parfaite de chaque notion."
      ]
    },
    {
      id: 'chap-6',
      title: 'Chapitre 6 : L’Épreuve du Paludisme',
      subtitle: 'L’effondrement physique, l’abandon lâche du père et l’angoisse des soins',
      illustration: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "Durant deux mois consécutifs, Noah ne s'accorda guère plus de quatre heures de repos par nuit. « Maman, encore une démonstration », répétait-il inlassablement lorsque sa mère le conjurait d'éteindre la petite lampe.",
        "Hélas, l'organisme a ses limites que la seule volonté ne saurait indéfiniment repousser. Un matin de composition générale, tandis qu'il rédigeait une dissertation philosophique sur la justice et le devoir, sa vision se troubla soudainement. Les lettres dansèrent devant ses yeux, une sueur glacée inonda ses tempes, et Noah s'effondra lourdement sur le sol carrelé de la classe.",
        "Transporté d'urgence au centre hospitalier, le diagnostic des praticiens fut alarmant : accès pernicieux de paludisme doublé d'une anémie sévère par épuisement. Le traitement d'urgence et les perfusions s'élevaient à quatre-vingt-seize mille francs CFA.",
        "Une somme colossale pour sa mère. Éperdue d'angoisse, elle tenta désespérément de contacter son époux. Mais le téléphone sonnait désespérément dans le vide. Une voisine compatissante lui révéla l'atroce vérité : Monsieur Ninky avait déménagé ses quelques effets au petit matin pour s'installer définitivement chez sa maîtresse, laissant sa famille à l'abandon complet.",
        "Face à cette désertion révoltante, la mère de Noah ravala ses larmes et parcourut le quartier dès l'aube. Elle frappa aux portes des résidences cossues pour proposer ses services de lavandière, frottant le linge du matin au crépuscule jusqu'à en avoir les mains écorchées, suppliant le ciel de préserver la vie de son unique enfant."
      ]
    },
    {
      id: 'chap-7',
      title: 'Chapitre 7 : La Fraternité en Actes',
      subtitle: 'Le geste noble de Michael et la bénédiction inattendue d’un bienfaiteur',
      illustration: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "En apprenant l'état critique de son compagnon et le désespoir de sa mère, le cœur de Michael se serra douloureusement. Issu d'une famille plus aisée grâce au commerce de son père, il ne pouvait tolérer qu'une question d'argent vienne faucher les espérances de son ami.",
        "Le soir même, n'écoutant que son courage et son sens du devoir moral, Michael alla trouver son père, un négociant réputé pour sa sévérité mais aussi pour sa piété :",
        "— Papa, mon frère de cœur Noah se meurt à l'hôpital. Sa mère n'a point de quoi régler les soins. Avance-moi l'argent sur mes futurs gages de vacances, je t'en conjure !",
        "Le négociant observa son fils avec une profonde gravité. Il connaissait la réputation de sérieux et d'honnêteté du jeune Noah. Touché par la ferveur fraternelle de son fils, il sortit une liasse de billets de son coffre-fort :",
        "— Prends cette somme, Michael. La richesse matérielle ne trouve sa justification suprême que lorsqu'elle permet de sauver une vie et de soutenir les âmes méritantes.",
        "Le lendemain à l'hôpital, lorsque Michael remit l'enveloppe à la mère de Noah, celle-ci fondit en larmes de reconnaissance, bénissant ce jeune homme d'exception. Grâce aux remèdes administrés à temps, la fièvre tomba, et Noah put enfin rouvrir les yeux sur un avenir préservé."
      ]
    },
    {
      id: 'chap-8',
      title: 'Chapitre 8 : L’École des Illusions et la Revanche',
      subtitle: 'Les moqueries des nantis, le rappel à l’ordre du proviseur et la soif d’excellence',
      illustration: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "De retour au lycée après deux semaines de convalescence forcée, Noah dut essuyer les railleries mesquines de quelques élèves fortunés et insouciants : — Tiens, voilà le miraculé ! Ta mère est-elle encore occupée à essorer le linge de nos familles pour quelques piécettes ?",
        "Avant même que Noah n'esquisse un geste, Michael se dressa d'un bond, le regard flamboyant : — Taisez-vous ! Vous étalez votre vanité, mais vous ignorez tout de ce qu'exige le véritable courage face à l'adversité !",
        "Le vacarme alerta le proviseur de l'établissement qui convoqua immédiatement les insolents dans son bureau. D'un ton sévère qui ne souffrait nulle contestation, le directeur leur tint ce langage :",
        "— L'opulence de vos parents ne vous donne aucunement le droit de mépriser autrui. Une femme qui se sacrifie avec dignité pour l'instruction de son enfant commande le respect le plus solennel. Si j'entends encore une seule parole déplacée, c'est l'exclusion définitive.",
        "Cet épisode acheva de tremper le moral de Noah comme de l'acier forgé au feu. Il ne cherchait plus à plaire ni à prouver quoi que ce soit à ses détracteurs : il travaillait pour accomplir son devoir d'honneur. Chaque bonne note obtenue devenait une réponse lumineuse aux sarcasmes de la médiocrité."
      ]
    },
    {
      id: 'chap-9',
      title: 'Chapitre 9 : Le Retour du Père Repenti',
      subtitle: 'La ruine, la déchéance et la leçon du pardon maternel',
      illustration: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "Quelques semaines avant les épreuves du Baccalauréat, par un crépuscule lourd d'humidité, une silhouette hésitante franchit le seuil de la cour. C'était Monsieur Ninky.",
        "Mais ce n'était plus le despote arrogant d'autrefois : dépouillé de ses économies et brutalement chassé par sa maîtresse dès lors que ses poches furent vides, il revenait brisé, le regard fuyant et les vêtements défraîchis.",
        "Noah le contempla avec un mutisme de marbre. Tout son être intérieur lui dictait de claquer la porte au nez de cet homme qui les avait abandonnés au bord du gouffre.",
        "Cependant, sa mère s'avança avec une dignité royale. Elle lui servit un verre d'eau fraîche, puis se tourna vers son fils :",
        "— Noah, ton père a fait ses choix d'adulte et en récolte aujourd'hui l'amertume. Ne laisse jamais la rancœur empoisonner ton cœur d'enfant. Le pardon ne signifie point approuver le mal, mais refuser d'être enchaîné par lui.",
        "Ces paroles d'une noblesse inouïe bouleversèrent Noah. Il comprit que sa mère était une géante morale, bien au-dessus des mesquineries de ce monde."
      ]
    },
    {
      id: 'chap-10',
      title: 'Chapitre 10 : Le Sacre du Baccalauréat',
      subtitle: 'La foule fébrile des délibérations, la Mention Très Bien et les larmes maternelles',
      illustration: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "Le jour des délibérations officielles du Baccalauréat, une houle fébrile de candidats et de familles envahissait l'esplanade du lycée central.",
        "Soudain, un cri retentissant déchira l'atmosphère tendue. Michael fendit la foule en courant, agitant les bras avec frénésie :",
        "— NOAH ! NOAH ! Regarde la liste officielle des majors ! C'est fait ! Nous l'avons décroché avec éclat ! Mention Très Bien pour toi, Mention Bien pour moi !",
        "Une clameur de joie monta du groupe de leurs camarades. Noah resta un instant immobile, les larmes lui brouillant la vue. Tout le film de ces années de privation défila en une seconde : le muret poussiéreux, les nuits sans électricité, les lessives épuisantes de sa mère, les prières au clair de lune...",
        "De retour à la maison, sa mère l'attendait sur le pas de la porte. Lorsqu'il lui annonça la Mention Très Bien avec félicitations du jury, elle tomba à genoux dans la poussière pour rendre grâce à Dieu, avant d'étreindre son fils de toutes ses forces.",
        "Le père de Michael fit livrer deux magnifiques ordinateurs portables pour saluer la brillante consécration des deux frères d'adoption. Le quartier entier dansa jusqu'à l'aube pour célébrer la victoire des enfants du peuple."
      ]
    },
    {
      id: 'chap-11',
      title: 'Chapitre 11 : La Bourse d’Excellence et le Grand Envol',
      subtitle: 'L’attribution de la bourse pour Londres, les adieux déchirants et la promesse sacrée',
      illustration: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "Trois semaines plus tard, un télégramme officiel émanant du Ministère de l'Enseignement Supérieur parvint au domicile familial : en raison de ses notes magistrales, Noah se voyait attribuer une bourse d'études internationales d'excellence pour intégrer une université prestigieuse à Londres.",
        "Le père de Michael prit personnellement en charge les formalités consulaires et le trousseau de voyage : — C'est un honneur pour notre communauté de propulser un tel prodige vers les sommets.",
        "À la veille du départ, Noah se rendit au cimetière municipal sur la tombe de son père, décédé subitement d'une crise cardiaque quelques jours après son retour :",
        "— Papa... j'ai pardonné. Je pars pour faire honneur à notre nom. Puisses-tu reposer dans la paix divine.",
        "Le lendemain dans le hall animé de l'aéroport international Félix Houphouët-Boigny, l'émotion atteignit son paroxysme. Michael serra vigoureusement Noah dans ses bras : — Fais briller notre drapeau là-bas, mon frère ! Reviens-nous avec le savoir qui transformera notre continent !",
        "Puis vint le tour de sa mère. Elle posa ses mains calleuses sur les joues de son fils et murmura les yeux baignés de larmes : — Va, mon enfant. N'oublie jamais d'où tu viens, et garde toujours ton cœur pur.",
        "Gravissant la passerelle de l'aéronef, le regard tourné vers le ciel infini, Noah mesurait l'immensité du chemin parcouru : de l'anonymat d'une ruelle déshéritée aux prestigieux amphithéâtres du monde, guidé par la seule force de l'amour maternel."
      ]
    },
    {
      id: 'chap-12',
      title: 'Chapitre 12 : Ceux qu’on n’entend pas',
      subtitle: 'La découverte du vieux cahier d’écolier et le testament spirituel d’une génération',
      illustration: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80',
      paragraphs: [
        "« On peut étouffer la voix d’un homme, mais nul ne saurait éteindre sa détermination. »",
        "Durant toutes ces années d'apprentissage et de combats intérieurs, Noah avait fidèlement couché ses impressions, ses détresses et ses espoirs sur les pages jaunies d'un registre d'écolier portant pour titre : CEUX QU'ON N'ENTEND PAS.",
        "Ce précieux carnet, son père l'avait jadis feuilleté en secret avant de rendre son dernier souffle. Il y avait lu cette phrase poignante qui avait achevé de le foudroyer de remords : « J’espérais tant qu'un jour tu sois fier de moi, papa... Et malgré tout le mal subi, mon cœur ne parvient pas à te haïr. »",
        "Noah comprit alors l'ultime leçon de son existence : notre planète regorge d'âmes pures, de mères admirables et de jeunes talents que l'indifférence générale condamne au silence. Pourtant, lorsque la vertu s'allie au labeur rigoureux et à la foi inébranlable, aucune fatalité sociale ne peut résister.",
        "En traversant la mer de nuages vers l'Europe, Noah n'était plus le spectateur impuissant de sa condition, mais un bâtisseur résolu, prêt à inspirer des millions d'autres cœurs silencieux à travers le globe."
      ]
    }
  ],
  authorNote: [
    "Écrire « Ceux qu’on n’entend pas » a constitué bien plus qu’un simple exercice littéraire. Ce fut un véritable pèlerinage de l’âme.",
    "Noah est certes né sous ma plume, mais sa trajectoire est authentique et universelle.",
    "Elle palpite dans chaque ruelle de nos cités africaines et mondiales.",
    "Dans chaque cour d'école de banlieue.",
    "Au cœur de chaque foyer qui lutte dignement contre l'adversité.",
    "Il incarne ce jeune discret que l’on croise distraitement sans jamais lui prêter attention. Celui dont les lèvres demeurent closes par pudeur, que l’on sous-estime avec désinvolture, et dont personne ne soupçonne les combats homériques livrés en secret.",
    "À travers cet ouvrage, j’ai souhaité prêter une voix solennelle à ces solitudes héroïques.",
    "Mon dessein n'était point d'apitoyer sur la précarité, mais de glorifier la splendeur inaltérable de la dignité humaine.",
    "Car la pauvreté de naissance n’est point une tare. L’abandon n’est point une fatalité irrémédiable. Et le silence n’est en rien un aveu de capitulation.",
    "Ce roman se veut également un monument d'hommage élevé à nos mères. À ces héroïnes du quotidien qui portent le monde à bout de bras dans l'anonymat le plus pur. Elles sont les pierres d'angle de toutes les grandes réussites silencieuses de l'Histoire humaine.",
    "Si ce récit parvient à insuffler le courage d'espérer à un seul jeune tenté par le renoncement... s’il peut fortifier une mère dans la foi qu'elle place en son enfant... s’il rappelle à chaque lecteur que nul n'est transparent aux yeux de l'Histoire... alors chaque goutte d'encre aura rempli sa vocation.",
    "Notre époque s'étourdit volontiers du vacarme éphémère. Pourtant, les annales de l'humanité nous enseignent que ce sont presque toujours les bâtisseurs silencieux qui accomplissent les œuvres les plus durables.",
    "À vous tous qui parcourez ces lignes : persévérez sans faiblir. Même si les applaudissements tardent à venir. Vos accomplissements résonneront bientôt pour vous.",
    "Et le monde entier finira par vous entendre.",
    "— Dioh Franck Alex"
  ]
};

export const OTHER_LIBRARY_BOOKS = [
  {
    id: 'book-afrique-manden',
    title: "L'Épopée de Soundiata",
    author: "Djibril Tamsir Niane",
    genre: "Épopée & Histoire Africaine",
    pages: 160,
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    desc: "La grande légende de Soundiata Keïta, fondateur de l'Empire du Mali et proclamateur de la Charte du Manden."
  },
  {
    id: 'book-achebe-things-fall-apart',
    title: "Le monde s'effondre (Things Fall Apart)",
    author: "Chinua Achebe",
    genre: "Roman Africain Majeur",
    pages: 220,
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    desc: "Le chef-d'œuvre de Chinua Achebe retraçant le destin tragique d'Okonkwo et la confrontation des traditions ibos."
  },
  {
    id: 'book-mariama-ba-si-longue-lettre',
    title: "Une si longue lettre",
    author: "Mariama Bâ",
    genre: "Roman Épistolaire",
    pages: 168,
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80",
    desc: "Confidences intimes et émouvantes de Ramatoulaye sur la condition féminine et le courage des mères."
  },
  {
    id: 'book-monte-cristo',
    title: "Le Comte de Monte-Cristo",
    author: "Alexandre Dumas",
    genre: "Chef-d'œuvre d'Aventure & Justice",
    pages: 1200,
    rating: 5.0,
    cover: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80",
    desc: "L'épopée mythique d'Edmond Dantès, de l'injustice du château d'If à sa grandiose rédemption."
  },
  {
    id: 'book-petit-prince',
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    genre: "Conte Philosophique Universel",
    pages: 96,
    rating: 5.0,
    cover: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=400&q=80",
    desc: "« On ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux. »"
  },
  {
    id: 'book-pensees-marc-aurele',
    title: "Pensées pour moi-même",
    author: "Marc Aurèle",
    genre: "Philosophie Stoïcienne",
    pages: 240,
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=400&q=80",
    desc: "Le traité immortel de résilience mentale, de maîtrise des émotions et de sagesse intérieure de l'empereur-philosophe."
  },
  {
    id: 'book-art-guerre',
    title: "L'Art de la Guerre",
    author: "Sun Tzu",
    genre: "Stratégie & Leadership",
    pages: 112,
    rating: 4.7,
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80",
    desc: "Le plus ancien et le plus célèbre traité de stratégie et d'anticipation psychologique au monde."
  },
  {
    id: 'book-alchimiste',
    title: "L'Alchimiste",
    author: "Paulo Coelho",
    genre: "Fable Initiatique",
    pages: 190,
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=400&q=80",
    desc: "Le voyage poétique du jeune berger Santiago à la recherche de sa Légende Personnelle à travers le désert."
  }
];
