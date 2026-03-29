'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { TrendingUp, Package, ShoppingBag, Clock, CheckCircle, XCircle, Star, AlertTriangle, Truck, Filter } from 'lucide-react';
import Link from 'next/link';

interface OrderSummary {
  id: string;
  vendorName: string;
  vendorLocation: string;
  totalCents: number;
  platformFeeCents: number;
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  itemCount: number;
  items: Array<{ name: string; qty: number; price: number }>;
}

interface LowStockItem {
  name: string;
  stock: number;
  threshold: number;
}

const MOCK_ORDERS: OrderSummary[] = [
  {
    id: 'ORD-001', vendorName: 'Boutique Amadou', vendorLocation: 'Dakar',
    totalCents: 18000000, platformFeeCents: 90000, status: 'PENDING', createdAt: '2026-03-28', itemCount: 2,
    items: [{ name: 'Riz brisé 25kg', qty: 10, price: 1500000 }, { name: 'Huile 5L', qty: 5, price: 600000 }],
  },
  {
    id: 'ORD-002', vendorName: 'Épicerie Fatou', vendorLocation: 'Thiès',
    totalCents: 5000000, platformFeeCents: 25000, status: 'CONFIRMED', createdAt: '2026-03-25', itemCount: 1,
    items: [{ name: 'Sucre 1kg', qty: 50, price: 80000 }],
  },
  {
    id: 'ORD-003', vendorName: 'Boutique Moussa', vendorLocation: 'Saint-Louis',
    totalCents: 8000000, platformFeeCents: 40000, status: 'DELIVERED', createdAt: '2026-03-15', itemCount: 3,
    items: [{ name: 'Sardines boîte', qty: 100, price: 100000 }],
  },
  {
    id: 'ORD-004', vendorName: 'Commerce Diallo', vendorLocation: 'Ziguinchor',
    totalCents: 12000000, platformFeeCents: 60000, status: 'PENDING', createdAt: '2026-03-27', itemCount: 4,
    items: [{ name: 'Chemise homme', qty: 20, price: 450000 }, { name: 'Tissu wax', qty: 5, price: 1200000 }],
  },
  {
    id: 'ORD-005', vendorName: 'Boutique Ndiaye', vendorLocation: 'Kaolack',
    totalCents: 3500000, platformFeeCents: 17500, status: 'CANCELLED', createdAt: '2026-03-20', itemCount: 1,
    items: [{ name: 'Lait Nido', qty: 10, price: 350000 }],
  },
];

const MOCK_LOW_STOCK: LowStockItem[] = [
  { name: 'Riz brisé 25kg', stock: 8, threshold: 20 },
  { name: 'Huile végétale 5L', stock: 3, threshold: 10 },
  { name: 'Sardines en boîte', stock: 15, threshold: 50 },
];

const STATUS_CONFIG = {
  PENDING: { label: 'En attente', color: 'text-yellow-700 bg-yellow-50 border-yellow-200', icon: <Clock size={12} /> },
  CONFIRMED: { label: 'Confirmée', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: <CheckCircle size={12} /> },
  DELIVERED: { label: 'Livrée', color: 'text-green-700 bg-green-50 border-green-200', icon: <CheckCircle size={12} /> },
  CANCELLED: { label: 'Annulée', color: 'text-red-700 bg-red-50 border-red-200', icon: <XCircle size={12} /> },
};

type FilterStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export default function WholesalerDashboardPage() {
  const [orders, setOrders] = useState<OrderSummary[]>(MOCK_ORDERS);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const pending = orders.filter(o => o.status === 'PENDING');
  const totalRevenue = orders.filter(o => o.status === 'DELIVERED').reduce((s, o) => s + o.totalCents, 0);
  const totalCommissions = orders.reduce((s, o) => s + o.platformFeeCents, 0);

  const filteredOrders = filterStatus === 'ALL' ? orders : orders.filter(o => o.status === filterStatus);

  const handleUpdateStatus = async (id: string, status: OrderSummary['status']) => {
    // In production: call PATCH /api/orders
    // await fetch('/api/orders', { method: 'PATCH', body: JSON.stringify({ orderId: id, status }) });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <AppLayout pageTitle="Dashboard Grossiste" pageSubtitle="Grossiste Diallo & Fils">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900">Bonjour, Grossiste 👋</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">Voici un résumé de votre activité</p>
        </div>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full">
          <Star size={12} />
          Grossiste mis en avant
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Commandes totales', value: orders.length, icon: <ShoppingBag size={20} className="text-blue-600" />, color: 'bg-blue-50' },
          { label: 'En attente', value: pending.length, icon: <Clock size={20} className="text-yellow-600" />, color: 'bg-yellow-50' },
          { label: 'Revenus livrés', value: `${(totalRevenue / 100).toLocaleString('fr-FR')} FCFA`, icon: <TrendingUp size={20} className="text-green-600" />, color: 'bg-green-50' },
          { label: 'Commissions (0,5%)', value: `${(totalCommissions / 100).toLocaleString('fr-FR')} FCFA`, icon: <Package size={20} className="text-violet" />, color: 'bg-violet-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center mb-3`}>
              {kpi.icon}
            </div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">{kpi.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1 font-mono">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Pending orders action panel */}
        <div className="lg:col-span-2">
          {pending.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[16px] font-bold text-gray-900 mb-3">⚡ Commandes en attente ({pending.length})</h3>
              <div className="space-y-3">
                {pending.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[14px] font-semibold text-gray-900">{order.vendorName}</p>
                        <p className="text-[12px] text-gray-400">{order.vendorLocation} · {order.id} · {order.itemCount} article(s)</p>
                        <div className="mt-1 space-y-0.5">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-[11px] text-gray-500">• {item.qty}× {item.name} — {(item.price / 100).toLocaleString('fr-FR')} FCFA</p>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[15px] font-bold text-gray-900 font-mono">
                          {(order.totalCents / 100).toLocaleString('fr-FR')} FCFA
                        </p>
                        <p className="text-[10px] text-gray-400">Commission: {(order.platformFeeCents / 100).toLocaleString('fr-FR')} FCFA</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-xl text-[13px] font-semibold hover:bg-green-700 transition-colors active:scale-95"
                      >
                        <CheckCircle size={14} />
                        Confirmer
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-[13px] font-semibold hover:bg-red-100 transition-colors"
                      >
                        <XCircle size={14} />
                        Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Low stock alerts */}
        <div>
          <h3 className="text-[16px] font-bold text-gray-900 mb-3">⚠️ Stocks faibles</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            {MOCK_LOW_STOCK.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-yellow-500 flex-shrink-0" />
                  <p className="text-[12px] font-medium text-gray-800 truncate max-w-[120px]">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold text-red-600">{item.stock} unités</p>
                  <p className="text-[10px] text-gray-400">Seuil: {item.threshold}</p>
                </div>
              </div>
            ))}
            <Link href="/wholesaler/catalogue" className="block text-center text-[12px] text-blue-600 font-semibold hover:text-blue-800 pt-1">
              Gérer le stock →
            </Link>
          </div>
        </div>
      </div>

      {/* All orders with filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-bold text-gray-900">Toutes les commandes</h3>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="text-[12px] border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
              <option value="ALL">Toutes</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmées</option>
              <option value="DELIVERED">Livrées</option>
              <option value="CANCELLED">Annulées</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filteredOrders.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              const isExpanded = expandedOrder === order.id;
              return (
                <div key={order.id}>
                  <div
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-semibold text-gray-900">{order.vendorName}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cfg.color}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{order.id} · {order.createdAt} · {order.itemCount} article(s)</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[13px] font-bold text-gray-900 font-mono">
                        {(order.totalCents / 100).toLocaleString('fr-FR')} FCFA
                      </p>
                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, 'DELIVERED'); }}
                          className="text-[11px] text-green-600 font-semibold hover:underline mt-0.5 flex items-center gap-1"
                        >
                          <Truck size={10} /> Marquer livrée
                        </button>
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
                      <p className="text-[11px] font-semibold text-gray-600 mb-2 mt-2">Détail de la commande :</p>
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-[12px]">
                            <span className="text-gray-700">{item.qty}× {item.name}</span>
                            <span className="font-medium text-gray-900">{(item.price / 100).toLocaleString('fr-FR')} FCFA</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-[12px] pt-1 border-t border-gray-200 mt-1">
                          <span className="text-gray-500">Commission plateforme (0,5%)</span>
                          <span className="text-gray-500">{(order.platformFeeCents / 100).toLocaleString('fr-FR')} FCFA</span>
                        </div>
                      </div>
                      {order.status === 'PENDING' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-[12px] font-semibold hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle size={12} /> Confirmer
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[12px] font-semibold hover:bg-red-100 transition-colors"
                          >
                            <XCircle size={12} /> Annuler
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-[13px]">Aucune commande dans cette catégorie</div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
