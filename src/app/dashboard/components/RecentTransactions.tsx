'use client';

import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  clientName: string;
  clientPhone: string;
  items: string;
  totalCents: number;
  amountPaid: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  createdAt: string;
}

const recentTransactions: Transaction[] = [
  {
    id: 'txn-001',
    clientName: 'Mariama Diallo',
    clientPhone: '+221 77 432 1098',
    items: 'Riz brisé 5kg, Huile 2L, Tomates',
    totalCents: 1230000,
    amountPaid: 1230000,
    paymentStatus: 'PAID',
    createdAt: '14:32',
  },
  {
    id: 'txn-002',
    clientName: 'Ousmane Sow',
    clientPhone: '+221 76 891 2345',
    items: 'Poulet PAC 1.5kg, Oignons 2kg',
    totalCents: 680000,
    amountPaid: 400000,
    paymentStatus: 'PARTIAL',
    createdAt: '13:15',
  },
  {
    id: 'txn-003',
    clientName: 'Fatou Camara',
    clientPhone: '+221 70 234 5678',
    items: 'Sardines fraîches, Pain x6, Sucre 1kg',
    totalCents: 420000,
    amountPaid: 420000,
    paymentStatus: 'PAID',
    createdAt: '12:48',
  },
  {
    id: 'txn-004',
    clientName: 'Ibrahima Konaté',
    clientPhone: '+224 621 345 678',
    items: 'Ciment 5 sacs, Fer à béton',
    totalCents: 5800000,
    amountPaid: 0,
    paymentStatus: 'UNPAID',
    createdAt: '11:20',
  },
  {
    id: 'txn-005',
    clientName: 'Awa Traoré',
    clientPhone: '+221 78 567 8901',
    items: 'Lait concentré x12, Café Touba, Ataya',
    totalCents: 895000,
    amountPaid: 895000,
    paymentStatus: 'PAID',
    createdAt: '10:55',
  },
  {
    id: 'txn-006',
    clientName: 'Mamadou Ba',
    clientPhone: '+221 77 123 4567',
    items: 'Bananes x5 régimes, Mangues',
    totalCents: 315000,
    amountPaid: 200000,
    paymentStatus: 'PARTIAL',
    createdAt: '09:30',
  },
  {
    id: 'txn-007',
    clientName: 'Aissatou Baldé',
    clientPhone: '+224 622 456 789',
    items: 'Thiof 2kg, Courbine 1.5kg, Citrons',
    totalCents: 740000,
    amountPaid: 740000,
    paymentStatus: 'PAID',
    createdAt: '09:05',
  },
  {
    id: 'txn-008',
    clientName: 'Seydou Coulibaly',
    clientPhone: '+223 66 789 0123',
    items: 'Gazinière 3 feux, Marmite 20L',
    totalCents: 3200000,
    amountPaid: 1500000,
    paymentStatus: 'PARTIAL',
    createdAt: '08:20',
  },
];

const statusConfig = {
  PAID: {
    label: 'Payé',
    icon: <CheckCircle2 size={13} />,
    className: 'bg-emerald-50 text-success border border-emerald-200',
  },
  PARTIAL: {
    label: 'Partiel',
    icon: <Clock size={13} />,
    className: 'bg-amber-50 text-warning border border-amber-200',
  },
  UNPAID: {
    label: 'Impayé',
    icon: <AlertCircle size={13} />,
    className: 'bg-red-50 text-danger border border-red-200',
  },
};

function formatFCFA(cents: number) {
  return (cents / 100).toLocaleString('fr-FR') + ' FCFA';
}

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div>
          <h3 className="text-[14px] font-semibold text-gray-900">Transactions récentes</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Aujourd'hui · 34 transactions</p>
        </div>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-[12px] font-medium text-primary-800 hover:text-primary-600 transition-colors"
        >
          Voir tout
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="divide-y divide-gray-50">
        {recentTransactions.map((txn) => {
          const statusConf = statusConfig[txn.paymentStatus];
          const remaining = txn.totalCents - txn.amountPaid;
          return (
            <div
              key={`txn-${txn.id}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 transition-colors group cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-bold text-primary-800">
                  {txn.clientName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-gray-900 truncate">{txn.clientName}</p>
                  <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${statusConf.className}`}>
                    {statusConf.icon}
                    {statusConf.label}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">{txn.items}</p>
              </div>

              {/* Amounts */}
              <div className="text-right flex-shrink-0">
                <p className="text-[13px] font-mono font-semibold text-gray-900">
                  {formatFCFA(txn.totalCents)}
                </p>
                {txn.paymentStatus !== 'PAID' && (
                  <p className="text-[10px] font-mono text-danger mt-0.5">
                    Reste: {formatFCFA(remaining)}
                  </p>
                )}
                <p className="text-[10px] text-gray-400 mt-0.5">{txn.createdAt}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}