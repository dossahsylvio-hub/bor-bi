'use client';

import React from 'react';
import { Truck, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PendingOrder {
  id: string;
  wholesalerName: string;
  wholesalerLocation: string;
  itemCount: number;
  totalCents: number;
  status: 'PENDING' | 'CONFIRMED';
  createdAt: string;
}

const pendingOrders: PendingOrder[] = [
  {
    id: 'order-001',
    wholesalerName: 'Diallo Distributions SARL',
    wholesalerLocation: 'Dakar, Sénégal',
    itemCount: 8,
    totalCents: 125000000,
    status: 'PENDING',
    createdAt: 'Il y a 2h',
  },
  {
    id: 'order-002',
    wholesalerName: 'Société Camara & Frères',
    wholesalerLocation: 'Conakry, Guinée',
    itemCount: 3,
    totalCents: 45600000,
    status: 'CONFIRMED',
    createdAt: 'Il y a 5h',
  },
  {
    id: 'order-003',
    wholesalerName: 'Atlantic Food Import',
    wholesalerLocation: 'Casablanca, Maroc',
    itemCount: 12,
    totalCents: 387000000,
    status: 'PENDING',
    createdAt: 'Hier 16:20',
  },
  {
    id: 'order-004',
    wholesalerName: 'West Africa Traders',
    wholesalerLocation: 'Abidjan, Côte d\'Ivoire',
    itemCount: 5,
    totalCents: 89000000,
    status: 'PENDING',
    createdAt: 'Hier 09:45',
  },
];

export default function PendingOrders() {
  return (
    <div className="bg-white rounded-xl border border-violet-100 shadow-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-violet-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
            <Truck size={15} className="text-violet" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-gray-900">Commandes grossistes</h3>
            <p className="text-[11px] text-violet mt-0.5 font-medium">4 commandes actives</p>
          </div>
        </div>
        <Link
          href="/orders"
          className="flex items-center gap-1 text-[12px] font-medium text-primary-800 hover:text-primary-600 transition-colors"
        >
          Voir tout
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="divide-y divide-gray-50">
        {pendingOrders.map((order) => (
          <div
            key={`order-${order.id}`}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${order.status === 'CONFIRMED' ? 'bg-success' : 'bg-warning'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-800 truncate">{order.wholesalerName}</p>
              <p className="text-[11px] text-gray-400 truncate">
                {order.wholesalerLocation} · {order.itemCount} articles
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[12px] font-mono font-semibold text-gray-900">
                {(order.totalCents / 100).toLocaleString('fr-FR')}
              </p>
              <div className="flex items-center gap-1 justify-end mt-0.5">
                {order.status === 'CONFIRMED'
                  ? <CheckCircle2 size={10} className="text-success" />
                  : <Clock size={10} className="text-warning" />
                }
                <span className={`text-[10px] font-semibold ${order.status === 'CONFIRMED' ? 'text-success' : 'text-warning'}`}>
                  {order.status === 'CONFIRMED' ? 'Confirmée' : 'En attente'}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">{order.createdAt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}