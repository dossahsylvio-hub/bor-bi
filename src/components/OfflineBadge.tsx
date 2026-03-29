'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { syncPendingSales, getPendingSales } from '@/lib/offline';

export default function OfflineBadge() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = async () => {
      setIsOnline(true);
      // Auto-sync on reconnect
      setSyncing(true);
      try {
        const count = await syncPendingSales();
        if (count > 0) {
          const remaining = await getPendingSales();
          setPendingCount(remaining?.filter(s => !s?.synced)?.length);
        }
      } finally {
        setSyncing(false);
      }
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check pending sales
    getPendingSales()?.then(sales => {
      setPendingCount(sales?.filter(s => !s?.synced)?.length);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && pendingCount === 0) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg text-sm font-medium ${
      isOnline ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {isOnline ? (
        syncing ? (
          <>
            <RefreshCw size={14} className="animate-spin" />
            Synchronisation...
          </>
        ) : (
          <>
            <RefreshCw size={14} />
            {pendingCount} vente(s) en attente de sync
          </>
        )
      ) : (
        <>
          <WifiOff size={14} />
          Hors ligne — {pendingCount > 0 ? `${pendingCount} vente(s) en attente` : 'Mode hors ligne'}
        </>
      )}
    </div>
  );
}
