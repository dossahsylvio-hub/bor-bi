'use client';

import React from 'react';
import { AlertTriangle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface StockAlert {
  id: string;
  productName: string;
  category: string;
  currentStock: number;
  threshold: number;
  unit: string;
  priceCents: number;
}

const lowStockItems: StockAlert[] = [
  { id: 'alert-001', productName: 'Riz brisé Thaïlande', category: 'Épicerie', currentStock: 2, threshold: 10, unit: 'sac 50kg', priceCents: 2500000 },
  { id: 'alert-002', productName: 'Huile Végétale 5L', category: 'Épicerie', currentStock: 3, threshold: 8, unit: 'bidon', priceCents: 650000 },
  { id: 'alert-003', productName: 'Poulet PAC entier', category: 'Frais', currentStock: 4, threshold: 10, unit: 'pièce', priceCents: 350000 },
  { id: 'alert-004', productName: 'Sardines fraîches', category: 'Frais', currentStock: 1, threshold: 5, unit: 'kg', priceCents: 120000 },
  { id: 'alert-005', productName: 'Tomates fraîches', category: 'Fruits & Légumes', currentStock: 3, threshold: 15, unit: 'kg', priceCents: 80000 },
  { id: 'alert-006', productName: 'Gaz butane 6kg', category: 'Énergie', currentStock: 1, threshold: 4, unit: 'bouteille', priceCents: 450000 },
  { id: 'alert-007', productName: 'Savon Omo 1kg', category: 'Hygiène', currentStock: 4, threshold: 12, unit: 'paquet', priceCents: 185000 },
];

const categoryColors: Record<string, string> = {
  'Épicerie': 'bg-blue-50 text-blue-700',
  'Frais': 'bg-orange-50 text-orange-700',
  'Fruits & Légumes': 'bg-green-50 text-green-700',
  'Énergie': 'bg-yellow-50 text-yellow-700',
  'Hygiène': 'bg-purple-50 text-purple-700',
  'Boissons': 'bg-cyan-50 text-cyan-700',
};

function StockBar({ current, threshold }: { current: number; threshold: number }) {
  const pct = Math.min((current / threshold) * 100, 100);
  const color = pct <= 20 ? 'bg-danger' : pct <= 50 ? 'bg-warning' : 'bg-success';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-mono font-semibold text-gray-500 w-14 text-right">
        {current}/{threshold}
      </span>
    </div>
  );
}

export default function LowStockAlerts() {
  return (
    <div className="bg-white rounded-xl border border-red-100 shadow-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-red-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle size={15} className="text-danger" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-gray-900">Alertes de stock</h3>
            <p className="text-[11px] text-danger mt-0.5 font-medium">7 produits sous le seuil</p>
          </div>
        </div>
        <Link
          href="/stock-management"
          className="flex items-center gap-1 text-[12px] font-medium text-primary-800 hover:text-primary-600 transition-colors"
        >
          Gérer
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="p-3 space-y-1">
        {lowStockItems.map((item) => {
          const catColor = categoryColors[item.category] || 'bg-gray-50 text-gray-600';
          return (
            <div
              key={`stock-alert-${item.id}`}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors">
                <Package size={13} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[12px] font-semibold text-gray-800 truncate">{item.productName}</p>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${catColor}`}>
                    {item.category}
                  </span>
                </div>
                <StockBar current={item.currentStock} threshold={item.threshold} />
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[11px] font-mono font-semibold text-danger">
                  {item.currentStock} {item.unit}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50 rounded-b-xl">
        <Link
          href="/stock-management"
          className="flex items-center justify-center gap-2 text-[12px] font-semibold text-primary-800 hover:text-primary-600 transition-colors"
        >
          <Package size={13} />
          Gérer tout le stock
        </Link>
      </div>
    </div>
  );
}