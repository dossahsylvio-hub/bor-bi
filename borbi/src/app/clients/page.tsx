'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Users, Plus, Search, Phone, Mail, MessageSquare, History, AlertCircle, CheckCircle, ChevronRight, Trash2 } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  debtBalance: number;
  preferredLanguage: string;
  consentGiven: boolean;
  createdAt: string;
  lastTransaction?: string;
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Fatou Diallo', phone: '+221771234567', email: 'fatou@email.com', debtBalance: 45000, preferredLanguage: 'fr', consentGiven: true, createdAt: '2026-01-15', lastTransaction: '2026-03-28' },
  { id: '2', name: 'Moussa Ndiaye', phone: '+221779876543', debtBalance: 0, preferredLanguage: 'wo', consentGiven: true, createdAt: '2026-02-01', lastTransaction: '2026-03-25' },
  { id: '3', name: 'Aminata Sow', phone: '+221785432109', debtBalance: 120000, preferredLanguage: 'fr', consentGiven: true, createdAt: '2026-01-20', lastTransaction: '2026-03-20' },
  { id: '4', name: 'Ibrahima Ba', phone: '+221776543210', debtBalance: 75000, preferredLanguage: 'wo', consentGiven: true, createdAt: '2026-02-10', lastTransaction: '2026-03-15' },
  { id: '5', name: 'Mariama Diop', phone: '+221770123456', email: 'mariama@gmail.com', debtBalance: 0, preferredLanguage: 'fr', consentGiven: true, createdAt: '2026-03-01', lastTransaction: '2026-03-28' },
  { id: '6', name: 'Ousmane Sarr', phone: '+221773456789', debtBalance: 200000, preferredLanguage: 'ar', consentGiven: true, createdAt: '2025-12-01', lastTransaction: '2026-03-10' },
];

const LANG_LABELS: Record<string, string> = { fr: 'Français', wo: 'Wolof', ar: 'Arabe' };

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '', preferredLanguage: 'fr', consentGiven: false });
  const [addError, setAddError] = useState('');

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const totalDebt = clients.reduce((s, c) => s + c.debtBalance, 0);
  const debtors = clients.filter(c => c.debtBalance > 0).length;

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.consentGiven) {
      setAddError('Le consentement est obligatoire');
      return;
    }
    if (!newClient.phone && !newClient.email) {
      setAddError('Téléphone ou email requis');
      return;
    }
    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      phone: newClient.phone,
      email: newClient.email || undefined,
      debtBalance: 0,
      preferredLanguage: newClient.preferredLanguage,
      consentGiven: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients(prev => [client, ...prev]);
    setShowAddModal(false);
    setNewClient({ name: '', phone: '', email: '', preferredLanguage: 'fr', consentGiven: false });
    setAddError('');
  };

  return (
    <AppLayout pageTitle="Clients" pageSubtitle="Gestion de la clientèle">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900">Clients</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {clients.length} clients · <span className="text-danger font-semibold">{debtors} débiteurs</span>
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-800 text-white text-[13px] font-semibold hover:bg-primary-700 transition-all active:scale-95 shadow-sm"
        >
          <Plus size={15} />
          Ajouter un client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Total clients</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{clients.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Débiteurs</p>
          <p className="text-2xl font-bold text-danger mt-1">{debtors}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4 md:col-span-2">
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Créances totales</p>
          <p className="text-2xl font-bold text-danger mt-1 font-mono">{(totalDebt / 100).toLocaleString('fr-FR')} FCFA</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou téléphone..."
          className="w-full max-w-sm pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200 bg-white"
        />
      </div>

      {/* Client list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedClient(client)}
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[13px] font-bold text-primary-800">
                  {client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-gray-900 truncate">{client.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full flex-shrink-0">
                    {LANG_LABELS[client.preferredLanguage]}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[12px] text-gray-500 flex items-center gap-1">
                    <Phone size={11} />
                    {client.phone}
                  </span>
                  {client.email && (
                    <span className="text-[12px] text-gray-400 flex items-center gap-1">
                      <Mail size={11} />
                      {client.email}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                {client.debtBalance > 0 ? (
                  <div>
                    <p className="text-[13px] font-bold text-danger font-mono">
                      -{(client.debtBalance / 100).toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="text-[10px] text-gray-400">Doit</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-success">
                    <CheckCircle size={14} />
                    <span className="text-[12px] font-medium">À jour</span>
                  </div>
                )}
              </div>
              <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Users size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-[13px] text-gray-400">Aucun client trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Client detail panel */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-[15px] font-bold text-primary-800">
                      {selectedClient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedClient.name}</h3>
                    <p className="text-[12px] text-gray-500">{selectedClient.phone}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[13px] text-gray-500">Solde dû</span>
                  <span className={`text-[14px] font-bold font-mono ${selectedClient.debtBalance > 0 ? 'text-danger' : 'text-success'}`}>
                    {selectedClient.debtBalance > 0 ? `-${(selectedClient.debtBalance / 100).toLocaleString('fr-FR')} FCFA` : 'Aucune créance'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[13px] text-gray-500">Langue préférée</span>
                  <span className="text-[13px] font-medium text-gray-700">{LANG_LABELS[selectedClient.preferredLanguage]}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[13px] text-gray-500">Consentement</span>
                  <span className={`text-[12px] font-medium flex items-center gap-1 ${selectedClient.consentGiven ? 'text-success' : 'text-danger'}`}>
                    {selectedClient.consentGiven ? <><CheckCircle size={13} /> Donné</> : <><AlertCircle size={13} /> Non donné</>}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[13px] text-gray-500">Dernière transaction</span>
                  <span className="text-[13px] text-gray-700">{selectedClient.lastTransaction || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button className="flex flex-col items-center gap-1.5 p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                  <MessageSquare size={18} className="text-primary-700" />
                  <span className="text-[11px] font-medium text-primary-700">SMS</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <History size={18} className="text-gray-600" />
                  <span className="text-[11px] font-medium text-gray-600">Historique</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                  <Trash2 size={18} className="text-danger" />
                  <span className="text-[11px] font-medium text-danger">Oublier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add client modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-5">Ajouter un client</h3>
              {addError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-danger flex items-center gap-2">
                  <AlertCircle size={14} />
                  {addError}
                </div>
              )}
              <form onSubmit={handleAddClient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet *</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient(p => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="Fatou Diallo"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+221 77 000 00 00"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (optionnel)</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient(p => ({ ...p, email: e.target.value }))}
                    placeholder="client@email.com"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Langue préférée</label>
                  <select
                    value={newClient.preferredLanguage}
                    onChange={(e) => setNewClient(p => ({ ...p, preferredLanguage: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-200 bg-white"
                  >
                    <option value="fr">Français</option>
                    <option value="wo">Wolof</option>
                    <option value="ar">Arabe</option>
                  </select>
                </div>
                {/* Consent checkbox - MANDATORY */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newClient.consentGiven}
                      onChange={(e) => setNewClient(p => ({ ...p, consentGiven: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 rounded border-amber-300 text-primary-600 focus:ring-primary-200"
                    />
                    <span className="text-[12px] text-amber-800 leading-relaxed font-medium">
                      J&apos;atteste avoir informé le client de l&apos;utilisation de ses données personnelles et de la possibilité de recevoir des SMS de relance (obligatoire)
                    </span>
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); setAddError(''); }}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-primary-800 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors active:scale-95"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
