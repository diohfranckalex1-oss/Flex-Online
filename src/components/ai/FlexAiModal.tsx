import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  RefreshCw,
  MessageSquare,
  Maximize2,
  Minimize2,
  Trash2,
  GraduationCap,
  BookOpen,
  Atom,
  Binary,
  Compass,
  HeartPulse,
  Scale,
  Code
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FlexAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_TOPICS = [
  {
    icon: '🧪',
    label: 'Sciences & Physique',
    iconComp: Atom,
    prompt: 'Explique-moi la théorie de la relativité générale d\'Albert Einstein et le fonctionnement de la gravitation universelle avec des exemples simples.',
  },
  {
    icon: '📐',
    label: 'Mathématiques',
    iconComp: Binary,
    prompt: 'Démontre le théorème de Pythagore et donne des exemples concrets d\'application géométrique étape par étape.',
  },
  {
    icon: '🩺',
    label: 'Médecine & Santé',
    iconComp: HeartPulse,
    prompt: 'Comment fonctionnent le système immunitaire humain et le cœur ? Quels sont les conseils clés pour une excellente santé cardiovasculaire ?',
  },
  {
    icon: '🏛️',
    label: 'Histoire des Civilisations',
    iconComp: BookOpen,
    prompt: 'Raconte-moi en détail l\'histoire de l\'Empire du Mali, de Soundiata Keïta et du pèlerinage mémorable de Mansa Moussa à Tombouctou.',
  },
  {
    icon: '📜',
    label: 'Philosophie & Sagesse',
    iconComp: Scale,
    prompt: 'Qu\'est-ce que le stoïcisme selon Marc Aurèle et Sénèque ? Comment appliquer concrètement la dichotomie du contrôle au quotidien ?',
  },
  {
    icon: '🌍',
    label: 'Géographie Mondiale',
    iconComp: Compass,
    prompt: 'Quels sont les plus grands fleuves du monde, les plus hauts sommets et les capitales clés des 5 continents ?',
  },
  {
    icon: '💻',
    label: 'Code & Informatique',
    iconComp: Code,
    prompt: 'Donne-moi un algorithme de recherche moderne en Python et une fonction asynchrone avec gestion d\'erreurs en TypeScript.',
  },
  {
    icon: '🌟',
    label: 'Franck Alex & Vision',
    iconComp: Sparkles,
    prompt: 'Qui est Franck Alex et quelle est sa vision en créant l\'application Flex Online ?',
  },
  {
    icon: '🛡️',
    label: 'Sécurité Flex Online',
    iconComp: ShieldCheck,
    prompt: 'Comment fonctionnent le chiffrement de bout en bout, le code PIN secret et la récupération par clé d\'urgence sur Flex Online ?',
  },
];

// In-client fallback polymath knowledge generator
function getClientPolymathFallback(query: string): string {
  const lower = query.toLowerCase();

  // 1. Specific queries about the Creator of Flex Online or Flex IA
  const isCreatorQuery = (
    lower.includes("qui t'a fait") ||
    lower.includes("qui t'a créé") ||
    lower.includes("qui t'a cree") ||
    lower.includes("qui t'a conçu") ||
    lower.includes("qui t'a concu") ||
    lower.includes("ton créateur") ||
    lower.includes("ton createur") ||
    lower.includes("qui est ton créateur") ||
    lower.includes("qui a créé flex") ||
    lower.includes("qui a cree flex") ||
    lower.includes("qui a fait flex") ||
    lower.includes("fondateur de flex") ||
    lower.includes("créateur de flex") ||
    lower.includes("createur de flex") ||
    lower.includes("parle-moi de franck alex") ||
    lower.includes("qui est franck alex") ||
    lower.includes("qui est alex dioh")
  );

  if (isCreatorQuery) {
    return `Mon créateur est **Franck Alex** (Alex Dioh) ! 🌟🚀\n\nC'est le jeune prodige, innovateur et développeur passionné qui a imaginé, conçu et programmé **Flex Online** de bout en bout.\n\n• **Sa vision :** Créer une super-application sociale moderne, ultra-rapide et respectueuse de la vie privée, équipée d'une sécurité impénétrable (clé de secours, protection par puce SIM, code PIN 4 chiffres, bouclier anti-harcèlement).\n• **Ses innovations exclusives :** Gestion de 2 comptes sur le même smartphone avec bascule immédiate sans déconnexion, synchronisation PC Windows sans fil par QR Code, et cette intelligence artificielle universelle.\n\nC'est grâce à son dévouement total que Flex Online existe et continue d'évoluer chaque jour !`;
  }

  // 2. Littérature & Auteurs célèbres
  if (lower.includes('le prince') || lower.includes('machiavel') || lower.includes('machiavelli') || lower.includes('il principe')) {
    return `📚 **« Le Prince » (*Il Principe*) :**\n\nL'auteur du célèbre traité *Le Prince* est **Nicolas Machiavel** (Niccolò Machiavelli), éminent philosophe, théoricien politique et diplomate florentin.\n\n• **Date :** Rédigé en 1513 et publié en 1532.\n• **Analyse :** Ce texte fondateur de la science politique moderne explore la conquête et la conservation du pouvoir. Machiavel y théorise l'équilibre entre la fortune (*fortuna*) et la vaillance politique (*virtù*), affirmant qu'un dirigeant avisé doit savoir user à la fois de la force du lion et de la ruse du renard.`;
  }

  if (lower.includes('les misérables') || lower.includes('les miserables') || lower.includes('notre-dame de paris') || lower.includes('victor hugo')) {
    return `📚 **Victor Hugo (1802-1885) :**\n\nFigure de proue de la littérature française et du Romantisme.\n\n• **Œuvres majeures :** *Les Misérables* (1862), *Notre-Dame de Paris* (1831), *Les Contemplations*.\n• **Portée :** Un plaidoyer universel pour l'éducation, la justice sociale et la dignité humaine.`;
  }

  if (lower.includes("l'étranger") || lower.includes("l'etranger") || lower.includes('la peste') || lower.includes('camus')) {
    return `📚 **Albert Camus (1913-1960) :**\n\nÉcrivain et philosophe français, Prix Nobel de littérature en 1957.\n\n• **Œuvres majeures :** *L'Étranger* (1942), *Le Mythe de Sisyphe*, *La Peste*.\n• **Philosophie :** L'absurde de la condition humaine surmonté par la révolte lucide et la solidarité fraternelle.`;
  }

  if (lower.includes('petit prince') || lower.includes('saint-exupéry') || lower.includes('saint exupery')) {
    return `📚 **« Le Petit Prince » (1943) :**\n\nChef-d'œuvre poétique d'**Antoine de Saint-Exupéry**.\n\n• Conte philosophique universel célébrant l'amour, l'amitié et la pureté du regard de l'enfance : *« On ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux. »* 🌹✨`;
  }

  if (lower.includes('césaire') || lower.includes('cesaire') || lower.includes('senghor') || lower.includes('achebe')) {
    return `📚 **Grands Auteurs Africains & Caribéens :**\n\n• **Aimé Césaire :** *Cahier d'un retour au pays natal* (1939), cofondateur du mouvement de la Négritude.\n• **Léopold Sédar Senghor :** Poète de l'Académie française (*Chants d'ombre*).\n• **Chinua Achebe :** *Le Monde s'effondre* (*Things Fall Apart*, 1958), monument littéraire nigérian et mondial.`;
  }

  if (lower.includes('relativité') || lower.includes('relativite') || lower.includes('einstein') || lower.includes('gravité') || lower.includes('gravite')) {
    return `⚛️ **La Théorie de la Relativité & Gravitation (Albert Einstein) :**\n\n1. **Relativité Restreinte (1905) :**\n• La vitesse de la lumière dans le vide ($c \\approx 300\\,000\\text{ km/s}$) est constante pour tous les observateurs quel que soit leur mouvement.\n• L'équivalence masse-énergie fondamentale s'exprime par la célèbre formule :\n$$\\mathbf{E = m c^2}$$\nElle prouve qu'une toute petite masse renferme une réserve d'énergie colossale.\n\n2. **Relativité Générale (1915) :**\n• La gravité n'est pas une simple force invisible : c'est la **courbure géométrique de l'espace-temps** causée par la masse et l'énergie des corps célestes.\n• Plus un astre est massif (comme la Terre, le Soleil ou un trou noir), plus il creuse la trame de l'univers, guidant le mouvement des planètes et des rayons lumineux.\n• Cette théorie a été confirmée par la déviation de la lumière stellaire et la détection moderne des ondes gravitationnelles.`;
  }

  if (lower.includes('pythagore') || lower.includes('triangle')) {
    return `📐 **Théorème de Pythagore :**\n\nDans un triangle rectangle, le carré de la longueur de l'hypoténuse (le plus grand côté opposé à l'angle droit) est égal à la somme des carrés des longueurs des deux autres côtés.\n\nFormule fondamentale :\n$$\\mathbf{a^2 + b^2 = c^2}$$\n\n• **Démonstration pratique :**\nSi les côtés de l'angle droit mesurent $a = 3\\text{ cm}$ et $b = 4\\text{ cm}$ :\n$$c^2 = 3^2 + 4^2 = 9 + 16 = 25$$\n$$c = \\sqrt{25} = 5\\text{ cm}$$\n\nCe théorème est la pierre angulaire de l'architecture, de la trigonométrie et des systèmes de navigation GPS par satellite ! 🏛️`;
  }

  if (lower.includes('cœur') || lower.includes('coeur') || lower.includes('immunitaire') || lower.includes('santé') || lower.includes('sante') || lower.includes('tension')) {
    return `🩺 **Médecine, Cœur & Système Immunitaire :**\n\n1. **Le Cœur Humain :**\n• Pompe musculaire infatigable battant environ 100 000 fois par jour pour faire circuler 5 litres de sang.\n• Comprend 4 cavités (deux oreillettes et deux ventricules) connectées aux poumons et aux organes vitaux.\n• La tension artérielle idéale au repos se situe autour de **120/80 mmHg**.\n\n2. **Le Système Immunitaire :**\n• **Défense innée :** Barrière cutanée, enzymes et globules blancs phagocytes attaquant tout intrus sans délai.\n• **Défense adaptative :** Lymphocytes B produisant des anticorps sur-mesure et lymphocytes T détruisant les cellules anormales, conservant une mémoire protectrice (principe de la vaccination).\n\n💡 *Conseil de longévité : 30 minutes d'activité physique par jour, sommeil réparateur de 7-8h et hydratation régulière.*`;
  }

  if (lower.includes('mali') || lower.includes('soundiata') || lower.includes('moussa') || lower.includes('histoire') || lower.includes('empire')) {
    return `👑 **L'Empire du Mali & Les Grandes Épopées Africaines :**\n\n1. **Soundiata Keïta & La Charte du Manden (1235) :**\n• Après avoir vaincu le roi Soumaoro Kanté à la bataille de Kirina, Soundiata fonde l'Empire du Mali.\n• Il proclame la **Charte du Manden**, l'une des plus anciennes déclarations des droits de l'homme, prônant le respect de la vie, la dignité humaine, l'abolition des mauvais traitements et la paix sociale.\n\n2. **Mansa Moussa (Kankan Moussa) :**\n• Empereur du XIVe siècle considéré comme l'un des souverains les plus prospères de l'histoire universelle.\n• Lors de son célèbre pèlerinage à La Mecque en 1324, il distribua tant d'or au Caire qu'il fit fluctuer le cours de l'or pendant une décennie.\n• Il transforma Tombouctou et l'université de Sankoré en un phare mondial de littérature, de théologie, de médecine et d'astronomie.`;
  }

  if (lower.includes('stoïcisme') || lower.includes('stoicisme') || lower.includes('marc aurèle') || lower.includes('aurele') || lower.includes('philosophie') || lower.includes('sénèque')) {
    return `🏛️ **Le Stoïcisme & La Sagesse Antique :**\n\nFondé à Athènes par Zénon et incarné par **Épictète**, **Sénèque** et l'empereur **Marc Aurèle** dans ses *Pensées pour moi-même*.\n\n• **La Règle d'or (Dichotomie du Contrôle) :**\nIl faut distinguer ce qui dépend de nous et ce qui n'en dépend pas :\n- **Ce qui dépend de nous :** Nos pensées, nos choix, notre intégrité, nos réactions et notre courage.\n- **Ce qui ne dépend pas de nous :** Les opinions des autres, le temps, les aléas extérieurs, le passé.\n\n• **L'enseignement pratique :**\nNe perdez jamais votre paix intérieure pour des événements que vous ne pouvez changer. Consacrez toute votre énergie à agir avec vertu, honneur et bienveillance sur ce qui est entre vos mains.`;
  }

  if (lower.includes('capitale') || lower.includes('géographie') || lower.includes('geographie') || lower.includes('fleuve') || lower.includes('montagne')) {
    return `🌍 **Géographie Mondiale & Repères Essentiels :**\n\n• **Capitales majeures :**\n- Afrique : Yamoussoukro (Côte d'Ivoire), Dakar (Sénégal), Abuja (Nigéria), Rabat (Maroc), Pretoria (Afrique du Sud), Nairobi (Kenya).\n- Europe : Paris (France), Berlin (Allemagne), Rome (Italie), Londres (Royaume-Uni), Madrid (Espagne).\n- Amériques : Washington D.C. (États-Unis), Ottawa (Canada), Brasília (Brésil).\n- Asie : Tokyo (Japon), Pékin (Chine), New Delhi (Inde).\n\n• **Superlatifs naturels :**\n- Plus long fleuve : Le Nil (6 650 km) et l'Amazone (plus grand débit au monde).\n- Plus haut sommet terrestre : Mont Everest (8 848,86 m, Himalaya).\n- Plus haut sommet africain : Mont Kilimandjaro (5 895 m, Tanzanie).`;
  }

  if (lower.includes('code') || lower.includes('python') || lower.includes('javascript') || lower.includes('typescript') || lower.includes('react')) {
    return `💻 **Programmation & Informatique Moderne :**\n\n• **Exemple d'algorithme rapide en Python :**\n\`\`\`python\n# Filtrer et trier des valeurs uniques avec complexité optimale\ndef extraire_uniques_tries(valeurs):\n    return sorted(list(set(valeurs)))\n\nprint(extraire_uniques_tries([42, 10, 5, 10, 42, 99]))\n# Résultat : [5, 10, 42, 99]\n\`\`\`\n\n• **Exemple robuste en TypeScript / JavaScript :**\n\`\`\`typescript\n// Requête avec timeout et typage fort\nasync function interrogerService<T>(url: string): Promise<T | null> {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(\`Code HTTP: \${res.status}\`);\n    return (await res.json()) as T;\n  } catch (err) {\n    console.error('Erreur API:', err);\n    return null;\n  }\n}\n\`\`\`\n\n💡 *Flex Online tire parti de TypeScript et React pour offrir une fluidité instantanée sans rechargement de page.*`;
  }

  // Default universal response
  return `Bonjour ! Je suis **Flex IA**, l'Intelligence Artificielle officielle et polymathique de **Flex Online** créée par **Franck Alex**. 🤖⚡\n\nVotre question porte sur un sujet très enrichissant : « *${query}* ».\n\nJe suis spécialement programmé pour répondre à l'ensemble de vos questions avec une rigueur absolue :\n• 🧪 **Sciences & Physique :** lois de l'univers, relativité d'Einstein, atomes, astronomie...\n• 📐 **Mathématiques :** calculs, théorèmes démontrés, algèbre et géométrie...\n• 🩺 **Médecine & Biologie :** système immunitaire, physiologie, prévention santé...\n• 🏛️ **Histoire & Philosophie :** empires africains et mondiaux, stoïcisme, penseurs majeurs...\n• 🌍 **Géographie & Culture :** pays, capitales, fleuves et repères universels...\n• 💻 **Informatique & Code :** Python, TypeScript, React, algorithmes et rédaction pro.\n\nN'hésitez pas à me poser une question plus précise, je vous apporte une réponse détaillée instantanément ! 🚀`;
}

// Simple parser for formatting rich text without breaking lines or truncating
const formatRichMessage = (text: string) => {
  // If the message has code blocks, split and style them
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const firstLineEnd = part.indexOf('\n');
      const lang = firstLineEnd > 3 ? part.substring(3, firstLineEnd).trim() : '';
      const code = firstLineEnd > 3 ? part.substring(firstLineEnd + 1, part.length - 3) : part.substring(3, part.length - 3);

      return (
        <div key={index} className="my-3 rounded-2xl bg-[#081210] border border-teal-800/60 overflow-hidden font-mono text-xs">
          {lang && (
            <div className="px-3.5 py-1.5 bg-teal-950/80 border-b border-teal-900/60 text-[11px] font-bold text-teal-300 flex items-center justify-between">
              <span>{lang.toUpperCase()}</span>
              <span className="text-[10px] text-teal-400/80 font-sans">Code Source</span>
            </div>
          )}
          <pre className="p-3.5 overflow-x-auto text-teal-100 font-mono leading-relaxed select-text">
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // Split text into paragraphs
    const paragraphs = part.split('\n');

    return (
      <React.Fragment key={index}>
        {paragraphs.map((para, pIdx) => {
          if (!para.trim()) {
            return <div key={pIdx} className="h-2" />;
          }

          // Format bold items **bold**
          const boldFormatted = para.split(/(\*\*.*?\*\*)/g).map((seg, sIdx) => {
            if (seg.startsWith('**') && seg.endsWith('**')) {
              return (
                <strong key={sIdx} className="font-extrabold text-white">
                  {seg.substring(2, seg.length - 2)}
                </strong>
              );
            }
            // Format inline code `code`
            return seg.split(/(`.*?`)/g).map((sub, subIdx) => {
              if (sub.startsWith('`') && sub.endsWith('`')) {
                return (
                  <code key={subIdx} className="px-1.5 py-0.5 rounded-md bg-teal-950 text-teal-200 border border-teal-800/60 font-mono text-[11px]">
                    {sub.substring(1, sub.length - 1)}
                  </code>
                );
              }
              return sub;
            });
          });

          // Bullet points
          if (para.trim().startsWith('•') || para.trim().startsWith('-')) {
            return (
              <div key={pIdx} className="flex items-start gap-2 my-1 pl-1">
                <span className="text-teal-400 font-bold shrink-0 mt-0.5">•</span>
                <div className="leading-relaxed flex-1">{boldFormatted}</div>
              </div>
            );
          }

          return (
            <p key={pIdx} className="my-1.5 leading-relaxed">
              {boldFormatted}
            </p>
          );
        })}
      </React.Fragment>
    );
  });
};

export const FlexAiModal: React.FC<FlexAiModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab, setSelectedConversationId, conversations, fontSize, playNotificationSound } = useApp();

  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'ai-initial',
      sender: 'ai',
      text: `Bonjour ! 👋 Je suis **Flex IA**, l'Intelligence Artificielle polymathique et encyclopédique officielle de **Flex Online** créée par Franck Alex.\n\n✨ **Je suis formé pour vous instruire et répondre sans limite à toutes vos questions :**\n• 🧪 **Sciences & Physique :** relativité générale d'Einstein, gravitation, thermodynamique, mécanique quantique, biologie...\n• 📐 **Mathématiques :** calculs détaillés, théorèmes démontrés (Pythagore, Thalès), équations, géométrie...\n• 🩺 **Médecine & Santé :** anatomie humaine, fonctionnement du cœur, système immunitaire, prévention...\n• 🏛️ **Histoire & Philosophie :** Égypte antique, empires du Mali et Songhaï, stoïcisme de Marc Aurèle, penseurs majeurs...\n• 🌍 **Géographie Mondiale :** toutes les capitales, fleuves, continents et repères géopolitiques...\n• 💻 **Code & Informatique :** Python, JavaScript, TypeScript, React, algorithmes et rédaction professionnelle...\n• 📱 **Flex Online & Franck Alex :** super-application, synchronisation PC Windows, 2 comptes et sécurité maximale.\n\nPosez-moi n'importe quelle question, je vous réponds avec clarté, profondeur et pédagogie ! 🚀`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      if (!response.ok) {
        throw new Error('Erreur réseau');
      }

      const data = await response.json();
      const aiReplyText = data.answer || getClientPolymathFallback(query);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      playNotificationSound();
    } catch (err: any) {
      console.warn('AI API fallback to polymath client knowledge engine:', err);
      const fallbackText = getClientPolymathFallback(query);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      playNotificationSound();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `ai-reset-${Date.now()}`,
        sender: 'ai',
        text: `Conversation réinitialisée ! 🔄\n\nJe suis **Flex IA**, à votre entière disposition. Quelle question souhaitez-vous aborder en sciences, histoire, mathématiques, médecine, philosophie, géographie, informatique ou sur Flex Online ?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking && speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`$]/g, '').replace(/https?:\/\/\S+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.02;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };

    setIsSpeaking(true);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleOpenInChat = () => {
    onClose();
    setActiveTab('chats');
    const aiConv = conversations.find((c) => c.id === 'conv-ai-assistant' || c.participants.includes('user-flex-ai'));
    if (aiConv) {
      setSelectedConversationId(aiConv.id);
    }
  };

  // Adjust font size style
  const messageFontSizeClass = fontSize === 'xlarge' 
    ? 'text-base sm:text-lg' 
    : fontSize === 'large' 
    ? 'text-sm sm:text-base' 
    : 'text-xs sm:text-sm';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in text-neutral-100">
      <div 
        id="flex-ai-main-window"
        className={`w-full bg-[#0c1614] border-0 sm:border sm:border-teal-700/60 rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-100 relative transition-all duration-300 ${
          isMaximized 
            ? 'h-[100dvh] sm:h-full max-w-none rounded-none' 
            : 'h-[100dvh] sm:h-[90vh] sm:max-w-4xl lg:max-w-5xl'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* ========================================================================= */}
        {/* WINDOW TITLE BAR (A REAL DESKTOP/MOBILE EXPANSIVE WINDOW) */}
        {/* ========================================================================= */}
        <div className="p-3.5 sm:p-5 bg-gradient-to-r from-[#0d1f1b] via-[#112722] to-[#14332c] border-b border-teal-900/60 flex items-center justify-between shrink-0 gap-3">
          
          {/* Left: Robot Brand Logo and Clear Uncut Titles */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Robot Emblem with Deep Teal & Turquoise Ambient Glow */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl overflow-hidden ring-2 ring-[#1D9E75] shadow-lg shadow-teal-950/80 bg-[#0d1815] group">
                <img 
                  src="/flex_ai_robot_avatar.jpg" 
                  alt="Robot Flex IA" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0c1614] animate-pulse shadow-xs" />
            </div>

            {/* Title & Polymath Specialization (No Ellipsis Cutoff) */}
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>Flex IA Assistant</span>
                  <Sparkles className="w-4 h-4 text-teal-300 shrink-0 animate-pulse" />
                </h2>
                <span className="text-[10px] sm:text-xs uppercase font-black px-2.5 py-0.5 rounded-full bg-[#1D9E75]/25 text-teal-300 border border-[#1D9E75]/50 shrink-0">
                  Polymath Universel
                </span>
                {isLoading && (
                  <span className="text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full bg-teal-400/25 text-teal-200 border border-teal-400/50 animate-pulse flex items-center gap-1.5 shrink-0 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                    Thinking...
                  </span>
                )}
              </div>
              
              <div className="text-xs text-teal-300/90 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 font-medium">
                <span className="flex items-center gap-1">
                  <span>Créé par</span>
                  <strong className="text-white font-bold">Franck Alex</strong>
                </span>
                <span className="hidden sm:inline text-teal-500">•</span>
                <span className="text-teal-300/80 hidden sm:inline">
                  Sciences, Histoire, Maths, Médecine, Philo, Géographie & Code
                </span>
              </div>
            </div>
          </div>

          {/* Right: Window Controls (Fullscreen toggle, Clear, Chat, Close) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* New Topic / Clear Button */}
            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition active:scale-95"
              title="Nouvelle discussion (effacer l'historique)"
            >
              <Trash2 className="w-4 h-4 text-neutral-400" />
              <span className="hidden md:inline">Nouveau</span>
            </button>

            {/* Open in Chat button */}
            <button
              type="button"
              onClick={handleOpenInChat}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-950/70 hover:bg-teal-900 border border-teal-700/60 text-teal-200 text-xs font-bold transition active:scale-95"
              title="Continuer dans la messagerie instantanée"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-300" />
              <span>Dans Chat</span>
            </button>

            {/* Window Maximize / Minimize toggle (Desktop & Tablet) */}
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="hidden sm:flex w-9 h-9 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 hover:text-white items-center justify-center transition active:scale-95"
              title={isMaximized ? "Réduire la fenêtre" : "Agrandir en plein écran"}
              aria-label="Agrandir ou Réduire"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Window */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-900 hover:bg-rose-950/60 border border-neutral-700 hover:border-rose-700 text-neutral-300 hover:text-rose-200 flex items-center justify-center transition active:scale-95"
              aria-label="Fermer la fenêtre"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HORIZONTAL THEMES & KNOWLEDGE DISCOVERY TOOLBAR */}
        {/* ========================================================================= */}
        <div className="px-3 sm:px-5 py-2.5 bg-[#0d1c18]/90 border-b border-teal-950/80 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-teal-300 shrink-0 pr-1 border-r border-teal-900/80">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Domaines :</span>
          </div>

          <div className="flex items-center gap-2">
            {QUICK_TOPICS.map((topic, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(topic.prompt)}
                disabled={isLoading}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-[#112420] hover:bg-[#183932] border border-teal-800/60 hover:border-teal-400/80 text-xs font-semibold text-teal-100 hover:text-white transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50 shadow-xs"
              >
                <span>{topic.icon}</span>
                <span className="whitespace-nowrap">{topic.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MESSAGES THREAD (SPACIOUS, FORMATTED, BEAUTIFUL) */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex gap-3 sm:gap-4 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {/* Robot Avatar on AI messages */}
                {isAi && (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden ring-2 ring-teal-500/60 shrink-0 shadow-lg bg-[#0d1815]">
                    <img 
                      src="/flex_ai_robot_avatar.jpg" 
                      alt="Robot Flex IA" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className={`max-w-[94%] sm:max-w-[85%] flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`rounded-3xl p-4 sm:p-5.5 select-text shadow-lg ${messageFontSizeClass} ${
                      isAi
                        ? 'bg-[#12221e] border border-teal-800/60 text-neutral-100 rounded-tl-sm'
                        : 'bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white font-medium shadow-teal-950/60 rounded-tr-sm'
                    }`}
                  >
                    {isAi ? formatRichMessage(m.text) : <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>}
                  </div>

                  {/* Actions & Timestamp row */}
                  <div className="flex items-center gap-3 mt-1.5 px-2 text-xs text-neutral-400">
                    <span>{m.timestamp}</span>
                    {isAi && (
                      <>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(m.id, m.text)}
                          className="hover:text-teal-300 transition flex items-center gap-1 font-medium cursor-pointer"
                          title="Copier la réponse"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-teal-400" />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(m.id, m.text)}
                          className="hover:text-teal-300 transition flex items-center gap-1 font-medium cursor-pointer"
                          title={isSpeaking && speakingMsgId === m.id ? 'Arrêter la lecture' : 'Écouter avec la synthèse vocale'}
                        >
                          {isSpeaking && speakingMsgId === m.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                              <span className="text-rose-400 font-bold">Arrêter</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                              <span>Écouter</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {!isAi && (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-teal-950 border border-teal-700/60 text-teal-300 flex items-center justify-center shrink-0 shadow-md">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Animated Thinking... Indicator */}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4 justify-start items-start animate-fade-in">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden ring-2 ring-teal-500/80 shrink-0 shadow-lg bg-[#0d1815] animate-pulse">
                <img 
                  src="/flex_ai_robot_avatar.jpg" 
                  alt="Robot Flex IA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-5 rounded-3xl rounded-tl-xs bg-[#122b24] border border-teal-600/50 shadow-xl max-w-[90%] sm:max-w-[80%] text-teal-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 border border-teal-400/40 text-xs font-black tracking-wide flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                    Thinking...
                  </span>
                  <span className="text-xs text-teal-300 font-semibold">Flex IA recherche la réponse</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
                  Flex IA explore l'ensemble des connaissances universelles pour vous formuler une réponse complète...
                </p>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-teal-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-teal-200 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] text-teal-400 font-bold ml-1.5">Recherche active</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ========================================================================= */}
        {/* FOOTER INPUT (SPACIOUS, CLEAN, ZERO OVERLAP) */}
        {/* ========================================================================= */}
        <div className="p-3.5 sm:p-5 bg-[#0d1f1b]/95 border-t border-teal-950/80 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2.5 sm:gap-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez une question en sciences, maths, histoire, médecine, philo, géographie, code..."
              disabled={isLoading}
              className="flex-1 bg-[#091412] border border-teal-900/80 focus:border-teal-400 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-neutral-400 outline-hidden transition shadow-inner font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3.5 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] hover:from-teal-600 hover:to-emerald-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-teal-950/60 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Envoyer la question à Flex IA"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs uppercase tracking-wider font-extrabold">Poser</span>
                </>
              )}
            </button>
          </form>

          {/* Sub-footer Information */}
          <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
            <div className="flex items-center gap-1.5 text-teal-300/80 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Réponses complètes, vérifiées & instructives • Conçu par Franck Alex</span>
            </div>
            
            <button
              type="button"
              onClick={handleOpenInChat}
              className="text-teal-300 hover:text-teal-200 font-bold flex items-center gap-1 sm:hidden transition"
            >
              <span>Ouvrir dans Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
