import React from 'react';
import AppLayout from '@/components/AppLayout';
import KpiCards from './components/KpiCards';
import SalesChart from './components/SalesChart';
import RecentTransactions from './components/RecentTransactions';
import LowStockAlerts from './components/LowStockAlerts';
import PendingOrders from './components/PendingOrders';
import Link from 'next/link';
import { ShoppingCart, RefreshCw } from 'lucide-react';

// Backend integration point: fetch vendor dashboard summary
// GET /api/vendor/dashboard?vendorId=...
// Returns: todaySales, totalDebt, lowStockCount, pendingOrdersCount, recentTransactions, alerts

export default function DashboardPage() {
  return (
    <AppLayout
      pageTitle="Dashboard"
      pageSubtitle="Samedi 28 mars 2026 · Amadou Mbaye"
    >
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900">Bonjour, Amadou 👋</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">Voici un résumé de votre activité du jour</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-all duration-150 active:scale-95">
            <RefreshCw size={14} />
            Actualiser
          </button>
          <Link
            href="/new-sale"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-800 text-white text-[13px] font-semibold hover:bg-primary-700 transition-all duration-150 active:scale-95 shadow-sm"
          >
            <ShoppingCart size={15} />
            Nouvelle Vente
          </Link>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <section className="mb-6">
        <KpiCards />
      </section>

      {/* Charts + Activity Row */}
      <section className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-5 mb-5">
        {/* Sales chart — spans 2 cols */}
        <div className="xl:col-span-2">
          <SalesChart />
        </div>

        {/* Low stock alerts */}
        <div className="xl:col-span-1">
          <LowStockAlerts />
        </div>
      </section>

      {/* Bottom row: Recent transactions + Pending orders */}
      <section className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
        {/* Recent transactions — spans 2 cols */}
        <div className="xl:col-span-2">
          <RecentTransactions />
        </div>

        {/* Pending orders */}
        <div className="xl:col-span-1">
          <PendingOrders />
        </div>
      </section>

      {/* Last updated indicator */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        <span className="text-[11px] text-gray-400">Données actualisées à 14:32 · Synchronisation automatique</span>
      </div>
    </AppLayout>
  );
}