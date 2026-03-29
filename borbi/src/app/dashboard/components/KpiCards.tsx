'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CreditCard,
  Truck,
  Users,
  ReceiptText,
} from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: { value: string; up: boolean };
  icon: React.ReactNode;
  variant: 'default' | 'success' | 'danger' | 'warning' | 'violet';
  span2?: boolean;
}

const variantStyles: Record<string, { card: string; icon: string; badge: string }> = {
  default: {
    card: 'bg-white border-gray-100',
    icon: 'bg-primary-50 text-primary-800',
    badge: 'text-gray-500',
  },
  success: {
    card: 'bg-white border-emerald-100',
    icon: 'bg-emerald-50 text-success',
    badge: 'text-success',
  },
  danger: {
    card: 'bg-red-50 border-red-200',
    icon: 'bg-red-100 text-danger',
    badge: 'text-danger',
  },
  warning: {
    card: 'bg-amber-50 border-amber-200',
    icon: 'bg-amber-100 text-warning',
    badge: 'text-warning',
  },
  violet: {
    card: 'bg-violet-50 border-violet-200',
    icon: 'bg-violet-100 text-violet',
    badge: 'text-violet',
  },
};

function KpiCard({ label, value, subValue, trend, icon, variant, span2 }: KpiCardProps) {
  const styles = variantStyles[variant];
  return (
    <div
      className={`
        rounded-xl border shadow-card p-5 flex flex-col gap-3 transition-all duration-200
        hover:shadow-card-hover group
        ${styles.card}
        ${span2 ? 'md:col-span-2' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold ${trend.up ? 'text-success' : 'text-danger'}`}>
            {trend.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
        <p className="text-[26px] font-bold font-mono text-gray-900 leading-none">{value}</p>
        {subValue && (
          <p className={`text-[12px] font-medium mt-1 ${styles.badge}`}>{subValue}</p>
        )}
      </div>
    </div>
  );
}

// Bento grid plan: 6 cards → grid-cols-3 (lg) → row1: hero(span2) + 1 regular, row2: 3 regular
export default function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
      {/* Hero card: Ventes du jour */}
      <KpiCard
        label="Ventes du jour"
        value="156 800"
        subValue="FCFA — Samedi 28 mars 2026"
        trend={{ value: '+23% vs hier', up: true }}
        icon={<ReceiptText size={18} />}
        variant="success"
        span2={true}
      />

      {/* Transactions aujourd'hui */}
      <KpiCard
        label="Transactions"
        value="34"
        subValue="dont 8 partielles"
        trend={{ value: '+5 vs hier', up: true }}
        icon={<CreditCard size={18} />}
        variant="default"
      />

      {/* Créances en cours */}
      <KpiCard
        label="Créances en cours"
        value="847 300"
        subValue="FCFA — 18 clients"
        trend={{ value: '+12 400', up: false }}
        icon={<Users size={18} />}
        variant="warning"
      />

      {/* Stock en alerte */}
      <KpiCard
        label="Produits en alerte"
        value="7"
        subValue="Stock sous le seuil"
        icon={<AlertTriangle size={18} />}
        variant="danger"
      />

      {/* Commandes grossistes */}
      <KpiCard
        label="Commandes grossistes"
        value="4"
        subValue="En attente de confirmation"
        trend={{ value: '2 confirmées', up: true }}
        icon={<Truck size={18} />}
        variant="violet"
      />
    </div>
  );
}