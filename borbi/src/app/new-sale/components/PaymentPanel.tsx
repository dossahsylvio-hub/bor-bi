'use client';

import React, { useState } from 'react';
import { CreditCard, Banknote, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  debtBalance: number;
}

interface CartItem {
  product: { id: string; name: string; priceCents: number; unit: string };
  quantity: number;
}

interface PaymentPanelProps {
  client: Client | null;
  cartItems: CartItem[];
  onSaleComplete: () => void;
}

type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID';

export default function PaymentPanel({ client, cartItems, onSaleComplete }: PaymentPanelProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wave' | 'orange' | 'other'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteText, setNoteText] = useState('');

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  const parsedAmountPaid = Math.round(parseFloat(amountPaid || '0') * 100);
  const remaining = cartTotal - parsedAmountPaid;
  const totalDebtAfter = (client?.debtBalance ?? 0) + (paymentStatus !== 'PAID' ? remaining : 0);

  const canSubmit = client && cartItems.length > 0 && (
    paymentStatus === 'PAID' ||
    paymentStatus === 'UNPAID' ||
    (paymentStatus === 'PARTIAL' && parsedAmountPaid > 0 && parsedAmountPaid < cartTotal)
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);

    // Backend integration: POST /api/vendor/transactions
    // Body: {
    //   vendorId: currentVendor.id,
    //   clientId: client.id,
    //   items: cartItems.map(i => ({ productId: i.product.id, qty: i.quantity, priceCents: i.product.priceCents })),
    //   totalCents: cartTotal,
    //   paymentStatus,
    //   amountPaid: paymentStatus === 'PAID' ? cartTotal : paymentStatus === 'UNPAID' ? 0 : parsedAmountPaid,
    //   note: noteText,
    //   vendorIp: '...'
    // }
    // Server computes: hash = SHA256(vendorId + clientId + totalCents + date + SECRET_KEY)
    // Server computes: platformFeeCents = Math.floor(totalCents * PLATFORM_FEE_RATE / 100)

    await new Promise((r) => setTimeout(r, 1100));
    setIsSubmitting(false);

    const statusLabels = { PAID: 'payée', PARTIAL: 'enregistrée (paiement partiel)', UNPAID: 'enregistrée (impayée)' };
    toast.success(`Vente ${statusLabels[paymentStatus]} pour ${client?.name}`, {
      description: `Total: ${(cartTotal / 100).toLocaleString('fr-FR')} FCFA`,
      duration: 4000,
    });
    onSaleComplete();
  };

  const paymentMethods = [
    { id: 'cash', label: 'Espèces', icon: <Banknote size={14} /> },
    { id: 'wave', label: 'Wave', icon: <CreditCard size={14} /> },
    { id: 'orange', label: 'Orange Money', icon: <CreditCard size={14} /> },
    { id: 'other', label: 'Autre', icon: <CreditCard size={14} /> },
  ] as const;

  return (
    <div className="space-y-4">
      <h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-wider">
        3. Paiement
      </h3>

      {/* Total */}
      <div className="bg-primary-800 rounded-xl p-4 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1">Total à encaisser</p>
        <p className="text-[32px] font-mono font-bold leading-none">
          {(cartTotal / 100).toLocaleString('fr-FR')}
        </p>
        <p className="text-[13px] text-white/70 mt-0.5">FCFA</p>
        {cartItems.length > 0 && (
          <p className="text-[11px] text-white/50 mt-2">
            {cartItems.reduce((s, i) => s + i.quantity, 0)} article(s) · {cartItems.length} référence(s)
          </p>
        )}
      </div>

      {/* Existing debt notice */}
      {client && client.debtBalance > 0 && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <AlertCircle size={14} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-semibold text-amber-800">Créance existante</p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              {client.name} a déjà{' '}
              <span className="font-mono font-bold">{(client.debtBalance / 100).toLocaleString('fr-FR')} FCFA</span>{' '}
              de créance en cours.
            </p>
          </div>
        </div>
      )}

      {/* Payment status */}
      <div>
        <label className="block text-[12px] font-semibold text-gray-700 mb-2">Statut du paiement</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'PAID', label: 'Payé', icon: <CheckCircle2 size={14} />, color: 'success' },
            { value: 'PARTIAL', label: 'Partiel', icon: <Clock size={14} />, color: 'warning' },
            { value: 'UNPAID', label: 'Impayé', icon: <AlertCircle size={14} />, color: 'danger' },
          ].map((opt) => (
            <button
              key={`pstatus-${opt.value}`}
              onClick={() => setPaymentStatus(opt.value as PaymentStatus)}
              className={`
                flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-[12px] font-semibold transition-all duration-150 active:scale-95
                ${paymentStatus === opt.value
                  ? opt.color === 'success' ?'border-success bg-emerald-50 text-success'
                    : opt.color === 'warning' ?'border-warning bg-amber-50 text-warning' :'border-danger bg-red-50 text-danger' :'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amount paid (for partial) */}
      {paymentStatus === 'PARTIAL' && (
        <div className="animate-slide-up">
          <label className="block text-[12px] font-semibold text-gray-700 mb-1">Montant encaissé (FCFA)</label>
          <p className="text-[11px] text-gray-400 mb-1.5">Le reste sera ajouté à la créance du client</p>
          <div className="relative">
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="0"
              max={cartTotal / 100}
              className="w-full px-3 py-2.5 pr-16 border border-gray-200 rounded-xl text-[14px] font-mono font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-semibold">FCFA</span>
          </div>
          {parsedAmountPaid > 0 && parsedAmountPaid < cartTotal && (
            <div className="mt-2 flex items-center justify-between text-[12px]">
              <span className="text-gray-500">Reste à payer :</span>
              <span className="font-mono font-bold text-danger">
                {(remaining / 100).toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          )}
        </div>
      )}

      {/* Payment method */}
      <div>
        <label className="block text-[12px] font-semibold text-gray-700 mb-2">Mode de paiement</label>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map((method) => (
            <button
              key={`pmethod-${method.id}`}
              onClick={() => setPaymentMethod(method.id)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-[12px] font-semibold transition-all duration-150 active:scale-95
                ${paymentMethod === method.id
                  ? 'border-primary-800 bg-primary-50 text-primary-800' :'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }
              `}
            >
              {method.icon}
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-[12px] font-semibold text-gray-700 mb-1">Note (optionnel)</label>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Remarque sur la vente..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[12px] text-gray-700 outline-none focus:ring-2 focus:ring-primary-200 resize-none transition-all"
        />
      </div>

      {/* Debt summary after sale */}
      {client && paymentStatus !== 'PAID' && cartItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-[11px] font-semibold text-danger mb-1">Créance après cette vente</p>
          <p className="text-[18px] font-mono font-bold text-danger">
            {(totalDebtAfter / 100).toLocaleString('fr-FR')} FCFA
          </p>
          <p className="text-[10px] text-danger/70 mt-0.5">
            Une relance SMS sera envoyée automatiquement à {client.name}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting || cartItems.length === 0}
        className={`
          w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-bold
          transition-all duration-150 active:scale-95 shadow-sm
          ${canSubmit && cartItems.length > 0
            ? 'bg-success text-white hover:bg-emerald-600' :'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
          disabled:opacity-60
        `}
        style={{ minWidth: 0 }}
      >
        {isSubmitting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <CheckCircle2 size={18} />
            Enregistrer la vente
          </>
        )}
      </button>

      {!client && (
        <p className="text-[11px] text-center text-gray-400">Sélectionnez d'abord un client</p>
      )}
      {cartItems.length === 0 && client && (
        <p className="text-[11px] text-center text-gray-400">Ajoutez au moins un article</p>
      )}
    </div>
  );
}