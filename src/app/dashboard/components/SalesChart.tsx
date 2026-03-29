'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  defs,
  linearGradient,
  stop,
} from 'recharts';

const salesData = [
  { day: 'Lun 23', ventes: 87400, objectif: 100000 },
  { day: 'Mar 24', ventes: 112300, objectif: 100000 },
  { day: 'Mer 25', ventes: 68900, objectif: 100000 },
  { day: 'Jeu 26', ventes: 134500, objectif: 100000 },
  { day: 'Ven 27', ventes: 95200, objectif: 100000 },
  { day: 'Sam 28', ventes: 156800, objectif: 100000 },
  { day: 'Dim 29', ventes: 43100, objectif: 100000 },
];

function formatFCFA(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return `${value}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-card-hover p-3 min-w-[140px]">
      <p className="text-[11px] font-semibold text-gray-500 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={`tooltip-${entry.name}`} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[12px] text-gray-600">
              {entry.name === 'ventes' ? 'Ventes' : 'Objectif'}
            </span>
          </div>
          <span className="text-[12px] font-mono font-semibold text-gray-900">
            {entry.value.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SalesChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-gray-900">Ventes des 7 derniers jours</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">En francs CFA (FCFA)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-primary-800 rounded" />
            <span className="text-[11px] text-gray-500">Ventes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-gray-300 rounded border-dashed" />
            <span className="text-[11px] text-gray-500">Objectif</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={salesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="objectifGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.08} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatFCFA}
            tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="objectif"
            stroke="#cbd5e1"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="url(#objectifGradient)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="ventes"
            stroke="#1e3a8a"
            strokeWidth={2}
            fill="url(#salesGradient)"
            dot={{ fill: '#1e3a8a', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#1e3a8a', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}