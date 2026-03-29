'use client';

import React, { useState } from 'react';
import { Search, UserPlus, ChevronDown, Phone, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  phone: string;
  debtBalance: number;
  lastPurchase: string;
}

const mockClients: Client[] = [
  { id: 'client-001', name: 'Mariama Diallo', phone: '+221 77 432 1098', debtBalance: 0, lastPurchase: 'Auj. 14:32' },
  { id: 'client-002', name: 'Ousmane Sow', phone: '+221 76 891 2345', debtBalance: 28000, lastPurchase: 'Auj. 13:15' },
  { id: 'client-003', name: 'Fatou Camara', phone: '+221 70 234 5678', debtBalance: 0, lastPurchase: 'Hier' },
  { id: 'client-004', name: 'Ibrahima Konaté', phone: '+224 621 345 678', debtBalance: 580000, lastPurchase: 'Auj. 11:20' },
  { id: 'client-005', name: 'Awa Traoré', phone: '+221 78 567 8901', debtBalance: 15000, lastPurchase: 'Hier' },
  { id: 'client-006', name: 'Mamadou Ba', phone: '+221 77 123 4567', debtBalance: 115000, lastPurchase: 'Auj. 09:30' },
  { id: 'client-007', name: 'Aissatou Baldé', phone: '+224 622 456 789', debtBalance: 0, lastPurchase: '25 mars' },
  { id: 'client-008', name: 'Seydou Coulibaly', phone: '+223 66 789 0123', debtBalance: 170000, lastPurchase: 'Auj. 08:20' },
];

interface ClientSelectorProps {
  selectedClient: Client | null;
  onSelectClient: (client: Client | null) => void;
}

export default function ClientSelector({ selectedClient, onSelectClient }: ClientSelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  const filtered = mockClients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleSelect = (client: Client) => {
    onSelectClient(client);
    setIsOpen(false);
    setSearch('');
  };

  const handleCreateClient = () => {
    if (!newName.trim() || !newPhone.trim() || !consentGiven) return;
    // Backend integration: POST /api/vendor/clients
    // Body: { name: newName, phone: newPhone, consentGiven: true }
    const newClient: Client = {
      id: `client-new-${Date.now()}`,
      name: newName,
      phone: newPhone,
      debtBalance: 0,
      lastPurchase: 'Nouveau',
    };
    onSelectClient(newClient);
    setShowNewClientForm(false);
    setNewName('');
    setNewPhone('');
    setConsentGiven(false);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wider">
          1. Client
        </h3>
        {selectedClient && (
          <button
            onClick={() => onSelectClient(null)}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-danger transition-colors"
          >
            <X size={12} />
            Changer
          </button>
        )}
      </div>

      {/* Selected client display */}
      {selectedClient ? (
        <div className={`rounded-xl border-2 p-4 ${selectedClient.debtBalance > 0 ? 'border-amber-200 bg-amber-50/50' : 'border-emerald-200 bg-emerald-50/50'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[13px] font-bold text-primary-800">
                  {selectedClient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900">{selectedClient.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Phone size={11} className="text-gray-400" />
                  <p className="text-[12px] text-gray-500 font-mono">{selectedClient.phone}</p>
                </div>
              </div>
            </div>
            {selectedClient.debtBalance > 0 ? (
              <div className="text-right">
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">Créance</p>
                <p className="text-[14px] font-mono font-bold text-danger">
                  {(selectedClient.debtBalance / 100).toLocaleString('fr-FR')} F
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-success">
                <CheckCircle2 size={14} />
                <span className="text-[11px] font-semibold">À jour</span>
              </div>
            )}
          </div>
          {selectedClient.debtBalance > 0 && (
            <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-700 bg-amber-100 rounded-lg px-3 py-2">
              <AlertCircle size={12} />
              Ce client a une créance en cours. Vous pouvez encaisser un paiement ci-dessous.
            </div>
          )}
        </div>
      ) : (
        /* Client search dropdown */
        <div className="relative">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50/20 transition-all duration-150 text-left group"
          >
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-[13px] text-gray-400 flex-1">Rechercher un client...</span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-card-hover z-20 overflow-hidden animate-fade-in">
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nom ou numéro de téléphone..."
                    autoFocus
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </div>

              <div className="max-h-52 overflow-y-auto scrollbar-thin">
                {filtered.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-[12px] text-gray-500">Aucun client trouvé</p>
                  </div>
                )}
                {filtered.map((client) => (
                  <button
                    key={`client-opt-${client.id}`}
                    onClick={() => handleSelect(client)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-primary-800">
                        {client.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900">{client.name}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{client.phone}</p>
                    </div>
                    {client.debtBalance > 0 && (
                      <span className="text-[10px] font-mono font-bold text-danger bg-red-50 px-1.5 py-0.5 rounded">
                        -{(client.debtBalance / 100).toLocaleString('fr-FR')} F
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={() => { setShowNewClientForm(true); setIsOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary-50 text-primary-800 text-[12px] font-semibold hover:bg-primary-100 transition-colors"
                >
                  <UserPlus size={14} />
                  Nouveau client
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* New client form */}
      {showNewClientForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-gray-800">Nouveau client</p>
            <button onClick={() => setShowNewClientForm(false)} className="p-1 rounded hover:bg-gray-200 transition-colors">
              <X size={14} className="text-gray-500" />
            </button>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Nom complet</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Prénom Nom"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-900 outline-none focus:ring-2 focus:ring-primary-200 bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Téléphone</label>
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+221 77 000 0000"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-mono text-gray-900 outline-none focus:ring-2 focus:ring-primary-200 bg-white"
            />
          </div>
          {/* Consent — legally required */}
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-primary-800 cursor-pointer flex-shrink-0"
            />
            <span className="text-[11px] text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
              J'atteste avoir informé le client de l'utilisation de ses données personnelles et de la possibilité de recevoir des SMS de relance.{' '}
              <span className="text-danger font-semibold">*</span>
            </span>
          </label>
          <button
            onClick={handleCreateClient}
            disabled={!newName.trim() || !newPhone.trim() || !consentGiven}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary-800 text-white text-[12px] font-semibold hover:bg-primary-700 transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <UserPlus size={13} />
            Créer et sélectionner
          </button>
        </div>
      )}
    </div>
  );
}