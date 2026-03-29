'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, DollarSign, BarChart2, Star, FileText, ShoppingBag, LogOut, Shield, TrendingUp, MessageSquare, Download, CheckCircle, XCircle, Eye, EyeOff, RefreshCw, AlertTriangle, Lock } from 'lucide-react';

type AdminTab = 'dashboard' | 'users' | 'commissions' | 'data' | 'sponsoring' | 'logs' | 'vitrine' | 'messages';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  businessName: string;
  location: string;
  createdAt: string;
  active: boolean;
}

interface Commission {
  id: string;
  type: string;
  amountCents: number;
  status: string;
  createdAt: string;
  reference: string;
}

interface SponsoredItem {
  id: string;
  productName: string;
  brand: string;
  category: string;
  active: boolean;
  homepageOrder: number | null;
}

interface AuditEntry {
  id: string;
  userEmail: string;
  action: string;
  details: string;
  ip: string;
  createdAt: string;
}

interface ModMessage {
  id: string;
  senderEmail: string;
  receiverEmail: string;
  content: string;
  createdAt: string;
  flagged: boolean;
}

const MOCK_USERS: AdminUser[] = [
  { id: '1', email: 'vendeur@bor-bi.com', role: 'VENDOR', businessName: 'Boutique Amadou', location: 'Dakar, Sénégal', createdAt: '2026-01-15', active: true },
  { id: '2', email: 'grossiste@bor-bi.com', role: 'WHOLESALER', businessName: 'Grossiste Diallo & Fils', location: 'Dakar, Sénégal', createdAt: '2026-01-20', active: true },
  { id: '3', email: 'demo@borbi.sn', role: 'VENDOR', businessName: 'Boutique Demo', location: 'Dakar, Sénégal', createdAt: '2026-02-01', active: true },
  { id: '4', email: 'import@maroc.ma', role: 'WHOLESALER', businessName: 'Import-Export Maroc', location: 'Casablanca, Maroc', createdAt: '2026-02-15', active: true },
  { id: '5', email: 'vendor2@borbi.sn', role: 'VENDOR', businessName: 'Épicerie Fatou', location: 'Thiès, Sénégal', createdAt: '2026-03-01', active: false },
];

const MOCK_COMMISSIONS: Commission[] = [
  { id: '1', type: 'SALE', amountCents: 25000, status: 'PENDING', createdAt: '2026-03-28', reference: 'TXN-001' },
  { id: '2', type: 'ORDER', amountCents: 90000, status: 'PENDING', createdAt: '2026-03-28', reference: 'ORD-001' },
  { id: '3', type: 'SALE', amountCents: 15000, status: 'COLLECTED', createdAt: '2026-03-25', reference: 'TXN-002' },
  { id: '4', type: 'ORDER', amountCents: 25000, status: 'COLLECTED', createdAt: '2026-03-20', reference: 'ORD-002' },
  { id: '5', type: 'SALE', amountCents: 8000, status: 'PENDING', createdAt: '2026-03-27', reference: 'TXN-003' },
];

const MOCK_SPONSORED: SponsoredItem[] = [
  { id: '1', productName: 'Riz brisé 25kg', brand: 'Marque Sénégal', category: 'epicerie', active: true, homepageOrder: 1 },
  { id: '2', productName: 'Huile végétale 5L', brand: 'Jumbo', category: 'epicerie', active: true, homepageOrder: 2 },
  { id: '3', productName: 'Poulet PAC entier', brand: 'Avicole Sénégal', category: 'fraisProteines', active: true, homepageOrder: 3 },
  { id: '4', productName: 'Coca-Cola 1.5L', brand: 'Coca-Cola', category: 'boissons', active: false, homepageOrder: null },
  { id: '5', productName: 'Chemise homme', brand: 'Mode Dakar', category: 'pretAPorter', active: true, homepageOrder: 4 },
  { id: '6', productName: 'Tissu wax africain', brand: 'Wax Premium', category: 'vetements', active: true, homepageOrder: 5 },
];

const MOCK_LOGS: AuditEntry[] = [
  { id: '1', userEmail: 'vendeur@bor-bi.com', action: 'LOGIN', details: 'Connexion réussie', ip: '41.82.100.1', createdAt: '2026-03-28T14:30:00' },
  { id: '2', userEmail: 'vendeur@bor-bi.com', action: 'CREATE_TRANSACTION', details: 'Vente #TXN-001 créée — 5000 FCFA', ip: '41.82.100.1', createdAt: '2026-03-28T14:35:00' },
  { id: '3', userEmail: 'grossiste@bor-bi.com', action: 'LOGIN', details: 'Connexion réussie', ip: '41.82.200.5', createdAt: '2026-03-28T10:00:00' },
  { id: '4', userEmail: 'grossiste@bor-bi.com', action: 'CONFIRM_ORDER', details: 'Commande ORD-001 confirmée', ip: '41.82.200.5', createdAt: '2026-03-28T10:15:00' },
  { id: '5', userEmail: 'pauledoux@protonmail.com', action: 'ADMIN_LOGIN', details: 'Connexion admin', ip: '41.82.50.1', createdAt: '2026-03-28T09:00:00' },
  { id: '6', userEmail: 'vendor2@borbi.sn', action: 'REGISTER', details: 'Nouveau compte créé', ip: '41.82.150.3', createdAt: '2026-03-01T08:00:00' },
];

const MOCK_MESSAGES: ModMessage[] = [
  { id: '1', senderEmail: 'vendeur@bor-bi.com', receiverEmail: 'grossiste@bor-bi.com', content: 'Bonjour, quand sera livrée ma commande ?', createdAt: '2026-03-28T10:00:00', flagged: false },
  { id: '2', senderEmail: 'grossiste@bor-bi.com', receiverEmail: 'vendeur@bor-bi.com', content: 'Livraison demain matin.', createdAt: '2026-03-28T10:05:00', flagged: false },
  { id: '3', senderEmail: 'import@maroc.ma', receiverEmail: 'demo@borbi.sn', content: 'Nouveaux produits disponibles', createdAt: '2026-03-27T09:00:00', flagged: false },
];

const TAB_CONFIG = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'users', label: 'Utilisateurs', icon: <Users size={16} /> },
  { id: 'commissions', label: 'Commissions', icon: <DollarSign size={16} /> },
  { id: 'data', label: 'Data Insights', icon: <BarChart2 size={16} /> },
  { id: 'sponsoring', label: 'Sponsoring', icon: <Star size={16} /> },
  { id: 'vitrine', label: 'Vitrine', icon: <ShoppingBag size={16} /> },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={16} /> },
  { id: 'logs', label: 'Journaux', icon: <FileText size={16} /> },
];

// Admin access gate component
function AdminGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated as admin
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/login', { method: 'GET' }).catch(() => null);
        // Check cookie-based session
        const sessionStr = document.cookie.split(';').find(c => c.trim().startsWith('borbi_session='));
        if (sessionStr) {
          const sessionVal = decodeURIComponent(sessionStr.split('=')[1] || '');
          const session = JSON.parse(sessionVal);
          if (session?.role === 'ADMIN') {
            setAuthenticated(true);
          }
        }
      } catch {
        // Not authenticated
      } finally {
        setChecking(false);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== 'pauledoux@protonmail.com') {
      setError('Accès réservé à l\'administrateur Bor-Bi.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.role !== 'ADMIN') {
        throw new Error(data.error || 'Accès refusé');
      }
      setAuthenticated(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Accès refusé');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-primary-800" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Portail Admin</h1>
              <p className="text-[12px] text-gray-500">Bor-Bi · TransTech Solution</p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <Lock size={14} className="text-amber-600 flex-shrink-0" />
            <p className="text-[12px] text-amber-700">Accès restreint — Administrateur uniquement</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Email admin</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="pauledoux@protonmail.com"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-800 text-white rounded-xl font-semibold text-[13px] hover:bg-primary-700 transition-all disabled:opacity-60"
            >
              {loading ? 'Vérification...' : 'Accéder au portail'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-[11px] text-blue-700 font-medium">Démo : pauledoux@protonmail.com / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sponsored, setSponsored] = useState<SponsoredItem[]>(MOCK_SPONSORED);
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);

  const totalRevenue = MOCK_COMMISSIONS.reduce((s, c) => s + c.amountCents, 0);
  const pendingCommissions = MOCK_COMMISSIONS.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.amountCents, 0);
  const collectedCommissions = MOCK_COMMISSIONS.filter(c => c.status === 'COLLECTED').reduce((s, c) => s + c.amountCents, 0);

  const handleToggleSponsored = (id: string) => {
    setSponsored(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleUpdateOrder = (id: string, order: number | null) => {
    setSponsored(prev => prev.map(s => s.id === id ? { ...s, homepageOrder: order } : s));
  };

  const handleToggleUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  return (
    <AdminGate>
      <div className="min-h-screen bg-gray-50">
        {/* Admin header */}
        <header className="bg-primary-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base">Portail Admin — Bor-Bi</h1>
              <p className="text-primary-300 text-xs">pauledoux@protonmail.com · TransTech Solution</p>
            </div>
          </div>
          <Link href="/login" className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            <LogOut size={14} />
            Déconnexion
          </Link>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-56 bg-white border-r border-gray-100 min-h-[calc(100vh-64px)] p-3">
            <nav className="space-y-0.5">
              {TAB_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === tab.id ? 'bg-primary-800 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6 max-w-6xl overflow-auto">

            {/* ===== DASHBOARD ===== */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Tableau de bord</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Revenus totaux', value: `${(totalRevenue / 100).toLocaleString('fr-FR')} FCFA`, icon: <TrendingUp size={20} className="text-success" />, bg: 'bg-green-50' },
                    { label: 'Commissions en attente', value: `${(pendingCommissions / 100).toLocaleString('fr-FR')} FCFA`, icon: <DollarSign size={20} className="text-warning" />, bg: 'bg-yellow-50' },
                    { label: 'Utilisateurs actifs', value: users.filter(u => u.active).length, icon: <Users size={20} className="text-primary-600" />, bg: 'bg-primary-50' },
                    { label: 'Produits sponsorisés', value: sponsored.filter(s => s.active).length, icon: <Star size={20} className="text-violet" />, bg: 'bg-violet-50' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                        {kpi.icon}
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">{kpi.label}</p>
                      <p className="text-xl font-bold text-gray-900 mt-1 font-mono">{kpi.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-bold text-gray-900 mb-4">Répartition par rôle</h3>
                    <div className="space-y-3">
                      {[
                        { role: 'Vendeurs', count: users.filter(u => u.role === 'VENDOR').length, color: 'bg-primary-500' },
                        { role: 'Grossistes', count: users.filter(u => u.role === 'WHOLESALER').length, color: 'bg-success' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-[13px] text-gray-700 flex-1">{item.role}</span>
                          <span className="text-[13px] font-bold text-gray-900">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-bold text-gray-900 mb-4">Commissions récentes</h3>
                    <div className="space-y-2">
                      {MOCK_COMMISSIONS.slice(0, 4).map((c) => (
                        <div key={c.id} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.type === 'SALE' ? 'bg-primary-50 text-primary-700' : 'bg-violet-50 text-violet'}`}>
                              {c.type}
                            </span>
                            <span className="text-[11px] text-gray-400 ml-2">{c.reference}</span>
                          </div>
                          <span className="text-[13px] font-bold text-gray-900 font-mono">
                            {(c.amountCents / 100).toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== USERS ===== */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Utilisateurs ({users.length})</h2>
                  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50">
                    <Download size={14} />
                    Exporter CSV
                  </button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Email', 'Rôle', 'Entreprise', 'Localisation', 'Inscrit le', 'Statut', 'Actions'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-[13px] text-gray-900">{user.email}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${user.role === 'VENDOR' ? 'bg-primary-50 text-primary-700' : 'bg-violet-50 text-violet'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[13px] text-gray-700">{user.businessName}</td>
                            <td className="px-4 py-3 text-[12px] text-gray-500">{user.location}</td>
                            <td className="px-4 py-3 text-[12px] text-gray-500">{user.createdAt}</td>
                            <td className="px-4 py-3">
                              <span className={`flex items-center gap-1 text-[11px] font-medium ${user.active ? 'text-success' : 'text-red-500'}`}>
                                {user.active ? <><CheckCircle size={12} /> Actif</> : <><XCircle size={12} /> Inactif</>}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleToggleUser(user.id)}
                                className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors ${user.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-success hover:bg-green-100'}`}
                              >
                                {user.active ? 'Bloquer' : 'Activer'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== COMMISSIONS ===== */}
            {activeTab === 'commissions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Commissions (0.5%)</h2>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[11px] text-gray-500">Collecté</p>
                      <p className="text-[16px] font-bold text-success font-mono">{(collectedCommissions / 100).toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-500">En attente</p>
                      <p className="text-[16px] font-bold text-warning font-mono">{(pendingCommissions / 100).toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-primary-800 text-white rounded-lg text-[13px] font-medium hover:bg-primary-700">
                      <RefreshCw size={14} />
                      Générer facture
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Référence', 'Type', 'Montant', 'Statut', 'Date'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {MOCK_COMMISSIONS.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-[13px] font-mono text-gray-900">{c.reference}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${c.type === 'SALE' ? 'bg-primary-50 text-primary-700' : 'bg-violet-50 text-violet'}`}>
                              {c.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[13px] font-bold text-gray-900 font-mono">{(c.amountCents / 100).toLocaleString('fr-FR')} FCFA</td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${c.status === 'COLLECTED' ? 'bg-green-50 text-success' : 'bg-yellow-50 text-yellow-600'}`}>
                              {c.status === 'COLLECTED' ? 'Collecté' : 'En attente'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[12px] text-gray-500">{c.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===== DATA INSIGHTS ===== */}
            {activeTab === 'data' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Data Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                  {[
                    { label: 'Transactions totales', value: '127', trend: '+12%', color: 'text-success' },
                    { label: 'Valeur moyenne vente', value: '45 000 FCFA', trend: '+5%', color: 'text-success' },
                    { label: 'Taux de paiement partiel', value: '23%', trend: '-3%', color: 'text-red-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <p className="text-[12px] text-gray-500 mb-2">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 font-mono">{stat.value}</p>
                      <p className={`text-[12px] font-semibold mt-1 ${stat.color}`}>{stat.trend} ce mois</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-gray-900 mb-4">Top catégories de ventes</h3>
                  <div className="space-y-3">
                    {[
                      { cat: 'Épicerie', pct: 35, color: 'bg-violet-500' },
                      { cat: 'Frais & Protéines', pct: 25, color: 'bg-red-400' },
                      { cat: 'Boissons', pct: 18, color: 'bg-blue-500' },
                      { cat: 'Prêt-à-porter', pct: 12, color: 'bg-pink-500' },
                      { cat: 'Hygiène', pct: 10, color: 'bg-indigo-500' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-[12px] text-gray-700 w-36 flex-shrink-0">{item.cat}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                        <span className="text-[12px] font-bold text-gray-900 w-10 text-right">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===== SPONSORING ===== */}
            {activeTab === 'sponsoring' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Produits Sponsorisés</h2>
                  <span className="text-[12px] text-gray-500">{sponsored.filter(s => s.active).length} actifs sur {sponsored.length}</span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Produit', 'Marque', 'Catégorie', 'Ordre', 'Statut', 'Actions'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {sponsored.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-[13px] font-medium text-gray-900">{item.productName}</td>
                            <td className="px-4 py-3 text-[12px] text-gray-500">{item.brand}</td>
                            <td className="px-4 py-3 text-[12px] text-gray-500">{item.category}</td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.homepageOrder ?? ''}
                                onChange={(e) => handleUpdateOrder(item.id, e.target.value ? parseInt(e.target.value) : null)}
                                className="w-16 px-2 py-1 border border-gray-200 rounded text-[12px] text-center outline-none focus:ring-1 focus:ring-primary-200"
                                placeholder="—"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.active ? 'bg-green-50 text-success' : 'bg-gray-100 text-gray-500'}`}>
                                {item.active ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleToggleSponsored(item.id)}
                                className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors ${item.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-success hover:bg-green-100'}`}
                              >
                                {item.active ? 'Désactiver' : 'Activer'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== VITRINE ===== */}
            {activeTab === 'vitrine' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Ordre de la Vitrine</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-[13px] text-gray-500 mb-4">Définissez l&apos;ordre d&apos;affichage des produits sur la page d&apos;accueil publique.</p>
                  <div className="space-y-3">
                    {sponsored.filter(s => s.active).sort((a, b) => (a.homepageOrder ?? 999) - (b.homepageOrder ?? 999)).map((item, i) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <span className="w-8 h-8 bg-primary-100 text-primary-800 rounded-lg flex items-center justify-center text-[13px] font-bold flex-shrink-0">
                          {item.homepageOrder ?? i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-[13px] font-semibold text-gray-900">{item.productName}</p>
                          <p className="text-[11px] text-gray-400">{item.brand} · {item.category}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleUpdateOrder(item.id, Math.max(1, (item.homepageOrder ?? 1) - 1))}
                            className="w-7 h-7 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center text-[12px] font-bold"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleUpdateOrder(item.id, (item.homepageOrder ?? 1) + 1)}
                            className="w-7 h-7 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center text-[12px] font-bold"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===== MESSAGES (modération) ===== */}
            {activeTab === 'messages' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Modération Messages (lecture seule)</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
                  <p className="text-[12px] text-amber-700">Accès en lecture seule pour modération. Les messages sont chiffrés en production.</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Expéditeur', 'Destinataire', 'Message', 'Date', 'Actions'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {MOCK_MESSAGES.map((msg) => (
                          <tr key={msg.id} className={`hover:bg-gray-50 ${msg.flagged ? 'bg-red-50' : ''}`}>
                            <td className="px-4 py-3 text-[12px] text-gray-700">{msg.senderEmail}</td>
                            <td className="px-4 py-3 text-[12px] text-gray-700">{msg.receiverEmail}</td>
                            <td className="px-4 py-3 text-[12px] text-gray-600 max-w-xs truncate">{msg.content}</td>
                            <td className="px-4 py-3 text-[11px] text-gray-400">{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <Eye size={14} />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-red-500">
                                  <EyeOff size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== LOGS ===== */}
            {activeTab === 'logs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Journaux d&apos;audit</h2>
                  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50">
                    <Download size={14} />
                    Exporter
                  </button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Utilisateur', 'Action', 'Détails', 'IP', 'Date'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {MOCK_LOGS.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-[12px] text-gray-700">{log.userEmail}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                log.action.includes('LOGIN') ? 'bg-blue-50 text-blue-700' :
                                log.action.includes('CREATE') ? 'bg-green-50 text-success' :
                                log.action.includes('ADMIN') ? 'bg-red-50 text-red-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[12px] text-gray-600">{log.details}</td>
                            <td className="px-4 py-3 text-[11px] text-gray-400 font-mono">{log.ip}</td>
                            <td className="px-4 py-3 text-[11px] text-gray-400">{new Date(log.createdAt).toLocaleString('fr-FR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </AdminGate>
  );
}
