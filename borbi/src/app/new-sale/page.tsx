'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ClientSelector from './components/ClientSelector';
import ProductCart from './components/ProductCart';
import PaymentPanel from './components/PaymentPanel';
import VoiceInputButton from './components/VoiceInputButton';
import type { ParsedSale } from './components/VoiceInputButton';
import { RotateCcw, History, Mic, CheckCircle } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  phone: string;
  debtBalance: number;
  lastPurchase: string;
}

interface CartItem {
  product: {
    id: string;
    name: string;
    nameWolof: string;
    category: string;
    unit: string;
    priceCents: number;
    stock: number;
    sponsored: boolean;
  };
  quantity: number;
}

export default function NewSalePage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showVoice, setShowVoice] = useState(false);
  const [saleCount, setSaleCount] = useState(0);
  const [voiceNotification, setVoiceNotification] = useState('');

  const handleSaleComplete = () => {
    setSelectedClient(null);
    setCartItems([]);
    setShowVoice(false);
    setSaleCount((c) => c + 1);
  };

  const handleVoiceTranscription = (text: string, parsed?: ParsedSale) => {
    if (!parsed) return;

    const notifications: string[] = [];

    // Pre-fill client if name detected
    if (parsed.clientName) {
      notifications.push(`Client détecté : ${parsed.clientName}`);
      // Try to find matching client from mock data
      // In production this would search the actual client list
    }

    // Pre-fill cart items if products detected
    if (parsed.products && parsed.products.length > 0) {
      const productNames = parsed.products.map(p => `${p.quantity}× ${p.name}`).join(', ');
      notifications.push(`Produits : ${productNames}`);

      // Add detected products to cart as mock items
      const newItems: CartItem[] = parsed.products.map((p, idx) => ({
        product: {
          id: `voice-${idx}-${Date.now()}`,
          name: p.name,
          nameWolof: p.name,
          category: 'epicerie',
          unit: 'pièce',
          priceCents: 0, // Price to be set manually
          stock: 999,
          sponsored: false,
        },
        quantity: p.quantity,
      }));
      setCartItems(prev => [...prev, ...newItems]);
    }

    // Payment status
    if (parsed.paymentStatus) {
      const statusLabels: Record<string, string> = { PAID: 'Payé', PARTIAL: 'Partiel', UNPAID: 'Impayé' };
      notifications.push(`Paiement : ${statusLabels[parsed.paymentStatus]}`);
    }

    if (notifications.length > 0) {
      setVoiceNotification(`✓ ${notifications.join(' · ')}`);
      setTimeout(() => setVoiceNotification(''), 5000);
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0
  );

  return (
    <AppLayout pageTitle="Nouvelle Vente" pageSubtitle="Enregistrer une transaction">
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900">Nouvelle Vente</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {saleCount > 0 ? `${saleCount} vente(s) enregistrée(s) aujourd'hui` : "Enregistrez une transaction rapidement"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-all duration-150 active:scale-95">
            <History size={14} />
            Historique
          </button>
          <button
            onClick={() => { setSelectedClient(null); setCartItems([]); setVoiceNotification(''); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-all duration-150 active:scale-95"
            title="Réinitialiser le formulaire"
          >
            <RotateCcw size={14} />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Voice toggle banner */}
      <div className="mb-5">
        <button
          onClick={() => setShowVoice((v) => !v)}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200
            ${showVoice
              ? 'border-violet bg-violet-50 text-violet'
              : 'border-dashed border-gray-200 bg-white text-gray-500 hover:border-violet-300 hover:bg-violet-50/30 hover:text-violet'
            }
          `}
        >
          <Mic size={18} className="flex-shrink-0" />
          <div className="text-left flex-1">
            <p className="text-[13px] font-semibold">
              {showVoice ? 'Mode vocal activé (Web Speech API)' : 'Dicter la vente avec la voix'}
            </p>
            <p className="text-[11px] opacity-70 mt-0.5">
              Parlez en français, wolof ou anglais — le formulaire se remplit automatiquement
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet text-white flex-shrink-0">
            GRATUIT
          </span>
        </button>
      </div>

      {/* Voice notification */}
      {voiceNotification && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl animate-slide-up">
          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
          <p className="text-[12px] text-green-700 font-medium">{voiceNotification}</p>
        </div>
      )}

      {/* Voice input */}
      {showVoice && (
        <div className="mb-5 bg-violet-50 border border-violet-200 rounded-2xl p-5 flex items-center justify-center animate-slide-up">
          <VoiceInputButton onTranscription={handleVoiceTranscription} />
        </div>
      )}

      {/* 3-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5 items-start">
        {/* Panel 1: Client */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
          <ClientSelector
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
          />
        </div>

        {/* Panel 2: Cart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
          <ProductCart
            cartItems={cartItems}
            onCartChange={setCartItems}
          />
        </div>

        {/* Panel 3: Payment */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 lg:sticky lg:top-[88px]">
          <PaymentPanel
            client={selectedClient}
            cartItems={cartItems}
            onSaleComplete={handleSaleComplete}
          />
        </div>
      </div>

      {/* Mobile floating cart summary */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30">
          <div className="bg-primary-800 text-white rounded-2xl px-5 py-3 shadow-xl flex items-center justify-between animate-slide-up">
            <div>
              <p className="text-[11px] text-white/70 font-medium">
                {cartItems.reduce((s, i) => s + i.quantity, 0)} article(s) · {selectedClient ? selectedClient.name : 'Aucun client'}
              </p>
              <p className="text-[18px] font-mono font-bold">
                {(cartTotal / 100).toLocaleString('fr-FR')} FCFA
              </p>
            </div>
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="bg-success text-white px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-emerald-600 transition-colors active:scale-95"
            >
              Payer
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}