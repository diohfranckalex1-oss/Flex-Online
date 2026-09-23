import React, { useState, useRef } from 'react';
import { 
  X, 
  Smartphone, 
  UploadCloud, 
  UserPlus, 
  Search, 
  Check, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  Trash2, 
  FileSpreadsheet, 
  ShieldCheck, 
  RefreshCw,
  Share2,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PhoneContact } from '../../types';

interface ContactsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactsSyncModal: React.FC<ContactsSyncModalProps> = ({ isOpen, onClose }) => {
  const { 
    phoneContacts, 
    importPhoneContacts, 
    addSinglePhoneContact, 
    removePhoneContact, 
    startChatWithPhoneContact,
    startCall,
    users
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'sync' | 'manual'>('all');
  const [search, setSearch] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Contact Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  if (!isOpen) return null;

  // Filter contacts by search query
  const filteredContacts = phoneContacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.tel.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  const registeredInFlex = filteredContacts.filter((c) => c.isRegisteredUser);
  const notRegistered = filteredContacts.filter((c) => !c.isRegisteredUser);

  // 1. Native Web Contact Picker API (Supported on Chrome Android, Edge, etc.)
  const handleNativeContactPicker = async () => {
    setIsSyncing(true);
    setStatusMessage(null);

    try {
      if ('contacts' in navigator && 'ContactsManager' in window) {
        // @ts-ignore
        const props = ['name', 'tel', 'email'];
        // @ts-ignore
        const opts = { multiple: true };
        // @ts-ignore
        const selectedContacts = await navigator.contacts.select(props, opts);

        if (selectedContacts && selectedContacts.length > 0) {
          const formatted = selectedContacts.map((c: any) => ({
            name: Array.isArray(c.name) ? c.name[0] : c.name || 'Contact sans nom',
            tel: Array.isArray(c.tel) ? c.tel[0] : c.tel || '',
            email: Array.isArray(c.email) ? c.email[0] : c.email || '',
          })).filter((c: any) => c.tel);

          const count = await importPhoneContacts(formatted);
          setStatusMessage(`🎉 ${count} contact(s) synchronisé(s) depuis le carnet d'adresses de votre téléphone !`);
          setActiveTab('all');
        }
      } else {
        // Fallback simulated device scan / VCF / CSV
        setStatusMessage("L'accès direct automatique requiert une autorisation mobile. Vous pouvez importer votre carnet de contacts via un fichier vCard (.vcf) ou ajouter vos numéros directement ci-dessous.");
      }
    } catch (err: any) {
      console.warn('Contact picker error:', err);
      setStatusMessage("Sélection annulée ou non prise en charge par ce navigateur. Utilisez l'import de fichier ou l'ajout manuel.");
    } finally {
      setIsSyncing(false);
    }
  };

  // 2. Import contacts via .VCF (vCard) or .CSV file exported from Android / iPhone
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSyncing(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsedContacts: { name: string; tel: string; email?: string }[] = [];

        if (file.name.endsWith('.vcf') || text.includes('BEGIN:VCARD')) {
          // Parse vCard format
          const vcards = text.split(/BEGIN:VCARD/i);
          for (const card of vcards) {
            if (!card.trim()) continue;
            let name = '';
            let tel = '';
            let email = '';

            const fnMatch = card.match(/FN:(.+)/i) || card.match(/N;.*:(.+)/i);
            if (fnMatch) name = fnMatch[1].trim().replace(/;/g, ' ');

            const telMatch = card.match(/TEL.*:(.+)/i);
            if (telMatch) tel = telMatch[1].trim();

            const emailMatch = card.match(/EMAIL.*:(.+)/i);
            if (emailMatch) email = emailMatch[1].trim();

            if (tel) {
              parsedContacts.push({
                name: name || tel,
                tel,
                email: email || undefined,
              });
            }
          }
        } else {
          // Parse CSV format (Name, Phone, Email)
          const lines = text.split('\n');
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const parts = line.split(/[;,]/);
            if (parts.length >= 2) {
              const name = parts[0].replace(/"/g, '').trim();
              const tel = parts[1].replace(/"/g, '').trim();
              const email = parts[2]?.replace(/"/g, '').trim();
              if (tel) {
                parsedContacts.push({ name: name || tel, tel, email });
              }
            }
          }
        }

        if (parsedContacts.length > 0) {
          const count = await importPhoneContacts(parsedContacts);
          setStatusMessage(`✅ ${count} nouveau(x) contact(s) extrait(s) du fichier et relié(s) à votre compte Flex Online !`);
          setActiveTab('all');
        } else {
          setStatusMessage("Aucun numéro de téléphone détecté dans ce fichier. Vérifiez le format .vcf ou .csv.");
        }
      } catch (err: any) {
        setStatusMessage("Erreur lors de la lecture du fichier : " + err.message);
      } finally {
        setIsSyncing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  // 3. Quick add single phone number
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    addSinglePhoneContact({
      name: newName.trim(),
      tel: newPhone.trim(),
      email: newEmail.trim() || undefined,
    });

    setStatusMessage(`Numéro de ${newName} relié à Flex Online avec succès !`);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setActiveTab('all');
  };

  // Start chat helper
  const handleStartChat = (contact: PhoneContact) => {
    startChatWithPhoneContact(contact);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 animate-fade-in text-neutral-100">
      <div 
        id="contacts-sync-modal" 
        className="bg-neutral-900 rounded-3xl max-w-lg w-full shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800/60 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-1.5">
                <span>Contacts de mon téléphone</span>
                <span className="text-[10px] bg-cyan-950/80 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-800/60">
                  {phoneContacts.length} reliés
                </span>
              </h2>
              <p className="text-xs text-neutral-400">Trouvez et échangez instantanément avec vos proches</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 p-1 shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'all'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Tous mes contacts ({phoneContacts.length})
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'sync'
                ? 'bg-neutral-800 text-cyan-300 shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Synchroniser / Importer
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'manual'
                ? 'bg-neutral-800 text-indigo-300 shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            + Ajouter un numéro
          </button>
        </div>

        {/* Status banner */}
        {statusMessage && (
          <div className="p-3 mx-4 mt-3 bg-cyan-950/50 border border-cyan-800/60 rounded-2xl text-xs text-cyan-200 flex items-center justify-between gap-2 shrink-0">
            <span>{statusMessage}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-cyan-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: ALL CONTACTS LIST */}
          {activeTab === 'all' && (
            <div className="space-y-4">
              {/* Search box */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou numéro..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              {/* Quick sync shortcut banner */}
              <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-2xl border border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span className="text-xs text-neutral-300 font-semibold">Carnet de contacts du téléphone</span>
                </div>
                <button
                  onClick={() => setActiveTab('sync')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  Gérer la synchronisation
                </button>
              </div>

              {/* Contacts categorized: Flex Users vs Invitable */}
              <div className="space-y-4">
                {/* On Flex Online */}
                {registeredInFlex.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-1 mb-2">
                      <span className="text-[11px] font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Membres sur Flex Online ({registeredInFlex.length})</span>
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {registeredInFlex.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 hover:border-cyan-500/40 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative">
                              {contact.avatar ? (
                                <img
                                  src={contact.avatar}
                                  alt={contact.name}
                                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-500/50"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-300 flex items-center justify-center font-bold text-sm border border-cyan-800">
                                  {contact.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-neutral-900" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                                <span>{contact.name}</span>
                                <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded font-bold border border-cyan-800/40">
                                  Inscrit
                                </span>
                              </p>
                              <p className="text-[11px] text-cyan-300/80 font-mono truncate">{contact.tel}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStartChat(contact)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                              title="Discuter maintenant"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Échanger</span>
                            </button>
                            <button
                              onClick={() => removePhoneContact(contact.id)}
                              className="p-1.5 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                              title="Retirer de mes contacts"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Not yet registered / Phone only */}
                <div>
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">
                      Contacts du téléphone ({notRegistered.length})
                    </span>
                  </div>

                  {notRegistered.length === 0 ? (
                    <div className="text-center py-6 text-neutral-500 text-xs bg-neutral-950/40 rounded-2xl border border-neutral-800/50">
                      Tous vos contacts sont connectés ou aucun contact trouvé.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {notRegistered.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/40 border border-neutral-800/60 hover:bg-neutral-800/30 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold text-sm border border-neutral-700">
                              {contact.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-neutral-200 truncate">{contact.name}</p>
                              <p className="text-[11px] text-neutral-400 font-mono truncate">{contact.tel}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStartChat(contact)}
                              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 text-xs font-semibold flex items-center gap-1"
                              title="Ouvrir une discussion avec ce numéro"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Écrire</span>
                            </button>
                            <button
                              onClick={() => removePhoneContact(contact.id)}
                              className="p-1.5 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                              title="Retirer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYNC / IMPORT METHODS */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-cyan-950/40 via-neutral-950 to-neutral-900 border border-cyan-800/40 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-2 mb-2 text-cyan-300 font-bold">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Confidentialité & Sécurité de vos contacts</span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  Vos numéros restent sous votre contrôle et sont synchronisés localement dans votre espace Flex Online pour faire correspondre automatiquement vos amis déjà inscrits.
                </p>
              </div>

              {/* Method A: Mobile Native Contact Picker */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-300 flex items-center justify-center font-bold border border-indigo-800/60 shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">1. Carnet d'adresses Mobile Direct</h4>
                    <p className="text-[11px] text-neutral-400">Ouvre le sélecteur natif de contacts de votre smartphone</p>
                  </div>
                </div>

                <button
                  onClick={handleNativeContactPicker}
                  disabled={isSyncing}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Synchroniser depuis mon téléphone</span>
                </button>
              </div>

              {/* Method B: Import via file (.vcf exported from Contacts or CSV) */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-300 flex items-center justify-center font-bold border border-cyan-800/60 shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">2. Fichier de contacts vCard (.vcf) ou CSV</h4>
                    <p className="text-[11px] text-neutral-400">Exportez depuis l'application « Contacts » de votre Android/iPhone et importez ici</p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".vcf,text/vcard,text/x-vcard,.csv,text/csv"
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSyncing}
                  className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-neutral-700"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Choisir un fichier .vcf ou .csv</span>
                </button>
              </div>

              {/* Tip info */}
              <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                <p className="font-bold text-neutral-300">💡 Comment exporter vos contacts sur votre smartphone ?</p>
                <p>• Sur Android : Ouvrez <em>Contacts</em> &gt; <em>Paramètres</em> &gt; <em>Exporter vers un fichier .vcf</em>.</p>
                <p>• Sur iPhone : Ouvrez <em>Contacts</em> &gt; Sélectionnez tous les contacts &gt; <em>Exporter vCard</em>.</p>
              </div>
            </div>
          )}

          {/* TAB 3: MANUAL ADD */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualAdd} className="space-y-3.5">
              <div className="p-3 bg-neutral-950/60 rounded-2xl border border-neutral-800 text-xs text-neutral-300">
                Liez un nouveau numéro directement à votre Flex Online pour lui envoyer un message instantané ou l'appeler.
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Nom du contact *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Thomas Dubois, Maman, Collègue..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Numéro de téléphone portable *
                </label>
                <input
                  type="tel"
                  placeholder="Ex: +33 6 12 34 56 78"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Adresse e-mail (facultatif)
                </label>
                <input
                  type="email"
                  placeholder="Ex: contact@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={!newName.trim() || !newPhone.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-50 text-white text-xs font-black transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Enregistrer ce contact dans Flex Online</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
