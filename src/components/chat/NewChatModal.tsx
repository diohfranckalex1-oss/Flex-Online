import React, { useState } from 'react';
import { X, Users, UserCheck, MessageSquarePlus, Check, Sparkles, Smartphone, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
  const { 
    users, 
    currentUser, 
    createNewConversation, 
    createNewGroup,
    phoneContacts,
    startChatWithPhoneContact,
    setIsContactsSyncModalOpen
  } = useApp();
  const [tab, setTab] = useState<'direct' | 'group' | 'phone'>('direct');
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const contacts = users.filter((u) => u.id !== currentUser.id);
  const filteredContacts = contacts.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.phone && u.phone.includes(search))
  );

  const filteredPhoneContacts = phoneContacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.tel.includes(search)
  );

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleStartDirectChat = (userId: string) => {
    createNewConversation(userId);
    onClose();
  };

  const handleStartPhoneChat = (contact: typeof phoneContacts[0]) => {
    startChatWithPhoneContact(contact);
    onClose();
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0) return;
    createNewGroup(groupName.trim(), selectedUsers);
    setGroupName('');
    setSelectedUsers([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in text-neutral-100">
      <div 
        id="new-chat-modal" 
        className="bg-neutral-900 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-neutral-800"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-950 text-cyan-400 flex items-center justify-center font-bold text-sm border border-indigo-800/60">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-white">
              {tab === 'direct' ? 'Nouvelle discussion' : tab === 'phone' ? 'Contacts de mon téléphone' : 'Nouveau salon de groupe'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 p-1">
          <button
            onClick={() => setTab('direct')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'direct'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Membres ({contacts.length})
          </button>
          <button
            onClick={() => setTab('phone')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'phone'
                ? 'bg-neutral-800 text-cyan-300 shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Mon Téléphone ({phoneContacts.length})
          </button>
          <button
            onClick={() => setTab('group')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'group'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Groupe
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Group Name input if in group tab */}
          {tab === 'group' && (
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Nom du groupe Flex
              </label>
              <input
                type="text"
                placeholder="Ex: Le Cercle, Famille, Studio..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          )}

          {/* Search Contacts */}
          <div>
            <input
              type="text"
              placeholder={tab === 'phone' ? "Chercher par nom ou numéro..." : "Chercher un ami par nom ou pseudo..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* TAB: PHONE CONTACTS */}
          {tab === 'phone' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-neutral-950/70 border border-neutral-800 rounded-xl text-xs">
                <span className="text-neutral-300">Synchroniser ou ajouter des numéros</span>
                <button
                  onClick={() => {
                    onClose();
                    setIsContactsSyncModalOpen(true);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Synchroniser</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {filteredPhoneContacts.length === 0 ? (
                  <div className="text-center py-6 text-neutral-500 text-xs bg-neutral-950/40 rounded-2xl border border-neutral-800/50">
                    Aucun contact téléphonique trouvé avec cette recherche.
                  </div>
                ) : (
                  filteredPhoneContacts.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleStartPhoneChat(c)}
                      className="flex items-center justify-between p-2.5 rounded-2xl cursor-pointer hover:bg-neutral-800/60 border border-transparent hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {c.avatar ? (
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-500/40"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-300 flex items-center justify-center font-bold text-sm border border-cyan-800/60">
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <span>{c.name}</span>
                            {c.isRegisteredUser && (
                              <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded font-bold border border-cyan-800/40">
                                Inscrit
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-neutral-400 font-mono truncate">{c.tel}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-neutral-800 text-cyan-400 text-xs font-semibold hover:bg-neutral-700">
                        Échanger
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: DIRECT / GROUP APP MEMBERS */}
          {tab !== 'phone' && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider px-1">
                {tab === 'direct' ? 'Sélectionnez un contact' : `Sélectionnez les membres (${selectedUsers.length})`}
              </p>

              {filteredContacts.map((contact) => {
                const isSelected = selectedUsers.includes(contact.id);

                return (
                  <div
                    key={contact.id}
                    onClick={() => {
                      if (tab === 'direct') {
                        handleStartDirectChat(contact.id);
                      } else {
                        toggleUserSelection(contact.id);
                      }
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-950/80 border border-indigo-800/80'
                        : 'hover:bg-neutral-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-neutral-700"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{contact.name}</p>
                        <p className="text-[10px] text-neutral-400 truncate">
                          @{contact.username} {contact.phone ? `• ${contact.phone}` : ''}
                        </p>
                      </div>
                    </div>

                    {tab === 'group' && (
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-cyan-400 border-cyan-400 text-neutral-950'
                            : 'border-neutral-700 bg-neutral-950'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Create Group CTA */}
          {tab === 'group' && (
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedUsers.length === 0}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Créer le groupe ({selectedUsers.length} membres)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
