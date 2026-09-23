import React from 'react';
import { 
  Phone, 
  Video, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  Plus, 
  Link as LinkIcon,
  Sparkles,
  ShieldCheck,
  Radio,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CallsView: React.FC = () => {
  const { 
    callLogs, 
    startCall, 
    users, 
    currentUser, 
    phoneContacts, 
    setIsContactsSyncModalOpen,
    startChatWithPhoneContact 
  } = useApp();

  const otherContacts = users.filter((u) => u.id !== currentUser.id);

  return (
    <div id="calls-view-panel" className="flex-1 overflow-y-auto bg-neutral-950 max-w-2xl mx-auto w-full p-4 sm:p-6 border-x border-neutral-800/80 min-h-full text-neutral-100">
      {/* Create call link banner */}
      <div className="flex items-center gap-3 p-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl mb-4 shadow-xl">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
          <LinkIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span>Créer un lien d’appel sécurisé</span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800/50">
              HD Voice
            </span>
          </h3>
          <p className="text-xs text-neutral-400">Partagez une invitation audio ou vidéo instantanée sans inscription requise</p>
        </div>
      </div>

      {/* Phone contacts quick call integration */}
      <div className="flex items-center justify-between p-3.5 bg-cyan-950/30 border border-cyan-800/40 rounded-2xl mb-6 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800/60 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Contacts de votre téléphone</span>
              <span className="text-[9px] bg-cyan-950 text-cyan-300 font-bold px-1.5 py-0.2 rounded border border-cyan-800/60">
                {phoneContacts.length} reliés
              </span>
            </h4>
            <p className="text-[11px] text-neutral-400 truncate">Appeler ou lancer une discussion directe avec vos numéros</p>
          </div>
        </div>
        <button
          onClick={() => setIsContactsSyncModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-all shrink-0 shadow-xs"
        >
          Gérer
        </button>
      </div>

      {/* Quick contacts for calls */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>Appeler un contact direct</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {otherContacts.map((contact) => (
            <div
              key={contact.id}
              className="p-3.5 bg-neutral-900 rounded-2xl border border-neutral-800/80 flex flex-col items-center text-center hover:border-indigo-500/50 transition-colors shadow-md"
            >
              <div className="relative mb-2">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-neutral-700"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-neutral-900 ${
                    contact.status === 'online' ? 'bg-cyan-400' : 'bg-neutral-600'
                  }`}
                />
              </div>
              <p className="text-xs font-bold text-white truncate w-full mb-2.5">
                {contact.name.split(' ')[0]}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startCall(contact, 'audio')}
                  className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-cyan-500 hover:text-neutral-950 text-cyan-400 flex items-center justify-center transition-all shadow-xs"
                  title="Appel audio"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => startCall(contact, 'video')}
                  className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-indigo-600 hover:text-white text-indigo-400 flex items-center justify-center transition-all shadow-xs"
                  title="Appel vidéo"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call History / Logs */}
      <div>
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Historique des appels récents
        </h3>
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 divide-y divide-neutral-800/60 overflow-hidden shadow-xl">
          {callLogs.length === 0 ? (
            <p className="text-xs text-neutral-500 p-6 text-center">Aucun appel récent</p>
          ) : (
            callLogs.map((log) => {
              const contact = log.contact;
              const isOutgoing = log.direction === 'outgoing';
              const isMissed = log.direction === 'missed';

              return (
                <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-neutral-800/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={contact?.avatar}
                      alt={contact?.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-neutral-700"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{contact?.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                        {isOutgoing ? (
                          <PhoneOutgoing className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        ) : isMissed ? (
                          <PhoneMissed className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        ) : (
                          <PhoneIncoming className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        )}
                        <span className="text-[11px]">
                          {log.timestamp} {log.duration ? `• ${log.duration}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {contact && (
                    <button
                      onClick={() => startCall(contact, log.type)}
                      className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-400 flex items-center justify-center transition-colors"
                    >
                      {log.type === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
