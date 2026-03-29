'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  productName: string;
  unit: string;
  priceCents: number;
  stock: number;
  lowStockAlert: number;
}

interface EditProductPanelProps {
  product: Product | null;
  onClose: () => void;
}

interface FormData {
  priceCents: number;
  stock: number;
  lowStockAlert: number;
  adjustmentReason: string;
  adjustmentQty: number;
}

export default function EditProductPanel({ product, onClose }: EditProductPanelProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>();

  useEffect(() => {
    if (product) {
      reset({
        priceCents: product.priceCents / 100,
        stock: product.stock,
        lowStockAlert: product.lowStockAlert,
        adjustmentReason: 'restock',
        adjustmentQty: 0,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    // Backend integration: PATCH /api/vendor/products/:id
    // Body: { priceCents: data.priceCents * 100, stock: data.stock, lowStockAlert: data.lowStockAlert }
    // Also: POST /api/vendor/stock-movements if adjustmentQty > 0
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    toast.success(`"${product?.productName}" mis à jour avec succès`);
    onClose();
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Modifier le produit</h2>
            <p className="text-[12px] text-gray-400 mt-0.5 truncate max-w-[280px]">{product.productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Price */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              Prix de vente (FCFA)
            </label>
            <p className="text-[11px] text-gray-400 mb-1.5">Prix par {product.unit}</p>
            <div className="relative">
              <input
                type="number"
                step="100"
                {...register('priceCents', {
                  required: 'Le prix est obligatoire',
                  min: { value: 1, message: 'Le prix doit être supérieur à 0' },
                })}
                className={`w-full px-3 py-2.5 pr-16 border rounded-lg text-[13px] font-mono text-gray-900 outline-none focus:ring-2 focus:ring-primary-200 transition-all ${errors.priceCents ? 'border-danger' : 'border-gray-200 focus:border-primary-400'}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-semibold">FCFA</span>
            </div>
            {errors.priceCents && (
              <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                <AlertTriangle size={10} />
                {errors.priceCents.message}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              Stock actuel
            </label>
            <p className="text-[11px] text-gray-400 mb-1.5">Quantité disponible en {product.unit}</p>
            <input
              type="number"
              {...register('stock', {
                required: 'Le stock est obligatoire',
                min: { value: 0, message: 'Le stock ne peut pas être négatif' },
              })}
              className={`w-full px-3 py-2.5 border rounded-lg text-[13px] font-mono text-gray-900 outline-none focus:ring-2 focus:ring-primary-200 transition-all ${errors.stock ? 'border-danger' : 'border-gray-200 focus:border-primary-400'}`}
            />
            {errors.stock && (
              <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                <AlertTriangle size={10} />
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* Low stock threshold */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              Seuil d'alerte
            </label>
            <p className="text-[11px] text-gray-400 mb-1.5">Vous serez alerté quand le stock passe sous ce seuil</p>
            <input
              type="number"
              {...register('lowStockAlert', {
                required: 'Le seuil est obligatoire',
                min: { value: 1, message: 'Le seuil doit être au moins 1' },
              })}
              className={`w-full px-3 py-2.5 border rounded-lg text-[13px] font-mono text-gray-900 outline-none focus:ring-2 focus:ring-primary-200 transition-all ${errors.lowStockAlert ? 'border-danger' : 'border-gray-200 focus:border-primary-400'}`}
            />
            {errors.lowStockAlert && (
              <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                <AlertTriangle size={10} />
                {errors.lowStockAlert.message}
              </p>
            )}
          </div>

          {/* Adjustment */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
            <p className="text-[12px] font-semibold text-gray-700">Mouvement de stock rapide</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Raison</label>
                <select
                  {...register('adjustmentReason')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] text-gray-700 outline-none focus:ring-2 focus:ring-primary-200 bg-white"
                >
                  <option value="restock">Réapprovisionnement</option>
                  <option value="adjustment">Ajustement</option>
                  <option value="return">Retour client</option>
                  <option value="loss">Perte/Casse</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Quantité (+/-)</label>
                <input
                  type="number"
                  {...register('adjustmentQty')}
                  placeholder="ex: +10 ou -2"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[12px] font-mono text-gray-900 outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>
          </div>

          {/* Unsaved warning */}
          {isDirty && (
            <div className="flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertTriangle size={12} />
              Modifications non sauvegardées
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-150 active:scale-95"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-800 text-white text-[13px] font-semibold hover:bg-primary-700 transition-all duration-150 active:scale-95 disabled:opacity-60"
              style={{ minWidth: 0 }}
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>
                  <Save size={14} />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}