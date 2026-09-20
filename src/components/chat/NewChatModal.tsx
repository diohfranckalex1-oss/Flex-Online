import React, { useState } from 'react';
import { X, Users, UserCheck, MessageSquarePlus, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, createNewConversation, createNewGroup } = useApp();
  const [tab, setTab] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const contacts = users.filter((u) => u.id !== currentUser.id);
  const filteredContacts = contacts.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
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

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0) return;
    createNewGroup(groupName.trim(), selectedUsers);
    setGroupName('');
    setSelectedUsers([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div 
        id="new-chat-modal" 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-neutral-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-neutral-800">
              {tab === 'direct' ? 'Nouvelle discussion' : 'Nouveau groupe'}
            </h2>
          </div>
          <button
            id="btn-close-new-chat-modal"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-100 px-5 pt-3 gap-3">
          <button
            id="tab-btn-direct"
            onClick={() => setTab('direct')}
            className={`pb-2.5 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              tab === 'direct'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Message direct
          </button>
          <button
            id="tab-btn-group"
            onClick={() => setTab('group')}
            className={`pb-2.5 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              tab === 'group'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Créer un groupe
          </button>
        </div>

        <div className="p-5">
          {tab === 'direct' ? (
            <div>
              <input
                id="input-search-direct-contacts"
                type="text"
                placeholder="Rechercher un contact..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3.5 py-2 mb-3 text-sm bg-neutral-100 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
              <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 pr-1">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    id={`btn-select-contact-${contact.id}`}
                    onClick={() => handleStartDirectChat(contact.id)}
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-emerald-50/60 rounded-xl transition-colors text-left group"
                  >
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          contact.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-300'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-neutral-800 text-sm truncate">
                          {contact.name}
                        </span>
                        {contact.verified && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 truncate">{contact.bio || contact.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateGroup}>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nom du groupe
                  </label>
                  <input
                    id="input-group-name"
                    type="text"
                    required
                    placeholder="Ex: Amis & Vacances 🏖️"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-neutral-100 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Ajouter des participants ({selectedUsers.length} sélectionné{selectedUsers.length > 1 ? 's' : ''})
                  </label>
                  <div className="max-h-48 overflow-y-auto divide-y divide-neutral-100 border border-neutral-200 rounded-xl p-1 bg-neutral-50/50">
                    {contacts.map((contact) => {
                      const isSelected = selectedUsers.includes(contact.id);
                      return (
                        <div
                          key={contact.id}
                          id={`item-participant-${contact.id}`}
                          onClick={() => toggleUserSelection(contact.id)}
                          className="flex items-center justify-between p-2 hover:bg-white rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={contact.avatar}
                              alt={contact.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-xs font-semibold text-neutral-800">{contact.name}</p>
                              <p className="text-[11px] text-neutral-500">@{contact.username}</p>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  id="btn-confirm-create-group"
                  disabled={!groupName.trim() || selectedUsers.length === 0}
                  className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
                >
                  Créer le groupe
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
