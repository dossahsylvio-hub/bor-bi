'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Truck, Plus, Search, Package, ChevronRight, CheckCircle, Clock, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  productName: string;
  quantity: number;
  conditioning: string;
  priceCents: number;
}

interface WholesaleOrder {
  id: string;
  wholesalerName: string;
  wholesalerLocation: string;
  items: OrderItem[];
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  totalCents: number;
  createdAt: string;
  updatedAt: string;
}

const MOCK_ORDERS: WholesaleOrder[] = [
  {
    id: 'ORD-001',
    wholesalerName: 'Grossiste Diallo & Fils',
    wholesalerLocation: 'Dakar, Sénégal',
    items: [
      { productName: 'Riz brisé 25kg', quantity: 10, conditioning: 'sac 25kg', priceCents: 1500000 },
      { productName: 'Huile végétale 5L', quantity: 5, conditioning: 'bidon 5L', priceCents: 600000 },
    ],
    status: 'PENDING',
    totalCents: 18000000,
    createdAt: '2026-03-28',
    updatedAt: '2026-03-28',
  },
  {
    id: 'ORD-002',
    wholesalerName: 'Import-Export Maroc',
    wholesalerLocation: 'Casablanca, Maroc',
    items: [
      { productName: 'Sardines en boîte', quantity: 50, conditioning: 'carton 24', priceCents: 100000 },
    ],
    status: 'CONFIRMED',
    totalCents: 5000000,
    createdAt: '2026-03-25',
    updatedAt: '2026-03-26',
  },
  {
    id: 'ORD-003',
    wholesalerName: 'Grossiste Diallo & Fils',
    wholesalerLocation: 'Dakar, Sénégal',
    items: [
      { productName: 'Sucre en poudre 1kg', quantity: 100, conditioning: 'sac 50kg', priceCents: 80000 },
    ],
    status: 'DELIVERED',
    totalCents: 8000000,
    createdAt: '2026-03-15',
    updatedAt: '2026-03-20',
  },
];

const STATUS_CONFIG = {
  PENDING: { label: 'En attente', color: 'text-warning bg-yellow-50 border-yellow-200', icon: <Clock size={13} /> },
  CONFIRMED: { label: 'Confirmée', color: 'text-primary-700 bg-primary-50 border-primary-200', icon: <CheckCircle size={13} /> },
  DELIVERED: { label: 'Livrée', color: 'text-success bg-green-50 border-green-200', icon: <CheckCircle size={13} /> },
  CANCELLED: { label: 'Annulée', color: 'text-danger bg-red-50 border-red-200', icon: <XCircle size={13} /> },
};

export default function OrdersPage() {
  const [orders] = useState<WholesaleOrder[]>(MOCK_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<WholesaleOrder | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);

  const filtered = orders.filter(o => {
    const matchSearch = o.wholesalerName.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pending = orders.filter(o => o.status === 'PENDING').length;
  const totalSpent = orders.filter(o => o.status === 'DELIVERED').reduce((s, o) => s + o.totalCents, 0);

  return (
    <AppLayout pageTitle="Commandes Grossistes" pageSubtitle="Gérez vos approvisionnements">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900">Commandes Grossistes</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {orders.length} commandes · <span className="text-warning font-semibold">{pending} en attente</span>
          </p>
        </div>
        <button
          onClick={() => setShowNewOrder(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-800 text-white text-[13px] font-semibold hover:bg-primary-700 transition-all active:scale-95 shadow-sm"
        >
          <Plus size={15} />
          Nouvelle commande
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total commandes', value: orders.length, color: 'text-gray-900' },
          { label: 'En attente', value: pending, color: 'text-warning' },
          { label: 'Livrées', value: orders.filter(o => o.status === 'DELIVERED').length, color: 'text-success' },
          { label: 'Total dépensé', value: `${(totalSpent / 100).toLocaleString('fr-FR')} FCFA`, color: 'text-primary-800' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
            <p className={`text-xl font-bold mt-1 font-mono ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par grossiste ou ID..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-primary-200 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-[12px] font-medium border transition-all ${statusFilter === s ? 'bg-primary-800 text-white border-primary-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
            >
              {s === 'ALL' ? 'Toutes' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const statusCfg = STATUS_CONFIG[order.status];
          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Truck size={18} className="text-primary-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-semibold text-gray-900">{order.wholesalerName}</p>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusCfg.color}`}>
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-400 mt-0.5">{order.wholesalerLocation} · {order.id}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {order.items.slice(0, 2).map((item, i) => (
                        <span key={i} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Package size={10} />
                          {item.productName} ×{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-[11px] text-gray-400">+{order.items.length - 2} autres</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[15px] font-bold text-gray-900 font-mono">
                    {(order.totalCents / 100).toLocaleString('fr-FR')} FCFA
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{order.createdAt}</p>
                  <ChevronRight size={16} className="text-gray-300 ml-auto mt-1" />
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card py-16 text-center">
            <Truck size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-gray-400">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selectedOrder.id}</h3>
                  <p className="text-[13px] text-gray-500">{selectedOrder.wholesalerName}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 p-1 text-lg">✕</button>
              </div>

              <div className="space-y-2 mb-5">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50">
                    <div>
                      <p className="text-[13px] font-medium text-gray-800">{item.productName}</p>
                      <p className="text-[11px] text-gray-400">{item.conditioning} · ×{item.quantity}</p>
                    </div>
                    <p className="text-[13px] font-semibold text-gray-900 font-mono">
                      {((item.priceCents * item.quantity) / 100).toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[14px] font-bold text-gray-900">Total</p>
                  <p className="text-[16px] font-bold text-primary-800 font-mono">
                    {(selectedOrder.totalCents / 100).toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/messages?orderId=${selectedOrder.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-violet text-white rounded-xl text-[13px] font-semibold hover:bg-purple-600 transition-colors"
                >
                  <MessageSquare size={15} />
                  Discuter
                </Link>
                {selectedOrder.status === 'PENDING' && (
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-danger text-white rounded-xl text-[13px] font-semibold hover:bg-red-600 transition-colors">
                    <XCircle size={15} />
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New order modal */}
      {showNewOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900 text-lg">Nouvelle commande grossiste</h3>
                <button onClick={() => setShowNewOrder(false)} className="text-gray-400 hover:text-gray-600 p-1 text-lg">✕</button>
              </div>
              <div className="py-8 text-center">
                <AlertCircle size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-[14px] text-gray-500 mb-2">Sélectionnez un grossiste pour passer une commande</p>
                <p className="text-[12px] text-gray-400">Fonctionnalité connectée à la base de données</p>
              </div>
              <button
                onClick={() => setShowNewOrder(false)}
                className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
