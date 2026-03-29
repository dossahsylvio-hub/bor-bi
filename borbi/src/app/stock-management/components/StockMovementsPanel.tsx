'use client';

import React from 'react';
import { X, ArrowUp, ArrowDown, RefreshCw, RotateCcw, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  productName: string;
  unit: string;
  stock: number;
}

interface Movement {
  id: string;
  date: string;
  quantityChange: number;
  reason: string;
  referenceId?: string;
  newStock: number;
}

const movements: Movement[] = [
  { id: 'mv-001', date: 'Auj. 14:32', quantityChange: -3, reason: 'Vente', referenceId: 'TXN-001', newStock: 2 },
  { id: 'mv-002', date: 'Auj. 11:00', quantityChange: -2, reason: 'Vente', referenceId: 'TXN-096', newStock: 5 },
  { id: 'mv-003', date: 'Hier 17:00', quantityChange: +20, reason: 'Réapprovisionnement', newStock: 7 },
  { id: 'mv-004', date: 'Hier 09:15', quantityChange: -5, reason: 'Vente', referenceId: 'TXN-088', newStock: 3 },
  { id: 'mv-005', date: '26 mars', quantityChange: -1, reason: 'Ajustement', newStock: 8 },
  { id: 'mv-006', date: '25 mars', quantityChange: +15, reason: 'Réapprovisionnement', newStock: 9 },
  { id: 'mv-007', date: '24 mars', quantityChange: -4, reason: 'Vente', referenceId: 'TXN-072', newStock: 4 },
  { id: 'mv-008', date: '23 mars', quantityChange: +2, reason: 'Retour client', newStock: 8 },
];

const reasonIcons: Record<string, React.ReactNode> = {
  'Vente': <ArrowDown size={12} className="text-danger" />,
  'Réapprovisionnement': <ArrowUp size={12} className="text-success" />,
  'Ajustement': <RefreshCw size={12} className="text-primary-800" />,
  'Retour client': <RotateCcw size={12} className="text-violet" />,
};

interface StockMovementsPanelProps {
  product: Product | null;
  onClose: () => void;
}

export default function StockMovementsPanel({ product, onClose }: StockMovementsPanelProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[85vh] flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Historique des mouvements</h2>
            <p className="text-[12px] text-gray-400 mt-0.5 truncate max-w-[260px]">{product.productName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Current stock summary */}
        <div className="px-6 py-3 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[12px] text-gray-500 font-medium">Stock actuel</span>
          <span className={`text-[16px] font-mono font-bold ${product.stock <= 5 ? 'text-danger' : 'text-gray-900'}`}>
            {product.stock} {product.unit}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {movements.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <AlertCircle size={28} className="text-gray-300" />
              <p className="text-[13px] text-gray-500">Aucun mouvement enregistré</p>
            </div>
          ) : (
            <div className="space-y-2">
              {movements.map((mv) => (
                <div
                  key={`mv-${mv.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${mv.quantityChange > 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    {reasonIcons[mv.reason] || <RefreshCw size={12} className="text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-gray-800">{mv.reason}</p>
                    {mv.referenceId && (
                      <p className="text-[10px] text-gray-400 font-mono">{mv.referenceId}</p>
                    )}
                    <p className="text-[10px] text-gray-400">{mv.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-[13px] font-mono font-bold ${mv.quantityChange > 0 ? 'text-success' : 'text-danger'}`}>
                      {mv.quantityChange > 0 ? '+' : ''}{mv.quantityChange}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">→ {mv.newStock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}