import React from 'react';
import { 
  Phone, 
  Video, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  Plus, 
  Link as LinkIcon 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CallsView: React.FC = () => {
  const { callLogs, startCall, users, currentUser } = useApp();

  const otherContacts = users.filter((u) => u.id !== currentUser.id);

  return (
    <div id="calls-view-panel" className="flex-1 overflow-y-auto bg-white max-w-2xl mx-auto w-full p-4 sm:p-6 border-x border-neutral-200 min-h-full">
      {/* Create call link banner (WhatsApp style) */}
      <div className="flex items-center gap-3 p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl mb-6 shadow-2xs">
        <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <LinkIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-emerald-950">Créer un lien d’appel</h3>
          <p className="text-xs text-emerald-700">Partagez un lien pour votre appel vidéo ou vocal Flex Online</p>
        </div>
      </div>

      {/* Quick contacts for calls */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Appeler un contact
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {otherContacts.map((contact) => (
            <div
              key={contact.id}
              className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/70 flex flex-col items-center text-center hover:bg-neutral-100 transition-colors"
            >
              <div className="relative mb-2">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-300"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    contact.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-300'
                  }`}
                />
              </div>
              <p className="text-xs font-bold text-neutral-800 truncate w-full mb-2">
                {contact.name.split(' ')[0]}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startCall(contact, 'audio')}
                  className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-200 transition-colors"
                  title="Appel audio"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => startCall(contact, 'video')}
                  className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-200 transition-colors"
                  title="Appel vidéo"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent call logs */}
      <div>
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Historique récent
        </h3>
        <div className="divide-y divide-neutral-100">
          {callLogs.map((log) => (
            <div
              key={log.id}
              className="py-3 flex items-center justify-between hover:bg-neutral-50 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={log.contact.avatar}
                  alt={log.contact.name}
                  className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">{log.contact.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    {log.direction === 'incoming' && (
                      <PhoneIncoming className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    {log.direction === 'outgoing' && (
                      <PhoneOutgoing className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    {log.direction === 'missed' && (
                      <PhoneMissed className="w-3.5 h-3.5 text-red-500" />
                    )}
                    <span className={log.direction === 'missed' ? 'text-red-500 font-medium' : ''}>
                      {log.timestamp}
                    </span>
                    {log.duration && <span>• {log.duration}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => startCall(log.contact, log.type)}
                  className="w-9 h-9 rounded-full hover:bg-emerald-50 text-emerald-700 flex items-center justify-center transition-colors"
                  title={`Rappeler (${log.type})`}
                >
                  {log.type === 'video' ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <Phone className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
